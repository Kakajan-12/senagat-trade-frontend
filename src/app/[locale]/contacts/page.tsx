'use client';
import {useTranslations} from "next-intl";
import {useState, ChangeEvent, useEffect} from "react";
import toast, { Toaster } from 'react-hot-toast';
import "./contacts.css"

interface FloatingInputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    isFocused: boolean;
}

const FloatingInput = ({
                           label,
                           name,
                           type = "text",
                           value,
                           onChange,
                           onFocus,
                           onBlur,
                           isFocused
                       }: FloatingInputProps) => {
    const shouldFloat = isFocused || value;

    return (
        <div className="relative mt-8">
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                className="w-full bg-transparent text-white border-b border-white
                   pt-6 pb-2 focus:outline-none
                   transition-colors duration-300"
                required
            />
            <label className={`
                absolute left-0 transition-all duration-300 pointer-events-none
                text-white text-lg
                ${shouldFloat
                ? 'top-0 text-sm text-blue-300'
                : 'top-1/2 transform -translate-y-1/2 text-gray-300'
            }
            `}>
                {label}
            </label>
        </div>
    );
};

export default function Contacts() {
    const t = useTranslations('Contacts')

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        mail: '',
        phone: '',
        message: '',
        captchaText: "",
    });

    const [focusedField, setFocusedField] = useState<string>('');
    const [captchaImage, setCaptchaImage] = useState("");
    const [sending, setSending] = useState(false);

    const loadCaptcha = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/captcha`, {
            method: 'GET',
            credentials: 'include',
        });
        const svg = await res.text();
        setCaptchaImage(svg);
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const handleChange = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleFocus = (field: string) => () => setFocusedField(field);
    const handleBlur = () => setFocusedField('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...formData}),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to send");
                loadCaptcha();
            } else {
                toast.success("Message sent successfully!");
                setFormData({
                    name: "",
                    surname: "",
                    mail: "",
                    phone: "",
                    message: "",
                    captchaText: "",
                });
                loadCaptcha();
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="my-container main-bg-color mx-auto bg-[url('/bg-logo.svg')] bg-no-repeat py-24">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="lg:w-1/2">
                        <h4 className="text-white text-5xl font-bold mb-4">{t('title')}</h4>
                        <p className="text-white text-md opacity-90 max-w-xl">{t('text')}</p>
                    </div>
                    <div className="lg:w-1/2">
                        <form action="#" className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput
                                    label={t('name')}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    onFocus={handleFocus('name')}
                                    onBlur={handleBlur}
                                    isFocused={focusedField === 'name'}
                                />
                                <FloatingInput
                                    label={t('surname')}
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange('surname')}
                                    onFocus={handleFocus('surname')}
                                    onBlur={handleBlur}
                                    isFocused={focusedField === 'surname'}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput
                                    label={t('mail')}
                                    name="mail"
                                    type="email"
                                    value={formData.mail}
                                    onChange={handleChange('mail')}
                                    onFocus={handleFocus('mail')}
                                    onBlur={handleBlur}
                                    isFocused={focusedField === 'mail'}
                                />
                                <FloatingInput
                                    label={t('phone')}
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    onFocus={handleFocus('phone')}
                                    onBlur={handleBlur}
                                    isFocused={focusedField === 'phone'}
                                />
                            </div>
                            <div className="relative mt-8">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange('message')}
                                    onFocus={handleFocus('message')}
                                    onBlur={handleBlur}
                                    className="w-full bg-transparent text-white border-b border-white
                                        pt-8 pb-2 focus:outline-none
                                        transition-colors duration-300 resize-none h-44"
                                />
                                <label className={`
                                    absolute left-0 transition-all duration-300 pointer-events-none
                                    text-white
                                    ${focusedField === 'message' || formData.message
                                    ? 'top-0 text-sm text-blue-300'
                                    : 'top-8 text-gray-300'
                                }
                                `}>
                                    {t('message')}
                                </label>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center mt-8 gap-4 space-x-6">
                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 m-0">
                                    <div dangerouslySetInnerHTML={{__html: captchaImage}}/>
                                    {/*<button*/}
                                    {/*    type="button"*/}
                                    {/*    onClick={loadCaptcha}*/}
                                    {/*    className="text-sm text-white underline cursor-pointer"*/}
                                    {/*>*/}
                                    {/*    Refresh*/}
                                    {/*</button>*/}
                                    <input
                                        name="captchaText"
                                        value={formData.captchaText}
                                        onChange={handleChange('captchaText')}
                                        className="border border-white text-md py-2 px-3 rounded-md outline-none bg-white"
                                        placeholder="recaptcha"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-8 py-3 bg-white text-white rounded-lg
                                        transition-colors duration-300 text-color
                                        font-medium w-full cursor-pointer"
                                >
                                    {sending ? 'Sending...' : t('send')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
