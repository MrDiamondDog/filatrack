"use client";

import { PieChart, PieValueType, useDrawingArea } from "@mui/x-charts";
import Tablist from "../base/tabs/Tablist";
import { grams } from "@/lib/util/units";
import { useEffect, useState } from "react";
import { FilamentRecord } from "@/types/pb";

function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return <text
        x={left + width / 2}
        y={top + height / 2}
        textAnchor="middle"
        dominantBaseline="ideographic"
        className="text-center whitespace-pre-wrap"
    >
        {children}
    </text>;
}

export default function FilamentChart({ filament }: { filament: FilamentRecord[] }) {
    const [chartMode, setChartMode] = useState("color");
    const [chartData, setChartData] = useState<PieValueType[]>([]);

    useEffect(() => {
        if (!filament)
            return;

        if (chartMode === "color") {
            const colors: Record<string, number> = {};

            filament.forEach(f => (colors[f.color] ? colors[f.color] += f.mass : colors[f.color] = f.mass));

            setChartData(Object.keys(colors).map(k => ({
                value: colors[k],
                color: k,
                label: k || "[unset]",
            })));
        } else if (chartMode === "brand") {
            const brands: Record<string, number> = {};

            filament.forEach(f => (brands[f.brand ?? "N/A"] ? brands[f.brand ?? "N/A"] += f.mass : brands[f.brand ?? "N/A"] = f.mass));

            setChartData(Object.keys(brands).map(k => ({
                value: brands[k],
                label: k || "[unset]",
            })));
        } else if (chartMode === "material") {
            const materials: Record<string, number> = {};

            filament.forEach(f => (materials[f.material] ? materials[f.material] += f.mass : materials[f.material] = f.mass));

            setChartData(Object.keys(materials).map(k => ({
                value: materials[k],
                label: k || "[unset]",
            })));
        }
    }, [chartMode, filament]);

    return <div>
        <div className="w-full flex justify-center mb-2">
            <Tablist
                tabs={{ color: "Color", brand: "Brand", material: "Material" }}
                activeTab={chartMode}
                onTabChange={v => setChartMode(v as typeof chartMode)}
                className="w-fit"
            />
        </div>

        <PieChart
            series={[{
                innerRadius: 60,
                outerRadius: 100,
                paddingAngle: 0,
                cornerRadius: 2,
                arcLabel: chartMode !== "color" ? "label" : undefined,
                highlightScope: { fade: "global", highlight: "item" },
                valueFormatter: v => grams(v.value),
                data: chartData,
            }]}
            height={200}
            hideLegend
            className="[&_path]:stroke-bg-light! [&_text]:fill-white! [&_text]:text-shadow-md [&_text]:text-shadow-black"
        >
            <PieCenterLabel>
                {grams(filament.map(f => f.mass).reduce((prev, curr) => prev + curr, 0))}{"\n"}
                / {grams(filament.map(f => f.initialMass).reduce((prev, curr) => prev + curr, 0))}
            </PieCenterLabel>
        </PieChart>
    </div>;
}
