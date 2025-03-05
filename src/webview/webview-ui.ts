import * as vscode from 'vscode';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const webviewUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js'));

    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chat</title>
        </head>
        <body>
            <div id="root"></div>
            <script src="${webviewUri}"></script>
        </body>
    </html>`;
}
