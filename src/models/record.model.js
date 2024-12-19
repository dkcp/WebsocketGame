import { getRecords } from "../init/assets.js";
import { setRedis } from "../utils/redisClient.js";

export const initRecord = async (uuid) => {
    const records = getRecords();
    records[uuid] = { highScore:0 };
    await setRedis('records', JSON.stringify(records));
    console.log('레코드 초기화 완료:', getRecords());

    
}

// { userId:myid, myhighscore, mycleartime }
export const getMyRecord = (userId) => {
    const records = getRecords();
    return Object.entries(records).find(a => a.userId===userId);
}

export const setScore = async (uuid, score) => {
    const records = getRecords();
    for(const record of records){
        if(record.userId===uuid) {
            record.highScore = score;
        }
    }
    await setRedis('records', JSON.stringify(records));
    console.log('레코드 셋팅 완료:', getRecords());
};

export const setRecord = async (uuid, score, timestamp) => {
    const records = getRecords();
    for(const record of records){
        if(record.userId===uuid) {
            record.highScore = score;
        }
    }
    await setRedis('records', JSON.stringify(records));
};

// 기록된 제일 높은 점수
export const getHighScore = () => {
    const records = getRecords();
    return Object.entries(records).sort((a,b)=>b[1].highScore-a[1].highScore)[0][1].highScore;
};