import Spinner from "@/components/base/Spinner";
import { Suspense } from "react";

export default function LoginLayout({
    children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return <Suspense fallback={<Spinner />}>
        {children}
    </Suspense>;
}
