const MessageList = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <p key={index}><strong>{msg.message}</strong></p>
            ))}
        </div>
    )
}


export default MessageList;