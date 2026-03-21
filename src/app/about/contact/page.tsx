"use client";

import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Input from "@/components/base/Input";
import RequiredStar from "@/components/base/RequiredStar";
import Subtext from "@/components/base/Subtext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormDataEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("access_key", "dd6195d1-0709-4de6-88f7-c8d208e28183");

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
        <h2>Contact Us</h2>
        <Subtext>Problem? Question? Suggestion? Joke? Contact us! We will reply to you with your email if necessary.</Subtext>
        <Divider />

        {/* @ts-ignore i call BS */}
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <Input label="Name" name="name" required/>
            <Input label="Email" type="email" name="email" required/>
            <p>Message<RequiredStar /></p>
            <textarea name="message" required
                className="bg-bg-lighter rounded-lg p-2 outline-none border-2 border-transparent focus:border-primary"
            />
            <Button type="submit" loading={loading}>Submit</Button>
        </form>
    </div>;
}
