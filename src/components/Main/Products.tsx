'use client';

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

interface Product {
    id: number;
    name_en: string;
    text_en: string;
    name_ru: string;
    text_ru: string;
    category_id: number;
    category_name: string;
}

export default function MainProducts() {
    const t = useTranslations('Products');
    const locale = useLocale();

    const [inStock, setInStock] = useState<Product[]>([]);
    const [onDemand, setOnDemand] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const data: Product[] = await res.json();

                const inStockProducts = data
                    .filter(p => p.category_name === "In Stock")
                    .slice(-4);

                const onDemandProducts = data
                    .filter(p => p.category_name === "On Demand")
                    .slice(-4);

                setInStock(inStockProducts);
                setOnDemand(onDemandProducts);
            } catch (err) {
                console.error("Ошибка загрузки продуктов:", err);
            }
        };

        fetchProducts();
    }, []);

    const renderProducts = (products: Product[]) =>
        products.map(product => {
            const name = locale === "ru" ? product.name_ru : product.name_en;
            const text = locale === "ru" ? product.text_ru : product.text_en;

            return (
                <div key={product.id} className="w-full bg-white h-56 flex flex-col justify-between p-4">
                    <div className="text-color font-medium text-2xl">{name}</div>
                    <div dangerouslySetInnerHTML={{ __html: text }}></div>
                </div>
            );
        });

    return (
        <div className="main-bg-color py-8">
            <div className="bg-[url('/bg-logo.svg')] bg-no-repeat bg-left bg-contain">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between space-x-4 mb-8">
                        <h4 className="text-nowrap text-white font-medium text-2xl lg:text-4xl xl:text-5xl">{t('in-stock')}</h4>
                        <div className="w-full flex items-end pb-1">
                            <div className="w-full flex items-center h-1">
                                <div className="bg-white h-0.5 w-full"></div>
                                <div className="rounded-full bg-white w-2 h-2"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {renderProducts(inStock)}
                    </div>

                    <div className="flex justify-between space-x-4 my-8">
                        <h4 className="text-nowrap text-white font-medium text-2xl lg:text-4xl xl:text-5xl">{t('on-demand')}</h4>
                        <div className="w-full flex items-end pb-1">
                            <div className="w-full flex items-center h-1">
                                <div className="bg-white h-0.5 w-full"></div>
                                <div className="rounded-full bg-white w-2 h-2"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {renderProducts(onDemand)}
                    </div>
                </div>
            </div>
        </div>
    );
}
