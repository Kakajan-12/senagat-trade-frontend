export interface ChatMessage {
    sender: "user" | "admin";
    text: string;
    time: number;
}

export interface WSIncomingMessage {
    type: "admin_message" | "user_message_sent" | "offline_message_sent" | "connect";
    message?: string;
    user_id?: number;
}

export interface WSOutgoingMessage {
    type: "user_message" | "connect" | "offline_message";
    session_id: string | null;
    message?: string;
    email?: string;
    timestamp?: string;
}