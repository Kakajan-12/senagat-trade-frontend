'use client';

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface HeaderData {
    id: number;
    images: string;
    section_id: string;
    header_name: string;
}

export default function HeroSection() {
    const t = useTranslations('Hero');
    const [header, setHeader] = useState<HeaderData | null>(null);

    useEffect(() => {
        const fetchHeader = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/header`);

                if (!res.ok) {
                    throw new Error(`HTTP error ${res.status}`);
                }

                const data = await res.json();
                setHeader(Array.isArray(data) ? data[0] : data);

            } catch (err) {
                console.error('Ошибка загрузки header:', err);
            }
        };

        fetchHeader();
    }, []);


    return (
        <div
            className="min-h-screen bg-cover bg-center flex justify-end items-center"
            style={{
                backgroundImage: header?.images
                    ? `url(${process.env.NEXT_PUBLIC_API_URL}/uploads/${header.images})`
                    : 'none',
            }}

        >
            <div
                className="ml-8 p-14 bg-white max-w-2xl space-y-4"
                style={{ borderTopLeftRadius: "100px" }}
            >
                <h1 className="font-medium text-color text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    Senagat Trade
                </h1>

                <p className="text-color text-xs sm:text-sm md:text-md lg:text-lg">
                    {t('hero-text')}
                </p>
            </div>
        </div>
    );
}
