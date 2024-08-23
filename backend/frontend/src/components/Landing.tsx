import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import HomeHeader from "./UI/HomeHeader.tsx";
import "./UI/Home.css";
import "./UI/HomeLogin.css";
import "./UI/WelcomeText.css";
import { Room } from "./Room";
import Typing from "./UI/Typing.tsx";

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

    const handleStartChat = () => {
        if (name.trim() === "") {
            setName("Guest");
        }

        if (name.trim() !== "") {
            setWaiting(true);
            const socket = io(URL);
            setSocket(socket);

            console.log("Emitting join-lobby with name:", name);
            socket.emit("join-lobby", { name });

            socket.on(
                "join-room",
                ({
                    roomId,
                    connectedUserName,
                }: {
                    roomId: string;
                    connectedUserName: string;
                }) => {
                    setRoomId(roomId);
                    setConnectedUserName(connectedUserName);
                    setWaiting(false);
                }
            );

            socket.on("disconnect", () => {
                setWaiting(false);
            });

            // Clean up function
            return () => {
                socket.disconnect();
            };
        }
    };

    useEffect(() => {
        if (joined) {
            handleStartChat();
        }
        return () => {
            socket?.disconnect();
        };
    }, [joined]);

    const handleJoin = () => {
        if (name.trim() === "") {
            setName("Guest");
        }
        setJoined(true);
    };

    const handleHeaderStartChat = () => {
        handleStartChat();
        setJoined(true); // Ensure chat starts if triggered from the header
    };

    if (!joined) {
        return (
            <div>
                <HomeHeader onStartChat={handleHeaderStartChat} />
                <div className="home-body">
                    <div className="welcome-text">
                        <h1 className="hey-text">Hey</h1>
                        <Typing
                            className="typing-text"
                            text={[
                                "Still Single?",
                                "Let's Chat...",
                                "Make Friends :)",
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

    return null;
};
