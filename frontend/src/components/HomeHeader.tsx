import "./header.css";

export default function HomeHeader() {
    return (
        <div className="home-header-parent">
            <img
                className="header-logo"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s"
            />
            <div className="header-options">
                <button className="start-chat">Start Chat</button>
            </div>
        </div>
    );
}
