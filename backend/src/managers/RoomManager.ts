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
        this.rooms.set(roomId.toString(), { user1, user2 });

        user1.socket.emit("join-room", {
            roomId,
            connectedUserName: user2.name,
        });
        user2.socket.emit("join-room", {
            roomId,
            connectedUserName: user1.name,
        });
    }

    sendMessage(roomId: string, message: string, senderSocketId: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser =
            room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
        receivingUser.socket.emit("receive-message", { message, roomId });
    }

    generate() {
        return GLOBAL_ROOM_ID++;
    }
}
