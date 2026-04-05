import { FilamentRecord } from "@/types/pb";

export default function FilamentIcon({ size, filament, color }: { size: number, color?: string, filament?: FilamentRecord }) {
    // The ceiling of the percent mass remaining times 5 limited to [1, 5]
    // If no filament or no mass: 5
    const stage = filament ?
        ((filament.mass ?? 0) <= 0 ? 5 : Math.min(5, Math.max(1, Math.ceil((filament.mass ?? 0) / filament.initialMass * 5)))) : 5;

    return (<div className="relative" style={{ width: size, height: size }}>
        <img src="/filament.svg" width={size} height={size}  className="absolute" />
        {(filament || color) && <div
            className="mask-contain"
            style={{
                width: size,
                height: size,
                backgroundColor: filament?.color ?? color ?? "#fff",
                maskImage: `url(/filament-color-mask-${stage ?? 5}.svg)`,
            }}
        />}
    </div>
    );
}
