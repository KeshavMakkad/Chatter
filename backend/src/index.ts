import { Socket } from "socket.io";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    socket.on("join-lobby", ({ name }) => {
        console.log("Received join-lobby with name:", name);
        userManager.addUser(name, socket);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        userManager.removeUser(socket.id);
    });

    return true;
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
