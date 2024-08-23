import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";
import { UserModel } from "./UserModel";
import { Server } from "socket.io";

export interface User {
    socketId: string;
    name: string;
}

export class UserManager {
    private roomManager: RoomManager;

    constructor(io: Server) {
        this.roomManager = new RoomManager(io);
    }

    async addUser(name: string, socket: Socket) {
        console.log("User added", name);

        const newUser = new UserModel({
            user: {
                name,
                socketId: socket.id,
            },
        });

        await newUser.save();
        socket.emit("lobby");
        await this.clearQueue();
        this.initHandlers(socket);
    }

    async removeUser(socketId: string) {
        await UserModel.deleteOne({ "user.socketId": socketId });
    }

    async clearQueue() {
        const usersCount = await UserModel.countDocuments();
        if (usersCount < 2) return;

        const randomUsers = await UserModel.aggregate([
            { $sample: { size: 2 } },
        ]);

        if (randomUsers.length === 2) {
            const [user1, user2] = randomUsers;
            await this.roomManager.createRoom(user1.user, user2.user);

            await UserModel.deleteMany({
                _id: { $in: [user1._id, user2._id] },
            });
        }

        await this.clearQueue();
    }

    initHandlers(socket: Socket) {
        socket.on("send-message", async ({ message, roomId }) => {
            await this.roomManager.sendMessage(roomId, message, socket.id);
        });
    }
}
