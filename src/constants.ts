/**
 * The width of the sidebar (on PC)
 */
export const sidebarWidth = "180px";

/**
 * The last time the privacy policy was updated. This is manually updated when it is modified.
 */
export const lastPrivacyPolicyUpdate = new Date("7/7/25 00:00:00 GMT-0000");

/**
 * The development URL for Filatrack. (with trailing slash)
 */
export const devUrl = "http://localhost:3000/";
/**
 * The production URL for Filatrack. (with trailing slash)
 */
export const prodUrl = "https://filatrack.app/";

/**
 * True if the current enviornment is production.
 */
export const isProd = process.env.NODE_ENV === "production";

/**
 * Gets the current URL based on enviornment
 */
export const baseUrl = isProd ? prodUrl : devUrl;

/**
 * The endpoints of Filatrack.
 */
export const endpoints = {
    discord: `${baseUrl}discord`,
    github: `${baseUrl}github`,
    app: `${baseUrl}app/dashboard`,
    dashboard: `${baseUrl}app/dashboard`,
    filament: `${baseUrl}app/filament`,
    prints: `${baseUrl}app/prints`,
    settings: `${baseUrl}app/settings`,
    privacyPolicy: `${baseUrl}about/privacy-policy`,
    contact: `${baseUrl}about/contact`,
};

declare global {
  interface Window {
    rybbit?: {
      event: (eventName: string, eventData?: Record<string, any>) => void;
      pageview: () => void;
    };
  }
}
