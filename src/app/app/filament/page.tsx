import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { randomFilament } from "@/lib/random";

export default function FilamentPage() {
    // TODO: backend
    return <MotionContainer>
        <FilamentList title="Your Filament" filament={[randomFilament(), randomFilament(), randomFilament()]} />
    </MotionContainer>;
}
