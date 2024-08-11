import "./HomeLogin.css";

export default function HomeLogin({ name, setName, handleJoin }: any) {
    return (
        <div className="home-login">
            <textarea
                name="DisplayName"
                className="display-name"
                placeholder="Enter your display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            ></textarea>
            <button onClick={handleJoin}>Chat as {name || "Guest"}</button>
        </div>
    );
}
