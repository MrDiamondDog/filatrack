"use client";

import { PieChart, PieValueType, useDrawingArea } from "@mui/x-charts";
import Tablist from "../base/tabs/Tablist";
import { grams } from "@/lib/units";
import { useEffect, useState } from "react";

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

export default function FilamentChart() {
    const [allFilament, setAllFilament] = useState([
        { color: "#fff", currentMass: 1000, startingMass: 2000, brand: "Elegoo", material: "PLA" },
    ]);
    const [chartMode, setChartMode] = useState("Color");
    const [chartData, setChartData] = useState<PieValueType[]>([]);

    useEffect(() => {
        if (!allFilament)
            return;

        if (chartMode === "Color") {
            const colors: Record<string, number> = {};

            allFilament.forEach(f => colors[f.color] = colors[f.color] ?
                colors[f.color] + f.currentMass :
                f.currentMass);

            setChartData(Object.keys(colors).map(k => ({
                value: colors[k],
                color: k,
                label: k || "[unset]",
            })));
        } else if (chartMode === "Brand") {
            const brands: Record<string, number> = {};

            allFilament.forEach(f => brands[f.brand] = brands[f.brand] ?
                brands[f.brand] + f.currentMass :
                f.currentMass);

            setChartData(Object.keys(brands).map(k => ({
                value: brands[k],
                label: k || "[unset]",
            })));
        } else if (chartMode === "Material") {
            const materials: Record<string, number> = {};

            allFilament.forEach(f => materials[f.material] = materials[f.material] ?
                materials[f.material] + f.currentMass :
                f.currentMass);

            setChartData(Object.keys(materials).map(k => ({
                value: materials[k],
                label: k || "[unset]",
            })));
        }
    }, [chartMode, allFilament]);

    return <div>
        <div className="w-full flex justify-center mb-2">
            <Tablist
                tabs={{ color: "Color", brand: "Brand", material: "Material" }}
                activeTab="color"
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
                arcLabel: chartMode !== "Color" ? "label" : undefined,
                highlightScope: { fade: "global", highlight: "item" },
                valueFormatter: v => grams(v.value),
                data: chartData,
            }]}
            height={200}
            hideLegend
            className="[&_path]:stroke-bg-light! [&_text]:fill-white! [&_text]:text-shadow-md [&_text]:text-shadow-black"
        >
            <PieCenterLabel>
                {grams(allFilament.map(f => f.currentMass).reduce((prev, curr) => prev + curr))}{"\n"}/
                {grams(allFilament.map(f => f.startingMass).reduce((prev, curr) => prev + curr))}
            </PieCenterLabel>
        </PieChart>
    </div>;
}
