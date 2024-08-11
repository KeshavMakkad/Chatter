import React from "react";
import "./MessageInput.css";

interface MessageInputProps {
    currentMessage: string;
    setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    currentMessage,
    setCurrentMessage,
    sendMessage,
}) => {
    return (
        <div className="message-input">
            <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};
