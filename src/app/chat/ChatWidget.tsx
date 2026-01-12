"use client";

import {useEffect, useRef, useState} from "react";
import chatStore from "@/lib/chat/chat.store";
import {initWS, onWSMessage, wsSend} from "@/lib/chat/ws";
import {initChat, sendMessage} from "@/lib/chat/chat.service";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import WorkingHours from "./WorkingHours";
import Modal from "./Modal";
import {MdClose, MdOutlineChatBubbleOutline} from "react-icons/md";
import {useTranslations} from "next-intl";

export default function ChatWidget() {
    const messages = chatStore((s) => s.messages);
    const addMessage = chatStore((s) => s.addMessage);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const [isMinimized, setIsMinimized] = useState(true);
    const [isWorkingHours, setIsWorkingHours] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({title: "", message: ""});

    const t = useTranslations("chat");
    const showModal = (title: string, message: string) => {
        setModalContent({title, message});
        setModalOpen(true);
    };

    useEffect(() => {
        const checkWorkingHours = () => {
            const now = new Date();
            const utc5Time = new Date(now.getTime() + (5 * 60 * 60 * 1000));
            const hour = utc5Time.getUTCHours();

            const isWorkTime = hour >= 10 && hour < 19;
            setIsWorkingHours(isWorkTime);
        };

        checkWorkingHours();
        const interval = setInterval(checkWorkingHours, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        initWS();
        initChat();

        onWSMessage((data) => {

            if (data.type === "admin_message") {
                addMessage({
                    sender: "admin",
                    text: data.message,
                    time: Date.now()
                });

                setIsMinimized(false);
            } else if (data.type === "user_message_sent") {
                addMessage({
                    sender: "user",
                    text: data.message,
                    time: Date.now()
                });
            } else if (data.type === "offline_message_sent") {
                showModal(
                    `${t('modal-title')}`,
                    `${t('modal-text')}`,
                );
            }
        });
    }, [addMessage]);

    useEffect(() => {
        if (!isMinimized && messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages, isMinimized]);

    const handleLeaveMessage = (email: string, messageText: string) => {
        const session = window.sessionStorage.getItem("session");

        wsSend({
            type: "offline_message",
            session_id: session,
            email: email,
            message: messageText,
            timestamp: new Date().toLocaleString('ru-RU', {timeZone: 'Asia/Tashkent'})
        });
    };

    if (isMinimized) {
        return (
            <>
                <div className="fixed bottom-10 right-4 z-50">
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="bg-[#002A5F] text-white text-xl rounded-full w-12 h-12 flex items-center justify-center shadow-lg relative border-white border-[1px]"
                    >
                        <MdOutlineChatBubbleOutline />

                        {!isWorkingHours && (
                            <span
                                className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-3 h-3 text-xs flex items-center justify-center">
                        </span>
                        )}

                        {isWorkingHours && messages.some(msg => msg.sender === 'admin') && (
                            <span
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {messages.filter(msg => msg.sender === 'admin').length}
                        </span>
                        )}
                    </button>
                </div>
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={modalContent.title}
                >
                    <p className="text-gray-700">{modalContent.message}</p>
                </Modal>
            </>
        );
    }

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border rounded-lg shadow-xl">
                <div className="bg-[#002A5F] text-white p-3 rounded-t-lg flex justify-between items-center">
                    <div>
                        <span className="font-semibold">Online Chat</span>
                        {!isWorkingHours && (
                            <span className="ml-2 text-xs bg-yellow-500 px-2 py-1 rounded">{t('not-working-time')}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="text-white rounded w-6 h-6 flex items-center justify-center"
                    >
                        <MdClose />

                    </button>
                </div>
                <div className="h-96 flex flex-col">
                    <div
                        ref={messageContainerRef}
                        className="flex-1 overflow-y-auto p-3"
                    >
                        {isWorkingHours ? (
                            <>
                                <MessageList messages={messages}/>
                                <div ref={messagesEndRef}/>
                            </>
                        ) : (
                            <WorkingHours onLeaveMessage={handleLeaveMessage}/>
                        )}
                    </div>

                    {isWorkingHours && <MessageInput onSend={sendMessage}/>}
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalContent.title}
            >
                <p className="text-gray-700">{modalContent.message}</p>
            </Modal>
        </>
    );
}