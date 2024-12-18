const scores = {};

export const createScore = (uuid) => {
    scores[uuid] = 0; // 초기 스테이지 배열 생성
};

export const getScore = (uuid) => {
    return scores[uuid];
};

export const setScore = (uuid, score) => {
    console.log(`유저 점수 갱신 : ${uuid}, 점수수${score}`);
    stages[uuid] = score;
    return stages[uuid];
};

export const clearScore = (uuid) => {
    stages[uuid] = 0;
}

// 최고점수 [uid, score]
export const getHighScore = ()=>{
    return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];
}