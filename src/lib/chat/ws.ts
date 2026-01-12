let ws: WebSocket | null = null;

type WSCallback = (data: any) => void;
let messageCallback: WSCallback | null = null;

function generateSessionId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getOrCreateSession(): string {
    let session = window.sessionStorage.getItem("session");
    if (!session) {
        session = generateSessionId();
        window.sessionStorage.setItem("session", session);
    }
    return session;
}

export function initWS() {
    if (ws && ws.readyState === WebSocket.OPEN) return;

    ws = new WebSocket(`${process.env.NEXT_PUBLIC_WSS}`);

    ws.onopen = () => {

        const session = getOrCreateSession();

        wsSend({
            type: "connect",
            session_id: session,
        });
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (messageCallback) {
            messageCallback(data);
        }
    };

    ws.onclose = () => {
        setTimeout(initWS, 2000);
    };

    ws.onerror = (err) => {
        ws?.close();
    };
}

export function onWSMessage(callback: WSCallback) {
    messageCallback = callback;
}

export function wsSend(payload: any) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(payload));
}