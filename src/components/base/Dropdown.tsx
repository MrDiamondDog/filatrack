import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuItemProps, DropdownMenuPortal, DropdownMenuTrigger }
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

export function DropdownItem({ children, danger, onClick, ...props }: { danger?: boolean, onClick?: () => void, selected?: boolean }
& DropdownMenuItemProps) {
    return (
        <DropdownMenuItem
            {...props}
            className={`${danger && "text-danger"} px-2 py-1 rounded-lg 
                cursor-pointer outline-none transition-all hover:bg-bg-lightest ${props.className}`
            }
            style={props.style}
            onClick={e => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            {props.selected && <Check />} {children}
        </DropdownMenuItem>
    );
}
