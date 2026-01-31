import { MaterialPreset } from "@/types/settings";
import Subtext from "../base/Subtext";
import { celcius } from "@/lib/util/units";

export default function MaterialPresetCard({ preset, editable }: { preset: MaterialPreset, editable?: boolean }) {
    return (<div className={`flex gap-2 items-center w-full ${editable && "bg-bg-light rounded-lg p-2 px-3"}`}>
        <div className="flex gap-2 items-center pt-1 justify-between w-full">
            <p>{preset.material}</p>
            {preset.nozzleTemperature && <Subtext>Nozzle: {celcius(preset.nozzleTemperature)}</Subtext>}
            {preset.bedTemperature && <Subtext>Bed: {celcius(preset.bedTemperature)}</Subtext>}
            {preset.transmissionDistance && <Subtext>TD: {preset.transmissionDistance}</Subtext>}
            {preset.flowRatio && <Subtext>Flow Ratio: {preset.flowRatio}</Subtext>}
        </div>
    </div>);
}
