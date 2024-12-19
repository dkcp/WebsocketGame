const scores = {};

export const createScore = (uuid) => {
    scores[uuid] = 0;
}

export const getScore = (uuid, score) => {
    return scores[uuid];
}

export const setScore = (uuid, score) => {
    return scores[uuid] = score;
}

export const addScore = (uuid, score) => {
    return scores[uuid] += score;
}

export const clearScore = (uuid) => {
    scores[uuid] = 0;
}