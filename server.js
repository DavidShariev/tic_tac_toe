const { RoomService } = require('@mui/icons-material');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const db = {

}

const PORT = 3001;

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log("User disconnected: ", socket.id)
        Object.keys(db).forEach((roomId) => {
            if (db[roomId].sockets.indexOf(socket.id) >= 0) {
                const id = db[roomId].sockets.indexOf(socket.id)

                db[roomId].sockets.splice(id, 1);
                db[roomId].users.splice(id, 1);

                const users = db[roomId].users;
                socket.to(roomId).emit("ROOM:DISCONNECT",
                    { roomId, users, name: users[0] });
            }
        })
    })

    socket.on("ROOM:JOIN", ({ roomId, userName }) => {
        if (!db[roomId]) {
            socket.join(roomId)
            db[roomId] = {
                turn: 0,
                sockets: [socket.id],
                users: [userName],

            }
        } else if (db[roomId].users.length < 2) {
            socket.join(roomId)
            db[roomId].users[1] = userName;
            db[roomId].sockets[1] = socket.id;
        } else if (db[roomId].users.length >= 2) {
            socket.emit("ROOM:USER_LOGIN", {
                roomId: null,
                users: null,
                name: userName,
                "error": "В комнате уже идет игра."
            });
            return;
        }

        const users = db[roomId].users;
        socket.to(roomId).emit("ROOM:USER_LOGIN", { roomId, users, name: userName });
        socket.emit("ROOM:USER_LOGIN", { roomId, users, name: userName });
    })

    socket.on("ROOM:MOVE", ({ roomId, cellId, sym }) => {
        socket.to(roomId).emit("ROOM:MOVE", { cellId, sym });
    })

    socket.on("ROOM:RESTART", ({ roomId }) => {
        console.log("restarting", roomId)
        socket.to(roomId).emit("ROOM:RESTART", { roomId });
    })

    socket.on("ROOM:WIN", ({ roomId }) => {
        socket.to(roomId).emit("ROOM:ENEMY_WIN")
    })
});

server.listen(PORT, () => {
    console.log(`Server has been started at PORT: ${PORT}`);
});

