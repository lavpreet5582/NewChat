import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';  // Assuming you're using react-bootstrap
import './LoginPage.css';  // Import the CSS file for custom styling

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if username and password are provided
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/accounts/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response is successful
      if (!response.ok) {
        setError("Invalid credentials or error during login.");
        return;
      }

      const data = await response.json();

      // Store tokens securely (consider storing refresh token too)
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh); // Optionally store the refresh token as well.

      // Optionally handle token expiration or refresh mechanism
      // You can also set a timer to refresh token before expiration

      // Trigger successful login
      onLogin();
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred while logging in. Please try again later.");
    }
  };


  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mt-4">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
