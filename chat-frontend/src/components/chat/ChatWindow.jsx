import React, { useEffect, useRef } from 'react';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';
import './ChatWindow.css'

const ChatWindow = ({ messages, message, setMessage, sendMessage }) => {
    // const handleSend = () => {
    //     sendMessage(message);
    //     setMessage('');
    // };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const username = localStorage.getItem('username')

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Card className="chat-window-container">
            <Card.Body className="messages-area">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <li key={index} className={`message-item ${msg.user.username === username ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                                <div className="message-info">
                                    <strong>{msg.user.username}</strong>
                                </div>
                                <div className="message-text">
                                    {msg.content}
                                </div>
                                <div className='timestamp-container'>
                                    <small className="px-2 text-muted timestamp">
                                        {formatTimestamp(msg.timestamp)}
                                    </small>
                                </div>
                            </div>
                        </li>
                    ))}
                    <div ref={messagesEndRef} />
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
