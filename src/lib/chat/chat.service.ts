import { wsSend } from "@/lib/chat/ws";
import chatStore from "./chat.store";

export interface ChatMessage {
    sender: "user" | "admin";
    text: string;
    time: number;
}

export async function loadMessageHistory(): Promise<void> {
    const session = window.sessionStorage.getItem("session");

    if (!session) {
        return;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${session}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const messages = await response.json();

        const formattedMessages: ChatMessage[] = messages.map((msg: any) => ({
            sender: msg.sender,
            text: msg.message,
            time: new Date(msg.created_at).getTime()
        }));


        formattedMessages.forEach(msg => {
            chatStore.getState().addMessage(msg);
        });


    } catch (error) {
    }
}

export function sendMessage(text: string) {
    const session = window.sessionStorage.getItem("session");

    wsSend({
        type: "user_message",
        session_id: session,
        message: text,
    });
}

export function initChat() {
    loadMessageHistory();
}