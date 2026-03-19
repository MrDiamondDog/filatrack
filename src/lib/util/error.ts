import { toast } from "sonner";

export function toastError(title: string, e: Error) {
    if (e.message.includes("autocancelled"))
        return;

    toast.error(title, { description: e.message });
}
