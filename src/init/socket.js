import { Server as SocketID } from 'socket.io'
import registerHandler from '../handlers/register.handler.js';

// #2  서버 최초 생성 및 초기화.
const initSocket = (server) => {
    const io = new SocketID();
    io.attach(server);

    registerHandler(io);

    console.log(`[socket.js] initSocket success`)
}

export default initSocket;