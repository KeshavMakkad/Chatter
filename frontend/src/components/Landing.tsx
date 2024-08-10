import { useState, useEffect } from "react";
import { Room } from "./Room";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const Landing = () => {
    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [connectedUserName, setConnectedUserName] = useState<string | null>(
        null
    );

    useEffect(() => {
        if (joined) {
            setWaiting(true);
            const socket = io(URL);
            setSocket(socket);

            socket.emit("join-lobby", { name }); // Send the user's actual name

            socket.on("join-room", ({ roomId, connectedUserName }) => {
                setRoomId(roomId);
                setConnectedUserName(connectedUserName);
                setWaiting(false);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [joined]);

    if (!joined) {
        return (
            <>
                <div>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <button onClick={() => setJoined(true)}>Join</button>
                </div>
            </>
        );
    }

    if (waiting) {
        return (
            <div>Please wait while we are searching a chatter for you...</div>
        );
    }

    if (roomId && connectedUserName) {
        return (
            <Room
                name={name}
                socket={socket}
                roomId={roomId}
                connectedUserName={connectedUserName}
            />
        );
    }

    return null; // Optionally handle any other cases, such as an error.
};
