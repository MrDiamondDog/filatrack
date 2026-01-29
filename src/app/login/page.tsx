import SSOButton from "@/components/auth/SSOButton";
import Divider from "@/components/base/Divider";
import LandingBackground from "@/components/landing/LandingBackground";
import { FaGoogle, FaGithub } from "react-icons/fa6";

// TODO: auth
export default function LoginPage() {
    return (<>
        <LandingBackground />

        <main className="absolute-center bg-bg-light rounded-lg p-4">
            <h2 className="text-center w-full">Login</h2>

            <Divider />

            <div className="flex flex-col gap-2">
                <SSOButton provider="google" icon={<FaGoogle />}>Sign in with Google</SSOButton>
                <SSOButton provider="github" icon={<FaGithub />}>Sign in with GitHub</SSOButton>
            </div>
        </main>
    </>);
}
