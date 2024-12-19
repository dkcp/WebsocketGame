const scores = {};

export const createScore = (uuid) => {
    scores[uuid] = 0; // 초기 스테이지 배열 생성
};

export const getScore = (uuid) => {
    return scores[uuid];
};

export const setScore = (uuid, score) => {
    console.log(`유저 점수 갱신 : ${uuid}, 점수:${score}`);
    return scores[uuid] = score;
};

export const addScore = (uuid, score) => {
    console.log(`유저 점수 획득 : ${uuid}, 점수:${score}`);
    scores[uuid] += score;

    return scores[uuid];
}

export const clearScore = (uuid) => {
    scores[uuid] = 0;
}

// 최고점수 [uid, score][1]
export const getHighScore = ()=>{
    return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][1];
}
