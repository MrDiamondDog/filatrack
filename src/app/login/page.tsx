"use client";

import { pb } from "@/api/pb";
import SSOButton from "@/components/auth/SSOButton";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Input from "@/components/base/Input";
import Spinner from "@/components/base/Spinner";
import LandingBackground from "@/components/landing/LandingBackground";
import { login } from "@/lib/auth";
import { defaultUserSettings } from "@/lib/user";
import { getPublicEnv } from "@/public-env";
import Link from "@mui/material/Link";
import { useSearchParams } from "next/navigation";
import { AuthMethodsList } from "pocketbase";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const [providers, setProviders] = useState<AuthMethodsList>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const searchParams = useSearchParams();

    useEffect(() => {
        pb.authStore.clear();

        pb.collection("users").listAuthMethods()
            .then(setProviders);
    }, []);

    useEffect(() => {
        setError("");
    }, [email, password]);

    function auth() {
        if (!email || !password || !email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/))
            return;

        pb.collection("users").authWithPassword(email, password, defaultUserSettings)
            .then(res => login(res, searchParams.get("to") ?? undefined))
            .catch(e => {
                if (e.message.includes("NEXT_REDIRECT"))
                    return;
                console.error(e);
                setError(e.message);
            });
    }

    return (<>
        <LandingBackground />

        <main className="absolute-center bg-bg-light rounded-lg p-4 md:w-fit w-3/4" onKeyDown={e => e.key === "Enter" && auth()}>
            <h2 className="text-center w-full">Login</h2>

            <Divider />

            {error && <div className="bg-danger-secondary border-2 border-danger p-2 rounded-lg">
                {error}
            </div>}

            {providers ? <div>
                {providers.password.enabled && <>
                    <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <Button
                        className="w-full my-2"
                        disabled={!email || !password ||
                            !email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)}
                        onClick={auth}
                    >
                        Login
                    </Button>
                    <p>Don't have an account yet? <Link href="/signup">Sign Up</Link></p>
                    <Link href="/login/reset">Reset Password</Link>
                    <Divider />
                </>}
                {providers.oauth2.enabled && <div className="flex flex-col gap-2">
                    {providers.oauth2.providers.map(provider => <SSOButton
                        provider={provider.name}
                        icon={<img src={`${getPublicEnv().PB_URL}_/images/oauth2/${provider.name}.svg`} className="size-5" />}
                        key={provider.name}
                    >
                        Sign in with {provider.displayName}
                    </SSOButton>
                    )}
                    <Divider />
                </div>}
            </div> : <Spinner />}

            <a href="/about/privacy-policy">Privacy Policy</a>
        </main>
    </>);
}
