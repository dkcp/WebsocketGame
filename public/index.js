import Player from './Player.js';
import BackGround from './Background.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import './Socket.js';
import { sendEvent } from './Socket.js';
import EnemyController from './EnemyController.js';
import Ui from './Ui.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 1;
const GAME_TIME_PER_STAGE = 100000;

// 게임 크기
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1.5; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62

// 배경
const BACKGROUND_WIDTH = GAME_WIDTH;
const BACKGROUND_HEIGHT = GAME_HEIGHT;
const BACKGROUND_SPEED = 0.5;

let stageLevel = 1;
let gameTimer = GAME_TIME_PER_STAGE;

// 선인장
const CACTI_CONFIG = [
	{ width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
	{ width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
	{ width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' }
];

// 게임 요소들
let player = null;
let background = null;
let ui = null;
let cactiController = null;
let itemController = null;
let enemyController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let gameClear = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
	// 비율에 맞는 크기
	// 유저
	const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
	const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;

	// 배경
	const backGroundWidthInGame = BACKGROUND_WIDTH * scaleRatio;
	const backGroundHeightInGame = BACKGROUND_HEIGHT * scaleRatio;

	player = new Player(ctx, playerWidthInGame, playerHeightInGame, scaleRatio);
	background = new BackGround(ctx, backGroundWidthInGame, backGroundHeightInGame, BACKGROUND_SPEED, scaleRatio);

	const cactiImages = CACTI_CONFIG.map(cactus => {
		const image = new Image();
		image.src = cactus.image;
		return {
			image,
			width: cactus.width * scaleRatio,
			height: cactus.height * scaleRatio
		};
	});

	enemyController = new EnemyController(ctx, scaleRatio, BACKGROUND_SPEED);
	cactiController = new CactiController(ctx, cactiImages, scaleRatio, BACKGROUND_SPEED);
	itemController = new ItemController(ctx, scaleRatio, BACKGROUND_SPEED);

	score = new Score(ctx, scaleRatio);
    ui = new Ui(ctx, scaleRatio, score);
}

function getScaleRatio() {
	const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
	const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

	// window is wider than the game width
	if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
		return screenWidth / GAME_WIDTH;
	} else {
		return screenHeight / GAME_HEIGHT;
	}
}

function setScreen() {
	scaleRatio = getScaleRatio();
	canvas.width = GAME_WIDTH * scaleRatio;
	canvas.height = GAME_HEIGHT * scaleRatio;
	createSprites();
}

setScreen();
window.addEventListener('resize', setScreen);

function setupGameReset() {
	if (!hasAddedEventListenersForRestart) {
		hasAddedEventListenersForRestart = true;

		setTimeout(() => {
			window.addEventListener('keyup', reset, { once: true });
		}, 1000);
	}
}

if (screen.orientation) {
	screen.orientation.addEventListener('change', setScreen);
}

function reset() {
	hasAddedEventListenersForRestart = false;
	gameover = false;
	waitingToStart = false;

	player.reset();
	background.reset();
	player.ammoController.reset();
	enemyController.reset();
	itemController.reset();
	score.reset();
	gameSpeed = GAME_SPEED_START;
	sendEvent(2, { timestamp: Date.now(), currentStageId: score.currentStageId }); //#gameStart
}

window.addEventListener('keyup', reset, { once: true });

function clearScreen() {
	//ctx.fillStyle = 'white';
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
	if (previousTime === null) {
		previousTime = currentTime;
		requestAnimationFrame(gameLoop);
		return;
	}

	// 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
	// 프레임 렌더링 속도
	const deltaTime = currentTime - previousTime;
	previousTime = currentTime;

	clearScreen();

	if (!gameover && !waitingToStart) {
		// update
		
		background.update(gameSpeed, deltaTime);
		// 선인장
		cactiController.update(gameSpeed, deltaTime);
		itemController.update(gameSpeed, deltaTime);
		// 달리기
		enemyController.update(gameSpeed, deltaTime);

		score.update(deltaTime);
		player.ammoController.update(gameSpeed, deltaTime);
		player.update(gameSpeed, deltaTime, background);
	}

	// 선인장 충돌
	if (!gameover && cactiController.collideWith(player)) {
		let cactiYposition = cactiController;
		player.hit();
	}

	// 아이템 충돌
	itemController.collideWith(player);

	// 적과의 충돌
	const collideWithEnemy = enemyController.collideWith(player);
	if (collideWithEnemy) {
		player.hit();
		if (player.hp <= 0 && !gameover) {
			gameover = true;
			setupGameReset();
			//gameEnd
			sendEvent(3, { score:Math.floor(score.score) });
		}
	}

	// 총알과 적 충돌
	player.ammoController.collideWithEnemies(enemyController);

	// draw
	background.draw();
	enemyController.draw();
	cactiController.draw();
	score.draw();
	itemController.draw();
	player.ammoController.draw();
	if (gameover) {
		player.image = player.Images.dieImage;
	}
	player.draw();

	if (gameover) {
		showGameOver();
	}

	if (waitingToStart) {
		showStartGameText();
	}

	// 재귀 호출 (무한반복)
	requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

export function setStageInfo(stageInfo) {
    gameSpeed = stageInfo.gameSpeed;
	score.setStageInfo(stageInfo);
	stageLevel = stageInfo.level;
	enemyController.setTimerByStage(stageInfo.level);
	gameTimer = GAME_TIME_PER_STAGE;
}

export function unlockEnemy(unlockEnemies) {
    enemyController.unlockEnemy(unlockEnemies);
}

export function unlockItem(unlockItems) {
    itemController.unlockItem(unlockItems);
}

export function updateScore(updatedScore) {
	console.log(updatedScore);
    score.updateScore(updatedScore);
}

export function playerHpUp() {
    player.hpUp();
}

export function playerSpeedUp() {
    player.speedUp();
}

export function playerWeaponUpgrade() {
    player.weaponUpgrade();
}

export function setHighScore(highScore){
	score.setHighScore(highScore);
}

function showGameOver() {
	const fontSize = 70 * scaleRatio;
	ctx.font = `${fontSize}px Verdana`;
	ctx.fillStyle = '#ff3040';
	const x = canvas.width / 2 - fontSize*4;
	const y = canvas.height / 2;
	ctx.fillText('GAME OVER', x, y);
}

function showCountDown(countNum){
	const fontSize = 50 * scaleRatio;
	ctx.font = `${fontSize}px Verdana`;
	ctx.fillStyle = '#ff3040';
	const x = canvas.width / 2 - fontSize / 2;
	const y = canvas.height / 1.5;
	ctx.fillText(`${countNum}`, x, y);
}

function showStartGameText() {
	const fontSize = 40 * scaleRatio;
	ctx.font = `${fontSize}px Verdana`;
	ctx.fillStyle = 'grey';
	const x = canvas.width / 6;
	const y = canvas.height / 1.5;
	ctx.fillText('Tap Screen or Press Space To Start', x, y);
}

function showClearText() {
	const fontSize = 100 * scaleRatio;
	ctx.font = `bolder ${fontSize}px Verdana`;
	ctx.fillStyle = '#ff8000';
	ctx.fillText('ALL STAGE CLEAR!', canvas.width / 4.5, canvas.height / 2);
}