import { CLIENT_VERSION } from './Constants.js';
import {
	updateScore,
	playerHpUp,
	playerSpeedUp,
	setStageInfo,
	unlockEnemy,
	unlockItem,
	setHighScore
} from './index.js';
import Score from './Score.js';

const socket = io('http://43.201.107.19:3000/', {
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
				// #구현해라
				break;
			case 21: // enemy score
				updateScore(data.updatedScore);
				break;
			case 51: //game over
				setStageInfo(data.stageInfo);
				setHighScore(data.highScore);
				break;
			case 52: //all clear
				console.log('올클리어 이벤트(서버콜)');
        // #구현해라
				break;
			default:
				break;
		}
	} else {
		console.log('이벤트 처리 실패 메시지 : ', data.responseId);
	}
});

socket.on('connection', data => {
	const user = window.localStorage.getItem('client');
	if (user) {
		console.log('connection: ', data);
		console.log(`로컬 유저 확인 완료. ${user}`);
		userId = user;
	} else {
		console.log('connection: ', data);
		userId = data.uuid;
		window.localStorage.setItem('client', userId);
		console.log(`로컬에 유저가 없습니다. ${userId}`);
	}

	if (data.highRecord) {
		console.log('최고점수:', data.highRecord);
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

socket.on('broadcast', data => {
	Score.setHighScore(data.broadcase[1]);
	if (data.highRecord) {
		console.log('최고점수:', data.highRecord);
	}
});

export { sendEvent };
