"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Input from "@/components/base/Input";
import Spinner from "@/components/base/Spinner";
import LandingBackground from "@/components/landing/LandingBackground";
import { defaultUserSettings } from "@/lib/user";
import { redirect, useRouter } from "next/navigation";
import { AuthMethodsList } from "pocketbase";
import { useState, useEffect, Suspense } from "react";

export default function SignupPage() {
    const [providers, setProviders] = useState<AuthMethodsList>();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const router = useRouter();

    if (!(providers?.password.enabled ?? true))
        return redirect("/login");

    useEffect(() => {
        pb.authStore.clear();

        pb.collection("users").listAuthMethods()
            .then(setProviders);
    }, []);

    useEffect(() => {
        setError("");
    }, [email, username, password, passwordConfirm]);

    function signup() {
        setError("");

        if (!username || !email || !password ||
                !email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || password !== passwordConfirm)
            return void setError("Please input a valid email and password.");

        if (username.length < 4 || username.length > 20)
            return void setError("Username must be between 4 and 20 characters.");

        if (password.length < 8)
            return void setError("Password must be at least 8 characters");

        pb.collection("users").create({ ...defaultUserSettings, name: username, email, password, passwordConfirm })
            .then(() => router.push("/app"))
            .catch(e => {
                console.error(e);
                setError(e.message);
            });
    }

    return <Suspense fallback={<Spinner />}>
        <LandingBackground />

        <main className="absolute-center bg-bg-light rounded-lg p-4 md:w-fit w-3/4">
            <h2 className="text-center w-full">Sign Up</h2>

            <Divider />

            {error && <div className="bg-danger-secondary border-2 border-danger p-2 rounded-lg">
                {error}
            </div>}

            {providers ? <div>
                {providers.password.enabled ? <>
                    <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} />
                    <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <Input label="Confirm Password" type="password" value={passwordConfirm}
                        onChange={e => setConfirmPassword(e.target.value)} />
                    <Button
                        className="w-full my-2"
                        onClick={signup}
                    >
                        Sign Up
                    </Button>
                    <p>Already have an account? <a href="/login">Log In</a></p>
                    <Divider />
                </> : <p>Sign ups are currently disabled.</p>}
            </div> : <Spinner />}

            <a href="/about/privacy-policy">Privacy Policy</a>
        </main>
    </Suspense>;
}
