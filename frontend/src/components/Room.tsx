import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const Room = ({ name }: { name: string }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [roomId, setRoomId] = useState<string | null>(null);
    const [connectedUserName, setConnectedUserName] = useState<string | null>(
        null
    );

    useEffect(() => {
        const socket = io(URL);

        socket.on("join-room", ({ roomId, connectedUserName }) => {
            setRoomId(roomId);
            setConnectedUserName(connectedUserName);
        });

        socket.on("receive-message", ({ message }) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        setSocket(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (socket && roomId) {
            socket.emit("send-message", { message: currentMessage, roomId });
            setMessages((prevMessages) => [...prevMessages, currentMessage]);
            setCurrentMessage("");
        }
    };

    return (
        <div>
            <h1>Welcome, {name}</h1>
            {connectedUserName && (
                <div>You are connected with {connectedUserName}</div>
            )}
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};
