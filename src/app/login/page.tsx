"use client";

import Button from "@/components/Button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { getAuthErrorMessage } from "../../lib/errors";
import { FaGoogle } from "react-icons/fa6";
import { endpoints } from "@/lib/constants";

function LogInButton({ provider, children }: { provider: string } & React.PropsWithChildren) {
    return (
        <Button
            className="flex flex-row gap-1 items-center"
            onClick={() => signIn(provider, {
                redirectTo: "/app",
            })}
            data-rybbit-event="login"
            data-rybbit-prop-provider={provider}
        >
            {children}
        </Button>
    );
}

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (<main className="absolute-center bg-bg-light p-3 flex flex-col gap-2 rounded-lg w-3/4 md:w-[unset]">
        <h2>Log In</h2>
        <LogInButton provider="google"><FaGoogle size={32} /> Sign in with Google</LogInButton>
        <LogInButton provider="github"><FaGithub size={32} /> Sign in with GitHub</LogInButton>
        {error && <p className="text-red-500">{getAuthErrorMessage(error)}</p>}

        <a href={endpoints.privacyPolicy} className="style">Privacy Policy</a>
    </main>);
}
