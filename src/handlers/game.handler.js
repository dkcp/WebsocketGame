import { getGameAssets } from '../init/assets.js';
import { createScore, setScore } from '../models/score.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { cleanupRedis, getRedis, initRedis, redisClient, setRedis } from '../utils/redisClient.js';

// 클라이언트에서 호출 sendEvent(2, { timestamp: Date.now() })
export const gameStart = (uuid, payload) => {
	const { stages } = getGameAssets();
	clearStage(uuid);
	createScore(uuid);

	setStage(uuid, payload.currentStageId, payload.timestamp);

	let stageInfo = stages.data.find(stage => stage.id === payload.currentStageId);
	if (!stageInfo) return { status: 'fail', message: `stage not found ${payload.currentStageId}` };

	return { responseId: 2, status: 'success', stageInfo };
};

export const gameOver = async (uuid, payload) => {
	const { stages } = getGameAssets();
	let stageInfo = stages.data.find(stage => stage.id === 1000);
	if (!stageInfo) return { status: 'fail', message: `1000 stage not found` };

	const finalScore = payload.score;
    const highScore = await getRedis('highScore');

    if(highScore < finalScore){
        await setRedis('highScore', finalScore);
        return { responseId: 51, status: 'success', stageInfo, highScore:finalScore };
    }else
        return { responseId: 51, status: 'success', stageInfo, highScore };
};

export const gameClear = async (uuid, payload) => {
	const { stages } = getGameAssets();
	let stageInfo = stages.data.find(stage => stage.id === 1000);
	if (!stageInfo) return { status: 'fail', message: `1000 stage not found` };

	const finalScore = payload.score;
    const highScore = await getRedis('highScore');
    if(highScore < finalScore)
        await setRedis('highScore', finalScore);

    return { responseId: 52, status: 'success', stageInfo, highScore }
};




export const gameEnd = (uuid, payload) => {
	// 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
	const { timestamp: gameEndTime, score } = payload;
	const stages = getStage(uuid);

	if (!stages.length) {
		return { status: 'fail', message: 'No stages found for user' };
	}

	setScore(uuid, score);

	// 각 스테이지의 지속 시간을 계산하여 총 시간 계산
	let totalTime = 0;
	stages.forEach((stage, index) => {
		let stageEndTime;
		if (index === stages.length - 1) {
			// 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간
			stageEndTime = gameEndTime;
		} else {
			// 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
			stageEndTime = stages[index + 1].timestamp;
		}
		const stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지 지속 시간 (초 단위)
		totalTime += stageDuration;
	});

	// 모든 검증이 통과된 후, 클라이언트에서 제공한 점수 저장하는 로직
	// saveGameResult(userId, clientScore, gameEndTime);
	// 검증이 통과되면 게임 종료 처리
    cleanupRedis();
	return { status: 'success', message: 'Game ended successfully', score };
};