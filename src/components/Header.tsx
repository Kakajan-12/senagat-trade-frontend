'use client'
import Link from "next/link";
import Image from "next/image";
import {useTranslations} from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useEffect, useRef, useState} from "react";

export default function Header() {
    const t = useTranslations('Header');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuItems = [
        { id: 1, title: t('home'), link: '/' },
        { id: 2, title: t('products'), link: '/products' },
        { id: 3, title: t('about'), link: '/about' },
        { id: 4, title: t('contact'), link: '/contacts' }
    ];

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLinkClick = () => {
        closeMenu();
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`w-full fixed z-60 transition-all duration-300 ${
            isScrolled ? 'main-bg-color shadow-lg' : 'bg-transparent'
        }`}>
            <div className="container mx-auto">
                <div className="hidden sm:flex justify-between items-center py-2 px-4">
                    <Link href="/">
                        <Image src="/header-logo.svg" alt="logo"
                               width={180} height={50}/>
                    </Link>

                    <nav className="flex space-x-4">
                        <ul className="flex items-center space-x-6">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.link}
                                        className="text-white hover:text-gray-200 transition-colors duration-200"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <LanguageSwitcher/>
                    </nav>
                </div>
                <div className={`sm:hidden px-4
                ${
                    isScrolled || isMenuOpen ? 'main-bg-color' : 'bg-transparent'
                } `}>
                    <div className="flex justify-between items-center py-4">
                        <Link href={`/`} onClick={closeMenu}>
                            <Image
                                src="/header-logo.svg"
                                width={120}
                                height={50}
                                alt="logo"
                                className="cursor-pointer"
                            />
                        </Link>

                        <button
                            ref={buttonRef}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-3 focus:outline-none relative z-50 active:bg-white/10 rounded-md transition"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <div className="relative w-6 h-5 text-white">
                                <span
                                    className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
                                <span
                                    className={`absolute w-6 h-0.5 bg-current top-2 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span
                                    className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
                            </div>
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div
                            ref={menuRef}
                            className="fixed h-full inset-x-0 top-[73px] bg-inherit z-40 p-4 border-gray-700 shadow-lg main-bg-color"
                            style={{backdropFilter: 'blur(10px)'}}
                        >
                            <nav className="flex flex-col space-y-4">
                                <ul className="flex flex-col items-center space-y-6">
                                    {menuItems.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={item.link}
                                                className="text-white hover:text-gray-200 transition-colors duration-200"
                                                onClick={handleLinkClick}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <LanguageSwitcher/>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}