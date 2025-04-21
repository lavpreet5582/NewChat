import React from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import './ChatWindow.css'

const ChatWindow = ({ messages, message, setMessage, sendMessage }) => {
    // const handleSend = () => {
    //     sendMessage(message);
    //     setMessage('');
    // };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return (
        <Card className="chat-window-container">
            <Card.Body className="messages-area">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <li key={index} className={`message-item ${msg.user === localStorage.getItem('username') ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                                <div className="message-info">
                                    <strong>{msg.user}</strong>
                                </div>
                                <div className="message-text">
                                    {msg.message}
                                    <small className="px-2 bg-light text-muted timestamp">
                                        {formatTimestamp(msg.timestamp)}
                                    </small>
                                </div>
                            </div>
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
