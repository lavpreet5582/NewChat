// components/MessageInput.js
import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Send:', message);
    setMessage('');
  };

  return (
    <InputGroup className="m-2">
      <Form.Control
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <Button onClick={handleSend}>Send</Button>
    </InputGroup>
  );
};

export default MessageInput;
