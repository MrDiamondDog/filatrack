"use client";

import { pb } from "@/api/pb";
import SSOButton from "@/components/auth/SSOButton";
import Divider from "@/components/base/Divider";
import Spinner from "@/components/base/Spinner";
import LandingBackground from "@/components/landing/LandingBackground";
import { Suspense, useEffect } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa6";

export default function LoginPage() {
    useEffect(() => {
        pb.authStore.clear();
    }, []);

    return (<Suspense fallback={<Spinner />}>
        <LandingBackground />

        <main className="absolute-center bg-bg-light rounded-lg p-4 md:w-fit w-3/4">
            <h2 className="text-center w-full">Login</h2>

            <Divider />

            <div className="flex flex-col gap-2">
                <SSOButton provider="google" icon={<FaGoogle />}>
                    Sign in with Google
                </SSOButton>
                <SSOButton provider="github" icon={<FaGithub />}>
                    Sign in with GitHub
                </SSOButton>
            </div>

            <Divider />

            <a href="/about/privacy-policy">Privacy Policy</a>
        </main>
    </Suspense>);
}
