import { CLIENT_VERSION } from '../contants.js';
import { getGameAssets } from '../init/assets.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleConnection = (socket, uuid) => {
    console.log(`[helper.js]New user connected: ${uuid} with socket ID ${socket.id}`);
    console.log('[helper.js]Current users:', getUser());

    createStage(uuid);

    // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
    // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다.
    socket.emit('connection', { uuid });
    console.log(`[helper.js]connection 이벤트 발생 ${socket.id}`)
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

    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }

    socket.emit('response', response);
    console.log(`[helper.js]event 이벤트 발생 id:${socket.id} eventID:${data.handlerId}`)
};

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`[helper.js]User disconnected: ${socket.id}`);
    console.log(`[helper.js]Current users: `, getUser());
};