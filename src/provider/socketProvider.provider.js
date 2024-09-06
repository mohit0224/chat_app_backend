const users = {};

const socketProvider = (io) => {
    io.on("connection", (socket) => {
        const { userId } = socket.handshake.auth;
        if (users !== undefined) {
            users[userId] = socket.id;
        }

        io.emit("whoIsOnline", Object.keys(users));

        socket.on("disconnect", () => {
            delete users[userId];
            io.emit("whoIsOnline", Object.keys(users));
        });
    });
};

export const checkUserIDInUsersAndReturnSocketId = (userID) => {
    if (!users[userID]) {
        console.log(`No user found with this userID: ${userID}`);
        return null;
    }

    return users[userID];
};

export default socketProvider;
