import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import Footer from './Footer';

const ChatPage = ({ username, isLoggedIn, setIsLoggedIn }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [channel, setChannel] = useState('General');
    const [isSocketOpen, setIsSocketOpen] = useState(false);  // Track if the socket is open

    // Function to establish the socket connection
    const connectSocket = (channel) => {
        const token = localStorage.getItem('access');
        if (!token) return;
        // Create a new WebSocket connection
        const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${channel}/?token=${token}`);

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
            }
            setChannel(newChannel);
        }
    };

    // Establish the socket connection when the component mounts or the channel changes
    useEffect(() => {
        // If the socket is not open, create a new socket
        if (!isSocketOpen) {
            connectSocket(channel);
        }

        // Cleanup the socket connection when the component unmounts or when the channel changes
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [channel]); // Dependency only on channel change

    return (
        <div className="app-container">
            <Header isLoggedIn={isLoggedIn} username={username} setIsLoggedIn={setIsLoggedIn} />
            <Container fluid className="main-container">
                <Sidebar changeChannel={changeChannel} currentChannel={channel} />
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
