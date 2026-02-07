import { prodUrl } from "@/constants";
import "./globals.css";
import { Metadata } from "next";
import { Lexend } from "next/font/google";
import HolyLoader from "holy-loader";

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Filatrack - Simple Filament Tracking",
    description: "Super-simple tracking of all your 3d printing filaments!",
    icons: [
        {
            url: "/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
        },
        {
            url: "/favicon.svg",
            type: "image/svg+xml",
        },
        {
            url: "/favicon.ico",
            rel: "shortcut icon",
        },
        {
            url: "/apple-touch-icon.png",
            rel: "apple-touch-icon",
            sizes: "180x180",
        },
    ],
    applicationName: "Filatrack",
    appleWebApp: {
        capable: true,
        title: "Filatrack",
        startupImage: "/filament.png",
    },
    manifest: "/site.webmanifest",
    keywords: ["filament", "3d printing", "tracker", "spool", "pla", "filament tracking", "track filament"],
    openGraph: {
        title: "Filatrack",
        description: "A super-simple way to keep inventory of your filament rolls.",
        url: prodUrl,
        siteName: "Filatrack",
        images: [
            {
                url: `${prodUrl}apple-touch-icon.png`,
            },
        ],
    },
    twitter: {
        card: "summary",
        site: "@drew_rat",
        creator: "@drew_rat",
        images: `${prodUrl}/apple-touch-icon.png`,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${lexend.className} antialiased bg-bg`}
            >
                <HolyLoader
                    color="linear-gradient(to right, #3263ce, #3364ce)"
                />

                {children}

                <div id="portal-root" />
            </body>
        </html>
    );
}
