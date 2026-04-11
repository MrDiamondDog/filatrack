import Button, { ButtonStyles } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Subtext from "@/components/base/Subtext";
import LandingBackground from "@/components/landing/LandingBackground";
import RotatingFilament from "@/components/landing/RotatingFilament";
import { endpoints } from "@/constants";
import { ArrowRight, ChevronDown, CircleDollarSign, Code, GlobeLock, QrCode, ScrollText, Smartphone } from "lucide-react";
import Link from "next/link";

function LandingCard({ children }: React.PropsWithChildren) {
    return (
        <div className="bg-bg-light p-3 rounded-lg border-2 border-transparent hover:border-primary transition-all drop-shadow-lg">
            {children}
        </div>
    );
}

function LandingCardHeader({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-row gap-1 items-center">
            {children}
        </div>
    );
}

export default function Home() {
    return (<>
        <LandingBackground />

        <div className="absolute-center md:w-fit w-[90vw]">
            <div className="flex md:flex-row flex-col md:gap-4 items-center md:w-fit w-full">
                <RotatingFilament />
                <div className="md:w-fit w-full md:text-left text-center">
                    <h1>Filatrack</h1>
                    <Subtext className="md:whitespace-pre-wrap">
                        The simplest filament tracker for 3d printing.{"\n"}
                        No ads, free-forever, open-source, and self-hostable.
                    </Subtext>

                    <div className="flex md:flex-row flex-col gap-2 mt-1 *:w-full *:*:w-full">
                        <Link href="/#About" className="unstyled">
                            <Button look={ButtonStyles.secondary}>Learn More <ArrowRight /></Button>
                        </Link>
                        <Link href="/app" className="unstyled">
                            <Button>Get Started <ArrowRight /></Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <ChevronDown className="mt-[100vh] md:mt-[90vh] bounce w-full text-center" size={48} />

        <div className="absolute top-[150%] md:top-full pb-20">
            <h1 className="w-full text-center" id="About">About Filatrack</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:w-1/2 mx-auto overflow-hidden">
                <LandingCard>
                    <LandingCardHeader>
                        <Code size={32} />
                        <p className="text-md md:text-xl">Open Source</p>
                    </LandingCardHeader>
                    <Subtext>
                        Filatrack is completely free open source software. We are welcome to bug reports and contributions as well!
                        Learn more on the <Link href={endpoints.github}>GitHub</Link>.
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <QrCode size={32} />
                        <p className="text-md md:text-xl">QR Codes</p>
                    </LandingCardHeader>
                    <Subtext>
                        Print out QR codes that point directly to your filament in Filatrack!
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <ScrollText size={32} />
                        <p className="text-md md:text-xl">Log Usage</p>
                    </LandingCardHeader>
                    <Subtext>
                        A core part of Filatrack is logging actual filament usage.
                        Simply type in how much you used and it does all the work for you!
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <CircleDollarSign size={32} />
                        <p className="text-md md:text-xl">Free & ad-free</p>
                    </LandingCardHeader>
                    <Subtext>
                        We are committed to being <b>completely free to use and ad-free forever</b>. No rugpulls here.
                        We rely on community donations to keep running.
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <Smartphone size={32} />
                        <p className="text-md md:text-xl">Mobile Support</p>
                    </LandingCardHeader>
                    <Subtext>
                        You can add Filatrack as an app on your phone to quickly check filament.
                        Go to 'Share' &gt; 'Add to home screen'. (or just use the website on your phone)
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <GlobeLock size={32} />
                        <p className="text-md md:text-xl">Complete Privacy</p>
                    </LandingCardHeader>
                    <Subtext>
                        Your data is never shared or sold to any third parties. We only collect anonymous, toggleable analytics
                        that never link back to you or your data. See our{" "}
                        <Link href="/about/privacy-policy">Privacy Policy</Link> for more information.
                    </Subtext>
                </LandingCard>
            </div>

            <Divider className="my-4" />

            <img src="/app_example.png" className="md:w-1/2 mx-auto border-2 border-primary rounded-lg" />

            <Divider className="my-4" />

            <h3 className="w-full text-center">
                Want to learn more? Join the <Link href={endpoints.discord} className="style">Discord server</Link>!
            </h3>
        </div>
    </>);
}
