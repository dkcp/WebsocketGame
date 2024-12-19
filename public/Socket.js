import { CLIENT_VERSION } from './Constants.js';
import {
	updateScore,
	playerHpUp,
	playerSpeedUp,
	setStageInfo,
	unlockEnemy,
	unlockItem,
	setHighScore,
	playerWeaponUpgrade
} from './index.js';
import Score from './Score.js';

const socket = io('http://43.201.107.19:3000/', {
//const socket = io('http://localhost:3000/', {
	query: {
		clientVersion: CLIENT_VERSION
	}
});

let userId = null;
socket.on('response', data => {
	console.log(data);
	if (data.status === 'success') {
		switch (data.responseId) {
			case 2: //start game
				setStageInfo(data.stageInfo);
				unlockEnemy(data.unlockEnemyDatas);
				unlockItem(data.unlockItemDatas);
				break;
			case 3: //end game
				break;
			case 11: //move stage -> updata stageInfo in score.js -> unlock enemy&item
				setStageInfo(data.stageInfo);
				unlockEnemy(data.unlockEnemyDatas);
				unlockItem(data.unlockItemDatas);
				break;
			case 16: //item score
				updateScore(data.updatedScore);
				break;
			case 17: // hp up
				playerHpUp();
				break;
			case 18: // speed up
				playerSpeedUp();
				break;
			case 19: // weapon upgrade
				playerWeaponUpgrade();
				break;
			case 21: // enemy score
				updateScore(data.updatedScore);
				break;
			case 51: //game over
				setStageInfo(data.stageInfo);
				if(data.message) console.log(data.message);
				break;
			case 52: //all clear
				console.log('올클리어 이벤트(서버콜)');
        // #구현해라
				break;
			default:
				break;
		}
	} else {
		console.log('----------------------------');
		console.log('이벤트 처리 실패', data);
		console.log('----------------------------');
	}
});

socket.on('connection', data => {
	console.log('connection: ', data);
	userId = data.uuid;
	
	if (data.highScore) {
		setHighScore(data.highScore);
	}
});

const sendEvent = (handlerId, payload) => {
	socket.emit('event', {
		userId,
		clientVersion: CLIENT_VERSION,
		handlerId,
		payload
	});
};

// 최고기록 브로드캐스트
socket.on('updateHighScore', data => {
	if (data.newHighScore) {
		console.log('새로운 최고점수:', data.newHighScore);
	}
	setHighScore(data.newHighScore);
});

export { sendEvent };
