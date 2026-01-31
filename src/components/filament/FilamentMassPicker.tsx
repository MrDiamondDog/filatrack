import { grams } from "@/lib/util/units";
import Input from "../base/Input";

type MassValues = { mass: number, initialMass: number };

function MassPreset({ value, onClick }: { value: number, onClick: (v: number) => void }) {
    return <div className={`bg-bg-lighter rounded-full px-3 py-1 cursor-pointer border-2 border-transparent hover:border-primary
    transition-all md:w-full text-center select-none`} onClick={() => onClick(value)}>
        {grams(value)}
    </div>;
}

const massPresets = [100, 250, 500, 1000, 2000, 5000];

export default function FilamentMassPicker({ values, onChange }:
    { values: MassValues, onChange: (v: MassValues) => void }) {
    return <>
        <div className="flex md:flex-row flex-col gap-2">
            <Input
                label="Filament Mass (g)"
                type="number"
                value={values.mass}
                onChange={e => onChange({ mass: parseInt(e.target.value), initialMass: values.initialMass })}
                required
            />
            <Input
                label="Initial Mass (g)"
                type="number"
                value={values.initialMass}
                onChange={e => onChange({ initialMass: parseInt(e.target.value), mass: values.mass })}
                required
            />
        </div>

        <div className="flex justify-center items-center md:flex-nowrap flex-wrap gap-1 mt-2 w-full">
            {massPresets.map(mass => <MassPreset
                value={mass}
                key={mass}
                onClick={v => onChange({ mass: v, initialMass: v })}
            />)}
        </div>
    </>;
}
