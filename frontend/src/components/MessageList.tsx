import React from "react";
import "./MessageList.css";

interface Message {
    message: string;
    senderName: string;
}

interface MessageListProps {
    messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <p key={index} className="message">
                    <strong>{msg.senderName}:</strong> {msg.message}
                </p>
            ))}
        </div>
    );
};
