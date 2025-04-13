import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/auth/LoginPage';
import MessageList from './components/chat/MessageList';
import MessageInput from './components/chat/MessageInput';
import ChannelSwitcher from './components/chat/ChannelSwitcher';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [channel, setChannel] = useState('General');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to login and connect the socket
  const login = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }
    
    const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${channel}/?token=${token}`);

    newSocket.onopen = () => {
      console.log(`Connected to channel ${channel}`);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    newSocket.onclose = (event) => {
      console.log(`Connection closed: ${event.reason}`);
    };

    setSocket(newSocket);
  };

  // Function to send a message via the socket
  const sendMessage = () => {
    if (socket && message) {
      console.log("sending message to user ");
      
      socket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  // Change the active channel and reset socket connection
  const changeChannel = (newChannel) => {
    setChannel(newChannel);
    if (socket) {
      socket.close();
    }
  };

  // Manage socket and login logic using useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      login();
      // fetchMessages(channel); // Fetch messages when login or channel changes
    }
    // Cleanup socket connection on component unmount or when channel changes
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isLoggedIn, channel]); // Dependencies: login status and channel change

  const fetchMessages = async (channel) => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/chat/api/messages/${channel}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json(); // Parse the response JSON
      setMessages(data); // Set the fetched messages into state
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className={!isLoggedIn ? "login-page" : ""}>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <h2>Active Channel: {channel}</h2>
          <ChannelSwitcher changeChannel={changeChannel} />
          <MessageList messages={messages} />
          <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </>
      )}
    </div>
  );
}

export default App;
