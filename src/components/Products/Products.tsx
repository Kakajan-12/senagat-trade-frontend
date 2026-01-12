'use client';

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name_en: string;
    name_ru: string;
    text_en: string;
    text_ru: string;
    category_id: number;
    category_name: string; // "In Stock" | "On Demand"
}

export default function ProductsSection() {
    const t = useTranslations('Products');
    const p = useTranslations('Header');
    const locale = useLocale();

    const [activeCategory, setActiveCategory] = useState<'In Stock' | 'On Demand'>('In Stock');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                const data: Product[] = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Ошибка загрузки продуктов:', err);
            }
        };
        fetchProducts();
    }, []);

    // фильтруем продукты по категории и берем последние 4
    const getActiveProducts = () => {
        return products
            .filter(p => p.category_name === activeCategory)
    };

    return (
        <div className="main-bg-color py-8">
            <div className="bg-[url('/bg-logo.svg')] bg-no-repeat bg-top-left">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between space-x-4 mb-4">
                        <h4 className="text-nowrap text-white font-medium text-2xl lg:text-4xl xl:text-5xl">
                            {p('products')}
                        </h4>
                        <div className="w-full flex items-end pb-1">
                            <div className="w-full flex items-center h-1">
                                <div className="bg-white h-0.5 w-full"></div>
                                <div className="rounded-full bg-white w-2 h-2"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 py-6">
                        <button
                            onClick={() => setActiveCategory('In Stock')}
                            className={`rounded-3xl border border-white px-6 py-1 text-md md:text-lg transition-all duration-300 ${
                                activeCategory === 'In Stock'
                                    ? 'product-active text-white'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            {t('in-stock')}
                        </button>
                        <button
                            onClick={() => setActiveCategory('On Demand')}
                            className={`rounded-3xl border border-white px-6 py-1 text-md md:text-lg transition-all duration-300 ${
                                activeCategory === 'On Demand'
                                    ? 'product-active text-white'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            {t('on-demand')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {getActiveProducts().map(product => (
                            <div
                                key={product.id}
                                className="w-full bg-white h-56 flex flex-col justify-between p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="text-color font-medium text-2xl">
                                    {locale === 'ru' ? product.name_ru : product.name_en}
                                </div>
                                <div
                                    className="text-gray-600"
                                    dangerouslySetInnerHTML={{
                                        __html: locale === 'ru' ? product.text_ru : product.text_en
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
