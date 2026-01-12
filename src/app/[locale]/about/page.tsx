'use client'
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import {useEffect, useState} from "react";

interface AboutData {
    id: number;
    title_en: string;
    text_en: string;
    title_ru: string;
    text_ru: string;
}

export default function About() {
    const t = useTranslations('Header')
    const a = useTranslations('About')
    const locale = useLocale();
    const [aboutData, setAboutData] = useState<AboutData[]>([]);
    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
                const data: AboutData[] = await res.json();
                setAboutData(data);
            } catch (err) {
                console.error("Ошибка загрузки данных About:", err);
            }
        };
        fetchAbout();
    }, []);

    return (
        <div className="my-container mx-auto main-bg-color">
            <div className="min-h-screen bg-[url('/about.webp')] bg-cover bg-center flex justify-start items-end">
                <div className="pl-10 pb-10 text-white font-medium text-4xl md:text-6xl lg:text-8xl">{t('about')}</div>
            </div>
            <div className="relative">
                <div className="absolute left-0 h-full z-20">
                    <Image src="/bg-logo.svg" alt="logo"
                           width={200} height={400}
                    className="h-full w-full"/>
                </div>
                <div className="hidden md:block absolute left-0 top-1/3">
                    <Image src="/about-content.webp" alt="about" width={200} height={300}
                           className="h-96 w-full"
                           style={{
                               borderTopRightRadius: "150px"
                           }}/>
                </div>
                <div className="container mx-auto px-4 z-50 relative">
                    <div className="flex justify-end py-8">
                        <div className="max-w-3xl">
                            <h4 className="text-white text-2xl md:text-4xl lg:text-5xl font-medium mb-6">{a('title')}</h4>
                            <p className="text-white text-sm sm:text-md md:text-lg">{a('text')}</p>

                            <div className="pt-8">
                                <h4 className="text-white text-2xl md:text-4xl lg:text-5xl font-medium mb-6">{a('sub-title')}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {aboutData.map((item, index) => (
                                        <div key={item.id} className="space-y-2">
                                            <div className="text-white font-medium border-b border-dashed pb-1 text-lg">
                                                {String(index + 1).padStart(2, '0')}.
                                            </div>
                                            <p className="text-white font-medium text-lg">
                                                {locale === 'ru' ? item.title_ru : item.title_en}
                                            </p>
                                            <p
                                                className="text-white text-sm"
                                                dangerouslySetInnerHTML={{
                                                    __html: locale === 'ru' ? item.text_ru : item.text_en,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}