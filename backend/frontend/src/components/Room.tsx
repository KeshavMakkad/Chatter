import React from "react";
import { Socket } from "socket.io-client";
import { MessageList } from "./UI/MessageList";
import { MessageInput } from "./UI/MessageInput";
import "./Room.css";

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

export const Room: React.FC<RoomProps> = ({
    name,
    socket,
    roomId,
    connectedUserName,
}) => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = React.useState("");

    React.useEffect(() => {
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
        if (currentMessage.trim() === "") {
            // Prevent sending if the message is empty or just whitespace
            return;
        }
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
        <div className="room">
            <header className="room-header">
                <h1>Welcome, {name}</h1>
                <div>You are connected with {connectedUserName}</div>
            </header>
            <MessageList messages={messages} currentUser={name} />
            <MessageInput
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                sendMessage={sendMessage}
            />
        </div>
    );
};
