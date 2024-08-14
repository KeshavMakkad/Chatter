import React from "react";
import "./MessageList.css";

interface Message {
    message: string;
    senderName: string;
}

interface MessageListProps {
    messages: Message[];
    currentUser: string;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUser,
}) => {
    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message-container ${
                        msg.senderName === currentUser ? "sent" : "received"
                    }`}
                >
                    <div className="message-bubble">
                        <p className="sender-name">{msg.senderName}</p>
                        <p className="message-text">{msg.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
