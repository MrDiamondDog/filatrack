import PopoverColorPicker from "../base/ColorPicker";

export const filamentColors = [
    "#000000", // black
    "#ffffff", // white
    "#ff0000", // red
    "#ffa500", // orange
    "#ffff00", // yellow
    "#00ff00", // lime
    "#008000", // green
    "#0000ff", // dark blue
    "#00bfff", // cyan
    "#00ffff", // light blue
    "#8000ff", // purple
    "#ff00ff", // pink
];

export default function FilamentColorPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    return (<>
        <div className="flex flex-row flex-wrap gap-1 my-2 justify-center">
            {filamentColors.map(f => <ColorEntry key={f} selected={value === f} onClick={() => onChange(f)} color={f} />)}
        </div>

        <PopoverColorPicker color={value} onChange={onChange} />
    </>);
}

export function ColorEntry({ color, selected, onClick }:
    { selected?: boolean, onClick?: () => void, color: string }) {
    return (
        <div className={`rounded-full bg-bg-lighter px-0.5 py-0.5 text-center cursor-pointer transition-all
            border-2 border-transparent hover:border-primary ${selected && "border-primary!"} select-none min-w-7.5 min-h-7.5`}
        onClick={onClick}
        >
            <div className="rounded-full w-full h-full" style={{ backgroundColor: color }} />
        </div>
    );
}
