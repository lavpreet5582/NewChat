import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// import socketIOClient from 'socket.io-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/auth/Login/LoginPage';
import MessageList from './components/chat/MessageList';
import MessageInput from './components/chat/MessageInput';
import ChannelSwitcher from './components/chat/ChannelSwitcher';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [channel, setChannel] = useState('general');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const newSocket = connectSocket(channel, token);
    setSocket(newSocket);

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
    }

    return () => {
      newSocket.close();
    };
  };

  const connectSocket = (channelName, token) => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${channelName}/?token=${token}`);

    socket.onopen = () => {
      console.log(`Connected to channel ${channelName}`);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      // Handle the message
    };

    socket.onclose = (event) => {
      console.log(`Connection closed: ${event.reason}`);
    };

    return socket;
  };

  useEffect(() => {
    if (isLoggedIn) {
      login();
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isLoggedIn, channel]);

  const sendMessage = () => {
    if (socket && message) {
      socket.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  const changeChannel = (newChannel) => {
    setChannel(newChannel);
    if (socket) {
      socket.close();
    }
  };

  return (
    <div>
      {/* <h1>Chat App</h1> */}
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
