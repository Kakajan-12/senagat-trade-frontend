import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Senagat Trade",
    description: "Senagat Trade specializes in supplying chemicals and packaging solutions for manufacturers. Since 2017, we have been committed to delivering high-quality raw materials and tailored export services, supporting industries with professionalism and expertise. By staying dedicated to our core areas of operation, we build long-term partnerships and provide innovative solutions that meet the evolving needs of our clients.",
    icons: {
        icon: [{url: "/logo.png", type: "image/svg+xml"}],
    }
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
        <body>{children}</body>
        </html>
    );
}
