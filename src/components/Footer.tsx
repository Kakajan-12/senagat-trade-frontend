'use client';

import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import { IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { FaTelegramPlane, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";

interface Address {
    id: number;
    address_en: string;
    address_ru: string;
}

interface Mail {
    id: number;
    mail: string;
}

interface Phone {
    id: number;
    phone: string;
}

interface LinkItem {
    id: number;
    icon: string;
    url: string;
}

export default function Footer() {
    const t = useTranslations('Footer');
    const h = useTranslations('Header');
    const locale = useLocale();
    const [address, setAddress] = useState<Address | null>(null);
    const [mail, setMail] = useState<Mail | null>(null);
    const [phone, setPhone] = useState<Phone | null>(null);
    const [links, setLinks] = useState<LinkItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [addressRes, mailRes, phoneRes, linksRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/address`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mail`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/phone`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`)
                ]);

                const [addressData, mailData, phoneData, linksData] = await Promise.all([
                    addressRes.json(),
                    mailRes.json(),
                    phoneRes.json(),
                    linksRes.json()
                ]);

                setAddress(addressData[0] || null);
                setMail(mailData[0] || null);
                setPhone(phoneData[0] || null);
                setLinks(linksData || []);
            } catch (err) {
                console.error('Ошибка загрузки данных для Footer:', err);
            }
        };

        fetchData();
    }, []);

    const renderMessengers = () => (
        links.map((item) => {
            let Icon = null;
            switch (item.icon.toLowerCase()) {
                case "telegram":
                    Icon = FaTelegramPlane;
                    break;
                case "linkedin":
                    Icon = FaLinkedinIn;
                    break;
                case "instagram":
                    Icon = FaInstagram;
                    break;
                case "whatsapp":
                    Icon = FaWhatsapp;
                    break;
                default:
                    return null;
            }

            return (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="text-white">
                    <Icon size={28} />
                </a>
            );
        })
    );

    return (
        <div className="my-container mx-auto py-8 footer-bg-color">
            <div className="container mx-auto px-4">
                <div className="mb-4">
                    <Image src="/header-logo.svg" alt="logo" width={200} height={50} />
                </div>

                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 justify-between space-x-8 py-4">
                    <div className="text-white text-sm md:text-md max-w-2xl">{t('footer-text')}</div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 space-x-4 justify-between max-w-sm w-full">
                        {/* Quick Links */}
                        <div>
                            <p className="font-medium text-white text-nowrap mb-4">{t('quick-links')}</p>
                            <div className="flex flex-col space-y-4">
                                <Link className="text-white w-fit" href="/about">{h('about')}</Link>
                                <Link className="text-white w-fit" href="/products">{h('products')}</Link>
                                <Link className="text-white w-fit" href="/contacts">{h('contact')}</Link>
                            </div>
                        </div>

                        {/* Contacts */}
                        <div>
                            <p className="font-medium text-white mb-4">{t('contacts')}</p>
                            <div className="flex flex-col space-y-4">
                                {address && (
                                    <div className="flex items-center space-x-2">
                                        <IoLocationOutline className="text-white" size={20} />
                                        <p className="text-white">{locale === 'ru' ? address.address_ru : address.address_en}
                                        </p>
                                    </div>
                                )}
                                {phone && (
                                    <div className="flex items-center space-x-2">
                                        <FiPhone className="text-white" size={20} />
                                        <p className="text-white">{phone.phone}</p>
                                    </div>
                                )}
                                {mail && (
                                    <div className="flex items-center space-x-2">
                                        <IoMailOutline className="text-white" size={20} />
                                        <p className="text-white">{mail.mail}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {links.length > 0 && (
                    <div className="flex justify-end itemx-center space-x-4 py-4">
                        {renderMessengers()}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 text-center items-center justify-center text-white pt-5">
                    <p className="mb-0">All rights reserved</p>
                    <div className="flex items-center justify-end">
                        <p className="mr-2">Powered by</p>
                        <Image src="/hebent-logo.svg" alt="Hebent tech" width={30} height={30} className="w-5" />
                        <Link
                            href="https://hebent.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm md:text-base text-white pt-[1px]"
                        >
                            Hebent Tech
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
