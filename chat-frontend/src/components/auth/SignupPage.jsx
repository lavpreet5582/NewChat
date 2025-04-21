import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './SignupPage.css';  // Import the CSS file for custom styling
import { useNavigate } from 'react-router-dom';

const SignupPage = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch("http://localhost:8000/accounts/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email, password2 }),
        });

        if (!response.ok) {
            setError("Failed to create an account or some error occurred.");
            return;
        }

        const data = await response.json();
        console.log("User created:", data);
        alert("Account Created Successfully. Please Login...")
        navigate('/')
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Signup</h2>
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
                    <Form.Group controlId="formEmail" className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <Form.Group controlId="formPassword2" className="mt-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mt-4">
                        Signup
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    <span>Already have an account? </span>
                    <a href="/login">Login</a>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
