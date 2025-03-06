import React, { useState, useCallback } from 'react';
import { vscode } from '../utils/vscodeApi';

interface ChatProps {
    onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({ onLogout }) => {
    const [message, setMessage] = useState('');

    const handleLogout = useCallback(() => {
        vscode.setState({ token: null });
        onLogout();
    }, [onLogout]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            const state = vscode.getState();
            vscode.postMessage({
                type: 'sendMessage',
                message,
                token: state.token
            });
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
