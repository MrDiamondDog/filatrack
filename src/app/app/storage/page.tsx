import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import StorageList from "@/components/storage/StorageList";
import { randomFilament } from "@/lib/random";

export default function StoragePage() {
    // TODO: backend
    return <MotionContainer>
        <h2>Storage</h2>
        <Divider />
        {/* @ts-ignore temporary */}
        <StorageList storage={[{ id: "0", name: "Storage 1", icon: "", filament: [randomFilament(), randomFilament()] },
        // @ts-ignore temporary
            { id: "0", name: "Storage 1", icon: "", filament: [randomFilament(), randomFilament()] },
        ]} />
    </MotionContainer>;
}
