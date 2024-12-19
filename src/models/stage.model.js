//유저의 스테이지들, 스테이지별 최고기록
const stages = {};
// {uuid : [ {stageId1, time1}, {stageId2, time2} ],}

export const createStage = (uuid) => {
    stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
    return stages[uuid];
};

export const setStage = (uuid, targetStageId, timestamp) => {
    stages[uuid].push({ id:targetStageId, timestamp});
    console.log(`유저 스테이지 갱신 : ${stages}`);
    return targetStageId;
};

export const clearStage = (uuid) => {
    stages[uuid] = [];
}
