import * as vscode from 'vscode';
import { ChatViewProvider } from './webview/ChatViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const chatViewProvider = new ChatViewProvider(context.extensionUri);
    
    // Register providers for both views
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('chatView', chatViewProvider),
        vscode.window.registerWebviewViewProvider('chatSecondary', chatViewProvider)
    );

    let isInSecondary = context.globalState.get('isInSecondary', false);

    const toggleView = async () => {
        try {
            if (!isInSecondary) {
                // Show auxiliary bar first
                await vscode.commands.executeCommand('workbench.action.toggleAuxiliaryBar');
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Focus the view in auxiliary bar
                const view = await vscode.commands.executeCommand('workbench.view.extension.chat-secondary-view.focus');
                if (!view) {
                    // If direct focus fails, try showing the container
                    await vscode.commands.executeCommand('workbench.view.extension.chat-secondary-view');
                }
            } else {
                // Hide auxiliary bar
                await vscode.commands.executeCommand('workbench.action.closeAuxiliaryBar');
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Show primary sidebar view
                await vscode.commands.executeCommand('workbench.view.extension.chat-sidebar-view.focus');
            }
            
            isInSecondary = !isInSecondary;
            await context.globalState.update('isInSecondary', isInSecondary);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to toggle view: ${error}`);
            console.error('Error toggling view:', error);
        }
    };

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('demo-extension.openChat', () => {
            const command = isInSecondary 
                ? 'workbench.view.extension.chat-secondary-view.focus'
                : 'workbench.view.extension.chat-sidebar-view.focus';
            vscode.commands.executeCommand(command);
        }),

        vscode.commands.registerCommand('demo-extension.moveToSecondary', toggleView)
    );

    // Initialize correct view on startup
    if (isInSecondary) {
        vscode.commands.executeCommand('workbench.action.toggleAuxiliaryBar');
    }
}

export function deactivate() {}
