import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ChatPage from './components/chat/ChatPage'; // Move all chat logic to this component
import ProtectedRoute from './components/auth/ProtectedRoute'; // Optional, explained below

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    const token = localStorage.getItem('access');
    const user = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <ChatPage username={username} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
