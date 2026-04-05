import { prodUrl } from "@/constants";
import "./globals.css";
import { Metadata } from "next";
import { Lexend } from "next/font/google";
import HolyLoader from "holy-loader";
import { Toaster } from "sonner";
import { CheckCircle2, CircleAlert, Info } from "lucide-react";
import { PublicEnv } from "@/public-env";

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Filatrack - Simple Filament Tracking",
    description: "The simplest 3d printing filament tracker. Free forever, no ads, open-source, self-hostable!!",
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
        description: "The simplest way to track 3d printing filament!",
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
                <PublicEnv />

                <HolyLoader
                    color="linear-gradient(to right, #3263ce, #3364ce)"
                />

                {children}

                <Toaster
                    className="toaster group"
                    theme="dark"
                    richColors
                    style={{
                        "--normal-bg": "var(--color-bg-light)",
                        "--normal-text": "white",
                        "--normal-border": "var(--color-bg-lightest)",
                    } as React.CSSProperties}
                    visibleToasts={5}
                    icons={{
                        success: <CheckCircle2 size={20} />,
                        error: <CircleAlert size={20} />,
                        info: <Info size={20} />,
                    }}
                />

                <div id="portal-root" />
            </body>
        </html>
    );
}
