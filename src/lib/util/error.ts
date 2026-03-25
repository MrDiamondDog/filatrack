import { toast } from "sonner";

export function toastError(title: string, e: Error): undefined {
    if (e.message.includes("autocancelled"))
        return undefined;

    toast.error(title, { description: e.message });

    return undefined;
}
