import React, { useState } from 'react';

interface ChatProps {
    onSendMessage: (message: string) => void;
    onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ onSendMessage, onLogout }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat</h2>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
            <div className="messages" id="messages">
                {/* Messages will be added here */}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
