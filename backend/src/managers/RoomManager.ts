import { Socket } from "socket.io/dist/socket";
import { User } from "./UserManager";
import { Server } from "socket.io";

let GLOBAL_ROOM_ID = 1;

interface Room {
    user1: User;
    user2: User;
}

export class RoomManager {
    private rooms: Map<string, Room>;
    private io: Server;

    constructor(io: Server) {
        this.rooms = new Map<string, Room>();
        this.io = io;
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId, { user1, user2 });

        const socket1 = this.io.sockets.sockets.get(user1.socketId);
        const socket2 = this.io.sockets.sockets.get(user2.socketId);

        if (socket1 && socket2) {
            socket1.emit("join-room", {
                roomId,
                connectedUserName: user2.name,
            });
            socket2.emit("join-room", {
                roomId,
                connectedUserName: user1.name,
            });
        }
    }

    sendMessage(roomId: string, message: string, senderSocketId: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        const sender = room.user1.socketId === senderSocketId ? room.user1 : room.user2;
        const receiver = room.user1.socketId === senderSocketId ? room.user2 : room.user1;

        const senderSocket = this.io.sockets.sockets.get(sender.socketId);
        const receiverSocket = this.io.sockets.sockets.get(receiver.socketId);

        console.log(`Sending message: "${message}" from ${sender.name} to ${receiver.name}`);

        if (receiverSocket) {
            receiverSocket.emit("receive-message", {
                message,
                senderName: sender.name,
            });
        }
    }

    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
