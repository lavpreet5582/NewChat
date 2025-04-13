import { useState, useEffect } from "react";

const ChannelSwitcher = ({ changeChannel }) => {
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState("");

    // Fetch the list of channels when the component mounts
    useEffect(() => {
        getChannelsList();
    }, []);

    const getChannelsList = async () => {
        try {
            const token = localStorage.getItem("token");  // Assuming you're storing the token in localStorage

            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await fetch("http://localhost:8000/chat/api/channels/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,  // Include the token in the Authorization header
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch channels.");
            }

            const data = await response.json();
            setChannels(data);
        } catch (error) {
            setError("Error fetching channels: " + error.message);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
                {channels.length > 0 ? (
                    channels.map((channel) => (
                        <button key={channel.id} onClick={() => changeChannel(channel.name)}>
                            {channel.name}
                        </button>
                    ))
                ) : (
                    <p>No channels available</p>
                )}
            </div>
        </div>
    );
};

export default ChannelSwitcher;
