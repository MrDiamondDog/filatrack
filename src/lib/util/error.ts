import { toast } from "sonner";

export function toastError(title: string, e: Error): undefined {
    if (e.message.includes("autocancelled"))
        return undefined;

    if (e.message.includes("NEXT_REDIRECT"))
        return undefined;

    toast.error(title, { description: e.message });

    return undefined;
}
