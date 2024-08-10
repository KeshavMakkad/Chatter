import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

interface RoomProps {
    name: string;
    socket: Socket | null;
    roomId: string;
    connectedUserName: string;
}

interface Message {
    message: string;
    senderName: string;
}

export const Room = ({
    name,
    socket,
    roomId,
    connectedUserName,
}: RoomProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (socket) {
            socket.on(
                "receive-message",
                ({
                    message,
                    senderName,
                }: {
                    message: string;
                    senderName: string;
                }) => {
                    console.log(
                        `Received message: "${message}" from ${senderName}`
                    );
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { message, senderName },
                    ]);
                }
            );

            return () => {
                socket.off("receive-message");
            };
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket && roomId) {
            socket.emit("send-message", { message: currentMessage, roomId });
            setMessages((prevMessages) => [
                ...prevMessages,
                { message: currentMessage, senderName: name },
            ]);
            setCurrentMessage("");
        }
    };

    return (
        <div>
            <h1>Welcome, {name}</h1>
            <div>You are connected with {connectedUserName}</div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.senderName}:</strong> {msg.message}
                    </p>
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
