import Button, { ButtonStyles } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Subtext from "@/components/base/Subtext";
import CardDetail from "@/components/util/CardDetail";
import { ArrowLeft, Calendar, DollarSign, ExternalLink, Gift, Heart } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
    return (
        <div className="absolute-center rounded-lg bg-bg-light p-4 border-2 border-primary">
            <Link href="/app" className="flex gap-1 items-center"><ArrowLeft /> Back</Link>
            <h2 className="flex gap-1 items-center"><Heart size={32} /> Support Filatrack's Development</h2>

            <Subtext>We can always use your help with the costs required to make and host Filatrack.</Subtext>
            <Subtext>If Filatrack has helped you and you enjoy using it, please consider donating.</Subtext>
            <Subtext>Filatrack does not make any money. This is the only way we receive any form of payment.</Subtext>
            <Subtext>There are two options for supporting us. Both are equally helpful, and you'll get benefits too!</Subtext>
            <Divider />

            <div className="flex gap-2">
                <Link className={`rounded-lg bg-bg-lighter p-2 w-full cursor-pointer border-2 border-transparent hover:border-primary
                transition-all unstyled`} href="https://github.com/sponsors/mrdiamonddog" target="_blank">
                    <h3>GitHub Sponsors</h3>

                    <Subtext>
                        Continuous support that pays for hosting costs, as well as directly supporting my other projects.
                    </Subtext>

                    <div className="flex gap-1 flex-col mt-1">
                        <CardDetail icon={<Calendar />}>Monthly or One-time</CardDetail>
                        <CardDetail icon={<Gift />}>More Benefits</CardDetail>
                        <CardDetail icon={<DollarSign />}>$2-10</CardDetail>
                    </div>
                </Link>
                <Link className={`rounded-lg bg-bg-lighter p-2 w-full cursor-pointer border-2 border-transparent hover:border-primary
                transition-all unstyled`} href="https://buymeacoffee.com/zoy33nftqp" target="_blank">
                    <h3>Buy Me a Coffee</h3>

                    <Subtext>A couple of coffees covers the cost for Filatrack's domain for a year, and some hosting costs.</Subtext>

                    <div className="flex gap-1 flex-col mt-1">
                        <CardDetail icon={<Calendar />}>One-time</CardDetail>
                        <CardDetail icon={<Gift />}>Less Benefits</CardDetail>
                        <CardDetail icon={<DollarSign />}>$5-10</CardDetail>
                    </div>
                </Link>
            </div>
            <Divider />

            <Subtext>If you choose to donate, please DM me on Discord (@mrdiamonddog) to claim your benefits!</Subtext>
            <Link href="/discord" target="_blank" className="w-full unstyled">
                <Button className="w-full flex gap-1 items-center" look={ButtonStyles.secondary}>
                    Discord <ExternalLink />
                </Button>
            </Link>
        </div>
    );
}
