import Enemy from './Enemy.js';

class EnemyController {
	INTERVAL_MIN = 3000;
	INTERVAL_MAX = 4000;
	SPACESHIP_COUNT = 7;

	nextInterval = null;

	spaceshipImages = [];
	spaceshipHitImages = [];

	unlockedEnemies = [];

	constructor(ctx, scaleRatio, speed) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
		this.speed = speed;
		this.enemies = [];

		for (let i = 1; i <= this.SPACESHIP_COUNT; i++) {
			const spaceshipImage = new Image();
			const spaceshipHitImage = new Image();
			spaceshipImage.src = 'images/enemy/spaceship_' + i + '.png';
			spaceshipHitImage.src = 'images/enemy/spaceship_' + i + '_hit.png';
			this.spaceshipImages.push(spaceshipImage);
			this.spaceshipHitImages.push(spaceshipHitImage);
		}

		this.setNextEnemyTime();
	}

	createEnemy() {
		const index = this.getRandomNumber(0, this.unlockedEnemies.length - 1);
		const x = this.canvas.width * 1.5;
		const y = this.getRandomNumber(10, this.canvas.height - 110);

		const enemy = new Enemy(
			this.ctx,
			this.spaceshipImages[index],
			this.spaceshipHitImages[index],
			this.unlockedEnemies[index],
			this.scaleRatio,
		);
		this.enemies.push(enemy);
	}

	update(gameSpeed, deltaTime) {
		if (this.nextInterval <= 0) {
			this.createEnemy();
			this.setNextEnemyTime();
		}

		this.nextInterval -= deltaTime;

		// 각 객체의 좌표,이미지 업데이트
		this.enemies.forEach(enemy => {
			enemy.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
		});

		this.enemies = this.enemies.filter(enemy => enemy.x > -enemy.width && !enemy.isDie);
	}

	draw() {
		this.enemies.forEach(item => item.draw());
	}

	collideWith(sprite) {
		const collidedItem = this.enemies.find(enemy => enemy.collideWith(sprite));
		return this.enemies.some(enemy => enemy.collideWith(sprite));
	}

	reset() {
		this.enemies = [];
	}

	unlockEnemy(unlockEnemies) {
		this.unlockedEnemies = unlockEnemies;
	}

	setNextEnemyTime() {
		this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	setTimerByStage(stageLevel) {
		this.INTERVAL_MIN = 1000 - (stageLevel*100);
		this.INTERVAL_MAX = 2000 - (stageLevel*200);
	}
}

export default EnemyController;
