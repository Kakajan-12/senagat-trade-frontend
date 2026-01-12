import { create } from "zustand";
import { ChatMessage } from "./types";

interface ChatState {
    messages: ChatMessage[];
    addMessage: (msg: ChatMessage) => void;
    clear: () => void;
}

const chatStore = create<ChatState>((set) => ({
    messages: [],

    addMessage: (msg) =>
        set((state) => ({
            messages: [...state.messages, msg],
        })),

    clear: () => set({ messages: [] }),
}));

export default chatStore;
