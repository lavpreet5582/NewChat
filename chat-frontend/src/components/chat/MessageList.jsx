import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div>
      {/* Check if messages are available */}
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className="message-item">
            <p>
              <strong>{msg.user.username}</strong>: {msg.content}{" "}
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p>No messages available</p>
      )}
    </div>
  );
};

export default MessageList;
