import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
    socket: Socket;
    name: string;
}

export class UserManager {
    getUsers(): any {
        throw new Error("Method not implemented.");
    }
    private users: User[];
    private queue: string[];
    private roomManager: RoomManager;

    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: string, socket: Socket) {
        console.log("User added", name);
        this.users.push({ name, socket });
        this.queue.push(socket.id);
        socket.emit("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }

    removeUser(socketId: string) {
        this.users = this.users.filter((x) => x.socket.id !== socketId);
        this.queue = this.queue.filter((x) => x !== socketId);
    }

    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }

        const id1 = this.queue.shift();
        const id2 = this.queue.shift();

        const user1 = this.users.find((x) => {
            // console.log(x.name, id1);
            return x.socket.id === id1;
        });
        const user2 = this.users.find((x) => {
            // console.log(x.name, id2);
            return x.socket.id === id2;
        });

        if (user1 && user2) {
            this.roomManager.createRoom(user1, user2);
        }

        this.clearQueue();
    }

    initHandlers(socket: Socket) {
        socket.on("send-message", ({ message, roomId }) => {
            this.roomManager.sendMessage(roomId, message, socket.id);
        });
    }
}
