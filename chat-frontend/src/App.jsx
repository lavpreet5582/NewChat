import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/auth/LoginPage';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/chat/Sidebar';
import ChatWindow from './components/chat/ChatWindow';
import Header from './components/chat/Header';
import Footer from './components/chat/Footer';

// import MessageList from './components/chat/MessageList';
// import MessageInput from './components/chat/MessageInput';
// import ChannelSwitcher from './components/chat/ChannelSwitcher';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [channel, setChannel] = useState('General');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to login and connect the socket
  const login = () => {
    const token = localStorage.getItem('access');
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
    const token = localStorage.getItem("access");
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      login();
    }
    // Cleanup socket connection on component unmount or when channel changes
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isLoggedIn, channel]); // Dependencies: login status and channel change


  return (
    <div className={!isLoggedIn ? "login-page" : ""}>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <div className='app-container'>
          <Header />
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
      )}
    </div>
  );
}

export default App;
