import { getGameAssets } from '../init/assets.js';
import { addScore } from '../models/score.model.js';

let recent_timestamp = null;

// sendEvent(16, { item_id, timestamp })
export const getItemScore = (uuid, payload) => {

    if(recent_timestamp===null) recent_timestamp = payload.timestamp;
    else {
        const elapsedTime = (payload.timestamp - recent_timestamp)/1000;
        if(elapsedTime<3) return { status: 'fail', message: '아이템 너무 빨리 먹어서 어뷰징 아닌가 의심됨' };
    }

    const { items } = getGameAssets();

    //payload.item_id 가 현재 스테이지에서 unlock된 id 맞나?

    if(payload.item_id<7){
        const item = items.data.find(item=> item.id === payload.item_id);
        if (!item) {
            return { status: 'fail', message: `item not found` };
        }
        const score = item.score;
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
    const { enemies } = getGameAssets();
    const enemy = enemies.data.find(enemy=> enemy.id === payload.enemy_id);
    if( !enemy){
        return { status: 'fail', message: `enemy_id not found` };
    }
    const score = enemy.score;
    if (!score) {
        return { status: 'fail', message: `get enemy score fail` };
    }

    const updatedScore = addScore(uuid, score);
    if(payload.enemy_id!==7){
        return { responseId: 21, status: 'success', updatedScore };
    }else
        return { responseId: 52, status: 'success', updatedScore };

};
