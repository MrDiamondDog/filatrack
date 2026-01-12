import React, { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import Input from "./Input";

// https://codesandbox.io/p/sandbox/opmco
function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: Function) {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        function listener(event: MouseEvent) {
            if (startedInside || !startedWhenMounted)
                return;
            if (!ref.current || ref.current.contains(event.target as Node))
                return;

            handler(event);
        };

        function validateEventStart(event: Event) {
            startedWhenMounted = !!ref.current;
            startedInside = ref.current! && ref.current.contains(event.target as Node);
        };

        document.addEventListener("mousedown", validateEventStart);
        document.addEventListener("touchstart", validateEventStart);
        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("mousedown", validateEventStart);
            document.removeEventListener("touchstart", validateEventStart);
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
};

export default function PopoverColorPicker({ color, onChange }: { color: string, onChange: (color: string) => void }) {
    const popover = useRef<HTMLDivElement | null>(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-bg-lighter p-2 rounded-lg w-full cursor-pointer hover:bg-bg-lightest transition-all">
                <div
                    className="w-full h-10 rounded-lg"
                    style={{ backgroundColor: color }}
                    onClick={() => toggle(true)}
                />
            </div>

            {isOpen && (
                <div className="popover flex flex-col items-center gap-2" ref={popover}>
                    <HexColorPicker color={color} onChange={onChange} />
                    <Input placeholder="Hex Code" value={color} onChange={e => onChange(e.target.value)} />
                </div>
            )}
        </div>
    );
};
