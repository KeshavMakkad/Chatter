import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface RoomProps {
    name: string;
    socket: Socket | null;
    roomId: string;
    connectedUserName: string;
}

export const Room = ({
    name,
    socket,
    roomId,
    connectedUserName,
}: RoomProps) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (socket) {
            socket.on("receive-message", ({ message }) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off("receive-message"); // Clean up the event listener
            };
        }
    }, [socket]);

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
            <div>You are connected with {connectedUserName}</div>
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
