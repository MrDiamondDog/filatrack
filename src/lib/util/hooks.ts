"use client";

import { useCallback, useEffect, useState } from "react";

export function useObjectState<T extends object>(initial: T) {
    const [state, setState] = useState(initial);

    const update = useCallback((patch: Partial<T>) => {
        setState(prev => ({ ...prev, ...patch }));
    }, []);

    return [state, update] as const;
}

export function useDevice() {
    const [width, setWidth] = useState(0);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const isMobile = (!width ? false : width <= 768);

    return [isMobile, width] as const;
}
