"use client";

import dynamic from "next/dynamic";
import Script from "next/script";

function Analytics() {
    return (<>
        {/* <!-- Google tag (gtag.js) --> */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-9KPCZN25YJ"></script>
        <script>
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-9KPCZN25YJ');`}
        </script> */}
        {((window.localStorage.getItem("allowAnalytics") ?? "false") === "true") && <Script
            src="https://a.drewrat.dev/api/script.js"
            data-site-id="1"
            strategy="afterInteractive"
            data-session-replay="true"
            data-track-errors="true"
            data-replay-mask-text-selectors='[".a-hide"]'
        />}
    </>);
}

export default dynamic(() => Promise.resolve(Analytics), { ssr: false });
