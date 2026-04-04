"use client";

import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import RequiredStar from "@/components/base/RequiredStar";
import Subtext from "@/components/base/Subtext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormDataEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        // This key is meant to be public
        formData.append("access_key", "49cb347e-e8b3-4533-93b1-dbe4b8868c19");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        (e.target as HTMLFormElement).reset();
        if (data.success)
            toast.success("Form submitted successfully!");
        else {
            toast.error("Form could not be submitted. Details in console.");
            console.log(data);
        }
        setLoading(false);
    }

    return <div className="absolute-center rounded-lg bg-bg-light p-4 border-2 border-primary max-w-150">
        <Link href="/app" className="flex gap-1 items-center"><ArrowLeft /> Back</Link>
        <h2>Send Your Feedback</h2>
        <Subtext>
            We are always accepting feedback! Mention anything you'd like to see or be changed. The more details the better!
        </Subtext>
        <Divider />

        {/* @ts-ignore i call BS */}
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <p>Message<RequiredStar /></p>
            <textarea name="message" required
                className="bg-bg-lighter rounded-lg p-2 outline-none border-2 border-transparent focus:border-primary"
            />
            <Button type="submit" loading={loading}>Submit</Button>
        </form>
    </div>;
}
