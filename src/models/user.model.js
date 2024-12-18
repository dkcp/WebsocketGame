const users = [];

// #4 resister.handler.js에서 호출, 인자 : user { uuid, socketId }
export const addUser = (user) => {
    users.push(user);
};

// #disconnect 이벤트 발생 -> handleDisconnect(socket, userUUID)에서 호출 [register.handler.js 참고]
export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

export const getUser = () => {
    return users;
};
