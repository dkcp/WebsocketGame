import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';
import { createStage } from '../models/stage.model.js';

// #3 'connection' 이벤트 발생시 uuid를 생성하고 유저와 스테이지와 인게임 이벤트를 새롭게 등록하는 과정
const registerHandler = io => {
    io.on('connection', socket => {
        const userUUID = uuidv4();
        addUser({ uuid: userUUID, socketId: socket.id });
        createStage(userUUID);

        // 접속시 유저 정보 생성 이벤트 처리
        handleConnection(socket, userUUID);

        socket.on('event', data => handleEvent(io, socket, data));
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));

        console.log(`[register.handler.js] connection success`);
    });
};

export default registerHandler;
