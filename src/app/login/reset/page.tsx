"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Input from "@/components/base/Input";
import Spinner from "@/components/base/Spinner";
import LandingBackground from "@/components/landing/LandingBackground";
import { emailRegex } from "@/lib/util/regex";
import Link from "next/link";
import { Suspense, useState } from "react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [canSend, setCanSend] = useState(true);

    function sendEmail() {
        if (!canSend || !email.match(emailRegex))
            return;

        pb.collection("users").requestPasswordReset(email);

        setEmailSent(true);

        setCanSend(false);
        setTimeout(() => setCanSend(true), 1000 * 60);
    }

    return (<Suspense fallback={<Spinner />}>
        <LandingBackground />

        <main className="absolute-center bg-bg-light rounded-lg p-4 md:w-fit w-3/4">
            <h2 className="text-center w-full">Reset Password</h2>
            <Divider />

            {!emailSent && <div className="flex flex-col gap-2">
                <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <Button onClick={sendEmail}>Send Email</Button>
            </div>}

            {emailSent && <div className="flex flex-col gap-2">
                <p className="text-wrap whitespace-pre-wrap">
                    An email has been sent containing instructions to reset your password.{"\n"}
                    <Link href="/login/reset">Send Again</Link>
                </p>
            </div>}

            <Link href="/login">Login</Link>
        </main>
    </Suspense>);
}
