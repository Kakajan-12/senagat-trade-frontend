'use client';

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from "next/image";
import { Autoplay } from "swiper/modules";

interface Partner {
    id: number;
    logo: string;
}

export default function Partners() {
    const t = useTranslations('Partners');
    const [partners, setPartners] = useState<Partner[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners`);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const data: Partner[] = await res.json();
                setPartners(data);
            } catch (err) {
                console.error("Ошибка загрузки партнеров:", err);
            }
        };

        fetchPartners();
    }, []);

    return (
        <div className="my-container mx-auto main-bg-color">
            <div className="container mx-auto px-4">
                <div className="text-white font-medium text-2xl lg:text-4xl xl:text-5xl py-6">{t('partners')}</div>
            </div>
            <div className="bg-white py-4">
                <div className="container mx-auto px-4">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={50}
                        loop={true}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 2000 }}
                    >
                        {partners.map(partner => (
                            <SwiperSlide key={partner.id}>
                                <div className="flex justify-center">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${partner.logo.replace(/\\/g, "/")}`}
                                        alt={`partner-${partner.id}`}
                                        width={200}
                                        height={80}
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}
