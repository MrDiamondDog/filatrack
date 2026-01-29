import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreateButton from "@/components/dashboard/CreateButton";
import FilamentChart from "@/components/dashboard/FilamentChart";
import FilamentList from "@/components/filament/FilamentList";
import StorageList from "@/components/storage/StorageList";
import { randomFilament } from "@/lib/random";

export default function DashboardPage() {
    return (<MotionContainer>
        <div className="flex justify-between items-center">
            <h1>Dashboard</h1>

            <CreateButton />
        </div>

        <Divider />

        <FilamentChart />

        <div className="w-full flex flex-col md:flex-row mt-5">
            <div className="w-full">
                <h2>Storage</h2>
                <Divider />
                <StorageList storage={[
                    // @ts-ignore temporary
                    { id: "0", name: "Storage 1", icon: "", filament: [randomFilament(), randomFilament()] },
                    // @ts-ignore temporary
                    { id: "1", name: "Storage 1", icon: "", filament: [randomFilament(), randomFilament()] },
                ]} />
            </div>

            <Divider vertical />

            <div className="w-full">
                <FilamentList title="Recently Used Filament" filament={[randomFilament(), randomFilament()]} viewLock="cards" />
            </div>
        </div>

        <FilamentList title="All Filament" filament={[randomFilament(), randomFilament(), randomFilament()]} />
    </MotionContainer>);
}
