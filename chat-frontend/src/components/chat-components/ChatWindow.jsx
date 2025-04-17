import React from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import './ChatWindow.css'

const ChatWindow = ({ messages, message, setMessage, sendMessage }) => {
    const handleSend = () => {
        sendMessage(message);
        setMessage('');
    };

    return (
        <Card className="chat-window-container">
            <Card.Body className="messages-area">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <li key={index} className="message-item">
                            <strong>{msg.sender || "User"}:</strong> {msg.message}
                        </li>
                    ))}
                </ul>
            </Card.Body>
            <Card.Footer className="input-area">
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                >
                    <Form.Group className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button type="submit" variant="primary" className="ms-2">
                            Send
                        </Button>
                    </Form.Group>
                </Form>
            </Card.Footer>
        </Card>
    );
};

export default ChatWindow;
