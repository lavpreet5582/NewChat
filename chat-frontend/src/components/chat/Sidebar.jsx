// Sidebar.js
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { fetchWithAuth } from '../../services/auth';
import './Sidebar.css'

const Sidebar = ({ changeChannel, currentChannel }) => {

    const [channels, setChannels] = useState([]);
    const [error, setError] = useState("");

    // Fetch the list of channels when the component mounts
    useEffect(() => {
        getChannelsList();
    }, []);

    const getChannelsList = async () => {
        try {
            const response = await fetchWithAuth("http://localhost:8000/chat/api/channels/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
        <div className='sidebar'>

            {/* <ListGroup variant="flush">
                {channels.map((ch) => (
                    <ListGroup.Item
                        key={ch?.id}
                        action
                        active={ch.name === currentChannel}
                        onClick={() => changeChannel(ch.name)}
                    >
                        {ch.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>*/}
            <div className="p-3">
                <h5 className="mb-3">Channels</h5>
                <ListGroup>
                    {channels.map((channel) => (
                        <ListGroup.Item
                            key={channel.id}
                            action
                            active={channel.name === currentChannel}
                            onClick={() => changeChannel(channel.name)}
                        >
                            {channel.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
};

export default Sidebar;
