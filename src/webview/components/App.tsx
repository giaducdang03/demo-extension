import React, { useState, useEffect } from 'react';
import { vscode } from '../utils/vscodeApi';
import Login from './Login';
import Chat from './Chat';
import './App.css';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentState = vscode.getState();
        if (currentState?.token) {
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {!isLoggedIn ? (
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            ) : (
                <Chat onLogout={() => setIsLoggedIn(false)} />
            )}
        </div>
    );
};

export default App;