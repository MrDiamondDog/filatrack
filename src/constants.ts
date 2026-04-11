import { getPublicEnv } from "./public-env";

export const baseUrl = getPublicEnv().APP_URL;

export const endpoints = {
    discord: "https://discord.gg/HUjRATbH2g",
    github: "https://github.com/mrdiamonddog/filatrack",
    app: `${baseUrl}app/`,
    dashboard: `${baseUrl}app/`,
    filament: `${baseUrl}app/filament`,
    prints: `${baseUrl}app/prints`,
    settings: `${baseUrl}app/settings`,
    privacyPolicy: `${baseUrl}about/privacy-policy`,
    contact: `${baseUrl}about/contact`,
    feedback: `${baseUrl}about/feedback`,
};
