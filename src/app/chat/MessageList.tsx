import { ChatMessage } from "@/lib/chat/types";

interface Props {
    messages: ChatMessage[];
}

export default function MessageList({ messages }: Props) {
    return (
        <div>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                    <div className={`inline-block p-2 rounded max-w-xs ${
                        msg.sender === 'user'
                            ? 'bg-[#002A5F] text-white'
                            : 'bg-gray-200 text-black'
                    }`}>
                        {msg.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.time).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}