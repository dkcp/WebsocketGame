import { response } from 'express';
import { getGameAssets, getRecords, updateRecords } from '../init/assets.js';
import { getHighScore, getMyRecord, initRecord } from '../models/record.model.js';
import { createScore, setScore } from '../models/score.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { cleanupRedis, getRedis, setRedis } from '../utils/redisClient.js';
import { getUser } from '../models/user.model.js';

// 클라이언트에서 호출 sendEvent(2, { timestamp: Date.now() })
// 게임오버나 게임클리어후 다시 시작하면 실행됨됨
export const gameStart = async (uuid, payload) => {
	const { stages, items, enemies, itemUnlocks } = getGameAssets();
	clearStage(uuid);
	setStage(uuid, Object.values(stages.data)[0].id, payload.timestamp);
	createScore(uuid);

	let stageInfo = stages.data.find(stage => stage.id === payload.currentStageId);
	if (!stageInfo) return { status: 'fail', message: `stage not found ${payload.currentStageId}` };

	const unlockItemIds = Object.values(itemUnlocks.data)[0].item_id;
	const unlockEnemyIds = Object.values(itemUnlocks.data)[0].enemy_id;

	const unlockItemDatas = Object.values(items.data).filter(item => unlockItemIds.includes(item.id));
	const unlockEnemyDatas = Object.values(enemies.data).filter(enemy => unlockEnemyIds.includes(enemy.id));

	return { responseId: 2, status: 'success', stageInfo, unlockItemDatas, unlockEnemyDatas };
};

// sendEvent(3, { score })
export const gameEnd = async (uuid, payload) => {
	const { stages } = getGameAssets();
	const records = getRecords();
	let stageInfo = stages.data.find(stage => stage.id === 1000);
	if (!stageInfo) return { status: 'fail', message: `1000 stage not found` };

	if(!getUser().find(user=>user.uuid===uuid) || !Object.keys(records).includes(uuid) ){
		console.log(`수상한 유저 ${uuid}`);
		return {status:'fail', message:'수상한 유저'};
	}

	const finalScore = payload.score;

	// 전체 최고 기록보다 높은 경우 -> 전체 최고 점수 변경 및 모든 클라이언트에게 새로운 최고 점수 알림
	const entireHighScore = getHighScore();
	console.log('전체최고기록:', entireHighScore);
	if (entireHighScore < finalScore) {
		console.log('내최고점수', records[uuid].highScore, '새점수', finalScore);
		try {
			if(!records[uuid]) records[uuid] = { highScore: finalScore };
			else records[uuid].highScore = finalScore;
			await setRedis('records', JSON.stringify(records));
		} catch (error) {
			console.log('------------------------');
			console.log(error);
			console.log(records[uuid]);
			console.log(finalScore);

		}

		// newHighScore -> 브로드캐스트
		return { responseId: 51, status:'success', stageInfo, message:'새로운 최고 기록!', newHighScore: finalScore };
	}

	// 클라이언트 최고 기록보다 높은 경우 -> 클라이언트의 최고 점수 변경 후 레디스 저장
	const myHighScore = getMyRecord();
	console.log('개인최고기록:', myHighScore);
	if (myHighScore < finalScore){
		const records = getRecords();
		if(!records[uuid]) records[uuid] = { highScore: finalScore };
		else records[uuid].highScore = finalScore;
		await setRedis('records', JSON.stringify(records));

		return { responseId: 51, status:'success', stageInfo, message:'새로운 개인 최고 기록', myHighScore: finalScore };
	}

	return { responseId: 51, status:'success', stageInfo, message:'기록 갱신 없음' };
};