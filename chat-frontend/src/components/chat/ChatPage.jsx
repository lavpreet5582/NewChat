import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import Footer from './Footer';
import { fetchWithAuth } from '../../services/auth'

const ChatPage = ({ isLoggedIn, setIsLoggedIn }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [channels, setChannels] = useState([]);
    const [channel, setChannel] = useState(null);
    const [isSocketOpen, setIsSocketOpen] = useState(false);  // Track if the socket is open
    const [error, setError] = useState('');
    const token = localStorage.getItem('access');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/chat/"; // WebSocket URL
    // Function to establish the socket connection

    const fetchMessages = async () => {
        try {
            
            const response = await fetchWithAuth(`${backendUrl}/chat/api/messages/${channel}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch channels.");
            }

            const data = await response.json();
            setMessages(data);
        } catch (error) {
            setError("Error fetching channels: " + error.message);
        }
    };

    const connectSocket = (channel) => {
        if (!token) return;
        // Create a new WebSocket connection
        const newSocket = new WebSocket(`${wsUrl}/chat/${channel}/?token=${token}`);

        newSocket.onopen = () => {
            console.log(`Connected to channel ${channel}`);
            setIsSocketOpen(true);  // Set the socket as open
        };
        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
        newSocket.onclose = (event) => {
            console.log(`Connection closed: ${event.reason}`);
            setIsSocketOpen(false);  // Set the socket as closed when disconnected
        };

        setSocket(newSocket);  // Store the WebSocket object
    };

    // Send message to the server
    const sendMessage = () => {
        if (socket && message) {
            socket.send(JSON.stringify({ message }));
            setMessage('');
        }
    };

    // Change the active channel and close the previous socket
    const changeChannel = (newChannel) => {
        if (newChannel !== channel) {
            // Close the previous socket before changing the channel
            if (socket) {
                socket.close();
                setIsSocketOpen(false)
            }

            localStorage.setItem("channel", newChannel)
            setChannel(newChannel);
        }
    };

    // Fetch the list of channels when the component mounts

    useEffect(() => {
        const getChannelsList = async () => {
            try {
                const response = await fetchWithAuth(`${backendUrl}/chat/api/channels/`, {
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

                // Check if a channel is already stored
                const savedChannel = localStorage.getItem('channel');

                if (savedChannel) {
                    setChannel(savedChannel);
                } else if (data.length > 0) {
                    setChannel(data[0].name);
                    localStorage.setItem('channel', data[0].name);
                }

            } catch (error) {
                setError("Error fetching channels: " + error.message);
            }
        };

        getChannelsList();
    }, []);

    useEffect(() => {
        if (!channel) return;

        if (!isSocketOpen) {
            connectSocket(channel);
        }

        const fetchMsg = async () => {
            await fetchMessages();
        };
        fetchMsg();

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [channel]);



    return (
        <div className="app-container">
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Container fluid className="main-container">
                <Sidebar changeChannel={changeChannel} currentChannel={channel} channels={channels} />
                <ChatWindow
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </Container>
            <Footer />
        </div>
    );
};

export default ChatPage;
