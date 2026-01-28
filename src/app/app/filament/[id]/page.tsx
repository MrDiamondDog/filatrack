import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Subtext from "@/components/base/Subtext";
import FilamentIcon from "@/components/filament/FilamentIcon";
import PrintList from "@/components/prints/PrintList";
import { randomFilament } from "@/lib/random";
import { celcius, grams } from "@/lib/units";
import { Print } from "@/types/print";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // TODO: backend

    const filament = randomFilament();
    const prints: Print[] = [
        // @ts-ignore temp
        { name: "a Test Print", totalFilament: 124, totalRolls: 2, created: new Date() },
        // @ts-ignore temp
        { name: "z Test Print 2", totalFilament: 2, totalRolls: 1, created: new Date(Date.now() - 998 * 60 * 24) },
    ];

    return <MotionContainer>
        <Link href="/app/filament" className="flex items-center gap-1"><ArrowLeft /> Back</Link>
        <Divider />

        <div className="flex gap-2 items-center mt-1">
            <FilamentIcon filament={filament} size={48} />
            <h2>{filament.name}</h2>
        </div>

        {filament.note && <p>{filament.note}</p>}

        <Divider />

        <div className="flex gap-1">
            <div className="text-center"><Subtext>Material</Subtext> {filament.material}</div>
            <Divider vertical />
            {filament.brand && <>
                <div className="text-center"><Subtext>Brand</Subtext> {filament.brand}</div>
                <Divider vertical />
            </>}
            <div className="text-center">
                <Subtext>Mass</Subtext>
                {grams(filament.mass)}/{grams(filament.initialMass)}
            </div>
            <Divider vertical />
            {filament.temperature && <>
                <div className="text-center"><Subtext>Print Temperature</Subtext> {celcius(filament.temperature)}</div>
                <Divider vertical />
            </>}
            {filament.diameter && <>
                <div className="text-center"><Subtext>Diameter</Subtext> {filament.diameter}mm</div>
                <Divider vertical />
            </>}
            <div className="text-center"><Subtext>Total Prints</Subtext> {prints.length}</div>
            <Divider vertical />
        </div>
        <Divider />

        <h3>Prints With This Filament</h3>
        <Divider />

        <PrintList prints={prints} />
    </MotionContainer>;
}
