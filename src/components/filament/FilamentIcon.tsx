import { FilamentRecord } from "@/types/pb";

export default function FilamentIcon({ size, filament }: { size: number, filament?: FilamentRecord }) {
    const stage = filament ?
        filament.mass <= 0 ? 5 : Math.min(5, Math.max(1, Math.ceil(filament.mass / filament.initialMass * 5))) :
        5;

    return (<div className="relative" style={{ width: size, height: size }}>
        <img src="/filament.svg" width={size} height={size}  className="absolute" />
        {filament && <div
            className="mask-contain"
            style={{
                width: size,
                height: size,
                backgroundColor: filament?.color ?? "#fff",
                maskImage: `url(/filament-color-mask-${stage ?? 5}.svg)`,
            }}
        />}
    </div>
    );
}
