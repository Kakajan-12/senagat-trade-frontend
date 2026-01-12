'use client'

import { useState, useRef, useEffect } from "react";
import {useTranslations} from "next-intl";
import {FaArrowRight} from "react-icons/fa6";

interface MessageInputProps {
    onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const t = useTranslations("chat")

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [message]);

    const handleSubmit = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        onSend(trimmedMessage);
        setMessage("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t p-3 bg-white">
            <div className="flex items-end space-x-2">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('type-here')}
                    className="flex-1 border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
                    rows={1}
                    style={{ minHeight: "40px" }}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    className="footer-bg-color text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[40px]"
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
}