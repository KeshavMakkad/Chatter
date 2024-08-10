import { Socket } from "socket.io/dist/socket";
import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1;

interface Room {
    user1: User;
    user2: User;
}

export class RoomManager {
    private rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map<string, Room>();
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId, { user1, user2 });

        user1.socket.emit("join-room", {
            roomId,
            connectedUserName: user2.name, // Send the actual name of user2 to user1
        });
        user2.socket.emit("join-room", {
            roomId,
            connectedUserName: user1.name, // Send the actual name of user1 to user2
        });
    }

    sendMessage(roomId: string, message: string, senderSocketId: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const sender =
            room.user1.socket.id === senderSocketId ? room.user1 : room.user2;
        const receiver =
            room.user1.socket.id === senderSocketId ? room.user2 : room.user1;

        console.log(
            `Sending message: "${message}" from ${sender.name} to both users`
        );

        // Send the message to both users with sender's name
        // sender.socket.emit("receive-message", {
        //     message,
        //     senderName: sender.name,
        // });
        receiver.socket.emit("receive-message", {
            message,
            senderName: sender.name,
        });
    }

    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
