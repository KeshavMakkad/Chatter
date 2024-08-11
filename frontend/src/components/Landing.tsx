import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import HomeHeader from "./HomeHeader.tsx";
import "./Home.css";
import "./HomeLogin.css";
import "./WelcomeText.css";
import { Room } from "./Room";
import Typing from "./Typing.tsx";

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

            console.log("Emitting join-lobby with name:", name);
            socket.emit("join-lobby", { name });

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

    const handleJoin = () => {
        if (name.trim() !== "") {
            setJoined(true);
        }
    };

    if (!joined) {
        return (
            <div>
                <HomeHeader />
                <div className="home-body">
                    <div className="welcome-text">
                        <h1 className="hey-text">Hey</h1>
                        <Typing
                            className="typing-text"
                            text={[
                                "How are you?",
                                "Let's talk",
                                "Need a friend?",
                            ]}
                        />
                    </div>
                    <div className="vl"></div>
                    <div className="home-login">
                        <textarea
                            name="DisplayName"
                            className="display-name"
                            placeholder="Enter your display name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></textarea>
                        <button onClick={handleJoin}>
                            Chat as {name || "Guest"}
                        </button>
                    </div>
                </div>
            </div>
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
