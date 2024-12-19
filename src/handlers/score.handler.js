import { getGameAssets } from '../init/assets.js';
import { addScore } from '../models/score.model.js';

let recent_timestamp = null;

// sendEvent(16, { item_id, timestamp })
export const getItemScore = (uuid, payload) => {

    if(recent_timestamp===null) recent_timestamp = payload.timestamp;
    else {
        const elapsedTime = (payload.timestamp - recent_timestamp)/1000;
        if(elapsedTime<5) return { status: 'fail', message: '아이템 너무 빨리 먹어서 어뷰징 아닌가 의심됨' };
    }

    const { stages, items } = getGameAssets();

    //payload.item_id 가 현재 스테이지에서 unlock된 id 맞나?

    if(payload.item_id<7){
        const score = items.data.find(item=> item.id === payload.item_id).score;
    
        if (!score) {
            return { status: 'fail', message: `get item score fail` };
        }

        const updatedScore = addScore(uuid, score);

        return { responseId: 16, status : 'success', updatedScore};
    }else if(payload.item_id===17){
        return { responseId: 17, status : 'success', type:'hp up' };
    }else if(payload.item_id===18){
        return { responseId: 18, status : 'success', type:'speed up' };
    }else if(payload.item_id===19){
        return { responseId: 19, status : 'success', type:'weapon upgrade' };
    }
  };


// sendEvent(21, { enemy_id })
export const getEnemyScore = (uuid, payload) => {
    const { stages, enemies } = getGameAssets();
    const score = enemies.data.find(enemy=> enemy.id === payload.enemy_id).score;

    if (!score) {
        return { status: 'fail', message: `get enemy score fail` };
    }

    const updatedScore = addScore(uuid, score);

    return { responseId: 21, status: 'success', updatedScore };
};
