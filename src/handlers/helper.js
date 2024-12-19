import { CLIENT_VERSION } from '../contants.js';
import { getGameAssets } from '../init/assets.js';
import { getHighScore, initRecord } from '../models/record.model.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import { cleanupRedis } from '../utils/redisClient.js';
import handlerMappings from './handlerMapping.js';

export const handleConnection = async (socket, uuid) => {
    console.log(`[helper.js]New user connected: ${uuid} with socket ID ${socket.id}`);
    console.log('[helper.js]Current users:', getUser());
    const highScore = getHighScore();

    createStage(uuid);
	await initRecord(uuid);

    // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
    // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다.
    socket.emit('connection', { uuid, highScore });
};

export const handleEvent = async (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: 'Cleint version mismatch' });
        return;
    }

    let handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit('response', { status: 'fail', message: 'Handler mismatch' });
        return;
    }

    const response = await handler(data.userId, data.payload);
    console.log(data.handlerId, '결과:', response);

    if (response.newHighScore) {
        io.emit('updateHighScore', { newHighScore:response.newHighScore });
        console.log('새로운 최고점수 브로드캐스트:', response.newHighScore);
        return;
    }

    socket.emit('response', response);
};

export const handleDisconnect = async (socket, uuid) => {
    removeUser(socket.id);
    await cleanupRedis();
    console.log(`User disconnected: ${socket.id}`);
    console.log(`Current users: `, getUser());
};