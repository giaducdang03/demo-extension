import React, { useState, useEffect } from 'react';
import Login from './Login';
import Chat from './Chat';
import './App.css';

// Declare the VS Code API type
declare global {
    interface Window {
        acquireVsCodeApi(): {
            postMessage(message: any): void;
            getState(): any;
            setState(state: any): void;
        };
    }
}

// Initialize VS Code API
const vscode = (function() {
    try {
        return window.acquireVsCodeApi();
    } catch (error) {
        // Return mock for development environment
        return {
            postMessage: (message: any) => console.log('postMessage:', message),
            getState: () => ({}),
            setState: (state: any) => console.log('setState:', state)
        };
    }
})();

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const currentState = vscode.getState() || {};
        if (currentState.token) {
            setIsLoggedIn(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (username: string, password: string) => {
        vscode.postMessage({
            type: 'login',
            username,
            password
        });
    };

    const handleLoginSuccess = (token: string) => {
        vscode.setState({ token });
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        vscode.setState({ token: null });
        setIsLoggedIn(false);
    };

    // Listen for messages from extension
    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'loginSuccess':
                    handleLoginSuccess(message.token);
                    break;
                case 'loginError':
                    // Handle login error
                    break;
                case 'restoreState':
                    if (message.state.token) {
                        setIsLoggedIn(true);
                    }
                    break;
            }
        };

        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, []);

    // Sync state changes
    useEffect(() => {
        const state = vscode.getState() || {};
        vscode.postMessage({
            type: 'stateUpdate',
            state
        });
    }, [isLoggedIn]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {!isLoggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Chat 
                    onSendMessage={(msg) => {
                        const state = vscode.getState() || {};
                        vscode.postMessage({
                            type: 'sendMessage',
                            message: msg,
                            token: state.token
                        });
                    }}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default App;