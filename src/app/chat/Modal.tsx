"use client";

import {FaCheck} from "react-icons/fa6";
import {MdOutlineClose} from "react-icons/md";
import {BsInfoCircle} from "react-icons/bs";
import {useTranslations} from "next-intl";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    type?: "success" | "error" | "info";
}

export default function Modal({ isOpen, onClose, title, children, type = "info" }: ModalProps) {
    const t = useTranslations('chat')
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return (
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck />
                    </div>
                );
            case "error":
                return (
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdOutlineClose />
                    </div>
                );
            default:
                return (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BsInfoCircle />
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-80 max-w-sm mx-4">
                <div className="p-6 text-center">
                    {getIcon()}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <div className="text-gray-600 mb-6">{children}</div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 main-bg-color text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {t('okay')}
                    </button>
                </div>
            </div>
        </div>
    );
}