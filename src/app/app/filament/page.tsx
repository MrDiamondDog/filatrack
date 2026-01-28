import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { randomFilament } from "@/lib/random";
import { redirect } from "next/navigation";

export default async function FilamentPage({
    searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Backwards compatibility with old qr codes
    const qrFilament = (await searchParams).f;

    if (qrFilament)
        return redirect(`/app/filament/${qrFilament}`);

    // TODO: backend
    return <MotionContainer>
        <FilamentList title="Your Filament" filament={[randomFilament(), randomFilament(), randomFilament()]} />
    </MotionContainer>;
}
