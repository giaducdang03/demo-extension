declare global {
    interface Window {
        acquireVsCodeApi(): {
            postMessage(message: any): void;
            getState(): any;
            setState(state: any): void;
        };
    }
}

class VSCodeAPIWrapper {
    private readonly vscodeApi;

    constructor() {
        if (typeof window.acquireVsCodeApi === 'function') {
            this.vscodeApi = window.acquireVsCodeApi();
        } else {
            this.vscodeApi = {
                postMessage: (msg: any) => console.log('postMessage:', msg),
                getState: () => ({}),
                setState: (state: any) => console.log('setState:', state)
            };
        }
    }

    public getState() {
        return this.vscodeApi.getState() || {};
    }

    public setState(newState: any) {
        this.vscodeApi.setState(newState);
    }

    public postMessage(message: any) {
        this.vscodeApi.postMessage(message);
    }
}

export const vscode = new VSCodeAPIWrapper();
