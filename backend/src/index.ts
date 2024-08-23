import { Socket } from "socket.io";
import http from "http";
import express from "express";
import path from "path";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManager";
import { startDB } from "./db";

const app = express();

app.use(express.static("./frontend/dist"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const userManager = new UserManager(io); // Pass io to UserManager

startDB();

io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    socket.on("join-lobby", ({ name }) => {
        console.log("Received join-lobby with name:", name);
        userManager.addUser(name, socket);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        userManager.removeUser(socket.id);
    });

    return true;
});

server.listen(3000, () => {
    console.log("Listening on *:3000");
});
