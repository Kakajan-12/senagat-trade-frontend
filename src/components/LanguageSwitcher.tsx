'use client'
import {usePathname, useRouter} from "next/navigation";
import {useState, useEffect, useRef} from "react";
import {useLocale} from "next-intl"; // Изменено с "use-intl" на "next-intl"

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const languages = [
        { code: "en" },
        { code: "ru" }
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const locale = useLocale();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(lang => lang.code === locale);

    const handleLanguageChange = (newLocale: string) => {
        const newPathname = `/${newLocale}${pathname.replace(`/${locale}`, '') || ''}`;
        router.push(newPathname);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div>
            <div className="hidden sm:block relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
                >
                    {currentLanguage && (
                        <>
                            <span className="text-sm font-medium uppercase cursor-pointer">{currentLanguage.code}</span>
                        </>
                    )}

                </button>

                {isMenuOpen && (
                    <div className="absolute top-full mt-2 -right-1 bg-white shadow-lg z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center space-x-3 w-full px-3 py-2 transition-colors duration-150 cursor-pointer ${
                                    locale === lang.code
                                        ? "main-bg-color text-white"
                                        : "text-gray-700"
                                }`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm uppercase">{lang.code}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="sm:hidden">
                    <div className="mt-2 flex justify-center space-x-4">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center space-x-3 w-fit px-3 py-2 transition-colors duration-150 cursor-pointer ${
                                    locale === lang.code
                                        ? "bg-white rounded-md"
                                        : "text-white"
                                }`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm uppercase">{lang.code}</span>
                                </div>
                            </button>
                        ))}
                    </div>
            </div>
        </div>

    )
}