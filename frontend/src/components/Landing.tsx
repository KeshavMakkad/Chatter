import { useState, useEffect } from "react";
import { Room } from "./Room";

export const Landing = () => {
    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        if (joined) {
            setWaiting(true);
            // Simulate waiting for a room
            setTimeout(() => {
                setWaiting(false);
            }, 2000); // Simulating a 3-second wait before being connected
        }
    }, [joined]);

    if (!joined) {
        return (
            <div>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
                <button onClick={() => setJoined(true)}>Join</button>
            </div>
        );
    }

    if (waiting) {
        return (
            <div>Please wait while we are searching a chatter for you...</div>
        );
    }

    return <Room name={name} />;
};
