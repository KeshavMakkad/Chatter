import "./header.css";

interface HomeHeaderProps {
    onStartChat: () => void;
}

export default function HomeHeader({ onStartChat }: HomeHeaderProps) {
    return (
        <div className="home-header-parent">
            <img
                className="header-logo"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s"
                alt="Logo"
            />
            <div className="header-options">
                <button className="start-chat" onClick={onStartChat}>
                    Start Chat
                </button>
            </div>
        </div>
    );
}
