"use client";

import { useState } from "react";
import {useTranslations} from "next-intl";

interface WorkingHoursProps {
    onLeaveMessage: (email: string, message: string) => void;
}

export default function WorkingHours({ onLeaveMessage }: WorkingHoursProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t =useTranslations("chat");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) return;

        setIsSubmitting(true);
        onLeaveMessage(email, message);
        setEmail("");
        setMessage("");
        setIsSubmitting(false);
    };

    return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-center mb-4">
                <h3 className="font-semibold text-yellow-800">{t('not-working-time-text')}</h3>
                <p className="text-sm text-yellow-600 mt-1">
                    {t('online-time')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('your-mail')}
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('your-message')}
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('describe-question')}
                        rows={3}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full main-bg-color text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? `${t('sending')}` : `${t('sent')}`}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    {t('note')}
                </p>
            </form>
        </div>
    );
}