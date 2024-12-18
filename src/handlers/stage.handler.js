import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

// 클라이언트에서 호출 sendEvent(11, payload : { currentStage: 1000, targetStage: 1001 })
export const moveStageHandler = (userId, payload) => {
	// 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
	let currentStages = getStage(userId);
	console.log(`[stage.handler.js]currentStages:${currentStages}`);
	if (!currentStages.length) {
		return { status: 'fail', message: '[stage.handler.js]No stages found for user' };
	}

	// 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
	currentStages.sort((a, b) => a.id - b.id);
	const currentStage = currentStages[currentStages.length - 1];

	// payload 의 currentStage 와 비교
	if (currentStage.id !== payload.currentStage) {
		return {
			status: 'fail',
			message: `[stage.handler.js]Current stage mismatch. cur:${currentStage.id} payload:${payload.currentStage}`
		};
	}

	// 점수 검증
	const serverTime = Date.now();
	const elapsedTime = (serverTime - currentStage.timestamp) / 1000; // 초 단위로 계산

	// 1초당 1점, 100점이상 다음스테이지 이동, 오차범위 2초
	// 클라이언트와 서버 간의 통신 지연시간을 고려해서 오차범위 설정
	// elapsedTime 은 100 이상 105 이하 일 경우만 통과
	// if (elapsedTime < 8 || elapsedTime > 120) {
	//     return { status: 'fail', message: '[stage.handler.js]Invalid elapsed time :', elapsedTime };
	// }

	// 올클?
	if (payload.targetStage > 1006) {
		return { handlerId: 12, status: 'all clear' };
	}

	// 게임 에셋에서 다음 스테이지의 존재 여부 확인
	const { stages, items, enemys, itemUnlocks } = getGameAssets();
	if (!stages.data.some(stage => stage.id === payload.targetStage)) {
		return { status: 'fail', message: '[stage.handler.js]Target stage does not exist... stages :' };
	}

	const stageInfo = Object.values(stages.data).find(stage => stage.id === payload.targetStage);

    const unlockItemIds = Object.values(itemUnlocks.data).find(unlockInfo => (unlockInfo.stage_id === payload.targetStage)).item_id;
    const unlockEnemyIds = Object.values(itemUnlocks.data).find(unlockInfo => (unlockInfo.stage_id === payload.targetStage)).enemy_id;


    const unlockItemDatas = Object.values(items.data).filter(item => unlockItemIds.includes(item.id));
    const unlockEnemyDatas = Object.values(enemys.data).filter(enemy => unlockEnemyIds.includes(enemy.id));

    console.log(payload.targetStage, '해금아이템목록', unlockItemDatas);
    console.log(payload.targetStage, '해금적목록록', unlockEnemyDatas);
    
	// 유저의 다음 스테이지 정보 업데이트 + 현재 시간
	setStage(userId, payload.targetStage, serverTime);
	return {
		handlerId: 11,
		status: 'success',
		stageInfo,
		unlockItemDatas,
		unlockEnemyDatas
	};
};
