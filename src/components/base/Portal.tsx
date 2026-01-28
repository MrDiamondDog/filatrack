import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted)
        return null;

    const portalRoot = document.getElementById("portal-root");
    return portalRoot ? createPortal(children, portalRoot) : null;
}
