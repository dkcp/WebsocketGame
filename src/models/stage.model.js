const stages = {};
// {
//     uuid : [ {stageId1, time1}, {stageId2, time2} ],
// }

export const createStage = (uuid) => {
    stages[uuid] = []; // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
    return stages[uuid];
};

export const setStage = (uuid, targetStageId, timestamp) => {
    console.log(`유저 스테이지 갱신 : ${uuid}, 스테이지${targetStageId}`);
    stages[uuid].push({ id:targetStageId, timestamp });
    return targetStageId;
};

export const clearStage = (uuid) => {
    stages[uuid] = [];
}