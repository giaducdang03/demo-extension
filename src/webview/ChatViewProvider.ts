import * as vscode from 'vscode';
import { getWebviewContent } from './webview-ui';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    private _views = new Map<string, vscode.WebviewView>();
    private _state: any = {};

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._views.set(webviewView.viewType, webviewView);

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = getWebviewContent(webviewView.webview, this._extensionUri);
        
        // Restore state if exists
        if (Object.keys(this._state).length > 0) {
            webviewView.webview.postMessage({ 
                type: 'restoreState', 
                state: this._state 
            });
        }

        webviewView.webview.onDidReceiveMessage(async data => {
            // Store state for view synchronization
            if (data.type === 'stateUpdate') {
                this._state = data.state;
                this.syncState();
                return;
            }

            switch (data.type) {
                case 'login':
                    try {
                        // Implement your login logic here
                        const token = await this.performLogin(data.username, data.password);
                        webviewView.webview.postMessage({ 
                            type: 'loginSuccess', 
                            token 
                        });
                    } catch (error: any) {
                        webviewView.webview.postMessage({ 
                            type: 'loginError', 
                            error: error.message 
                        });
                    }
                    break;

                case 'sendMessage':
                    // Verify token before processing message
                    if (!this.verifyToken(data.token)) {
                        webviewView.webview.postMessage({ 
                            type: 'error', 
                            message: 'Authentication required' 
                        });
                        return;
                    }
                    // Handle chat message
                    break;
            }
        });
    }

    private syncState() {
        // Sync state across all views
        for (const view of this._views.values()) {
            view.webview.postMessage({ 
                type: 'restoreState', 
                state: this._state 
            });
        }
    }

    private async performLogin(username: string, password: string): Promise<string> {
        // Implement your authentication logic here
        // This is a mock implementation
        return new Promise((resolve, reject) => {
            if (username && password) {
                // Generate a mock token
                const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
                resolve(token);
            } else {
                reject(new Error('Invalid credentials'));
            }
        });
    }

    private verifyToken(token: string): boolean {
        // Implement your token verification logic here
        return !!token;
    }
}
