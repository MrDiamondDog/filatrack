import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuItemProps, DropdownMenuPortal,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
}
    from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";

export function Dropdown({ children }: React.PropsWithChildren) {
    return (
        <DropdownMenu>
            {children}
        </DropdownMenu>
    );
}

export function DropdownTrigger({ asChild, children }: { asChild?: boolean } & React.PropsWithChildren) {
    return (
        <DropdownMenuTrigger asChild={asChild}>
            {children}
        </DropdownMenuTrigger>
    );
}

export function DropdownContent({ children }: React.PropsWithChildren) {
    return (
        <DropdownMenuPortal>
            <DropdownMenuContent
                className={`p-2 bg-bg-lighter rounded-lg text-sm flex flex-col min-w-37.5
                    fade-in z-200 drop-shadow-lg max-h-100 overflow-scroll`}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenuPortal>
    );
}

export function DropdownItem({ children, danger, onClick, ...props }: {
    danger?: boolean,
    onClick?: (e: MouseEvent) => void,
    selected?: boolean
}
& DropdownMenuItemProps) {
    return (
        <DropdownMenuItem
            {...props}
            className={`${danger && "text-danger"} px-2 py-1 rounded-lg 
                cursor-pointer outline-none transition-all hover:bg-bg-lightest ${props.className}
                ${props.selected && "flex items-center gap-1"}`
            }
            style={props.style}
            onClick={e => {
                e.stopPropagation();
                onClick?.(e);
            }}
        >
            {props.selected && <Check size={20} className="text-gray-500" />} {children}
        </DropdownMenuItem>
    );
}

export function DropdownSub({ children }: React.PropsWithChildren) {
    return (
        <DropdownMenuSub>
            {children}
        </DropdownMenuSub>
    );
}

export function DropdownSubTrigger({ asChild, children }: { asChild?: boolean } & React.PropsWithChildren) {
    return (
        <DropdownMenuSubTrigger asChild={asChild}>
            {children}
        </DropdownMenuSubTrigger>
    );
}

export function DropdownSubContent({ children }: React.PropsWithChildren) {
    return (
        <DropdownMenuPortal>
            <DropdownMenuSubContent
                className={`p-2 bg-bg-lighter rounded-lg text-sm flex flex-col min-w-37.5
                    fade-in z-200 drop-shadow-lg max-h-100 overflow-scroll`}
            >
                {children}
            </DropdownMenuSubContent>
        </DropdownMenuPortal>
    );
}
