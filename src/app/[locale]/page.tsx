'use client';

import Hero from "@/components/Main/Hero";
import MainProducts from "@/components/Main/Products";
import Partners from "@/components/Main/Partners";

export default function HomePage() {

    return (
        <div className="my-container mx-auto">
            <Hero/>
            <MainProducts/>
            <Partners/>
        </div>
    );
}