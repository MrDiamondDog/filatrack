import { Home } from "lucide-react";
import Button, { ButtonStyles } from "../components/base/Button";
import Subtext from "../components/base/Subtext";
import Divider from "@/components/base/Divider";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="absolute-center bg-bg-light p-5 rounded-lg">
            <h2>404 - Not Found</h2>
            <Subtext>We couldn't find that page.</Subtext>
            <Divider />
            <Link href="/app/"><Button className="w-full" look={ButtonStyles.primary}><Home /> Home</Button></Link>
        </div>
    );
}
