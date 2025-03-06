import React, { useState, useEffect } from 'react';
import { vscode } from '../utils/vscodeApi';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'loginSuccess':
                    vscode.setState({ token: message.token });
                    onLoginSuccess();
                    break;
                case 'loginError':
                    setError(message.error);
                    break;
            }
        };

        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, [onLoginSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        vscode.postMessage({
            type: 'login',
            username,
            password
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
