import { FilamentRecord } from "@/types/pb";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { QRData } from "@/app/api/qr/route";
import Divider from "../base/Divider";
import { useObjectState } from "@/lib/util/hooks";
import { Select } from "../base/Select";
import { celcius, grams } from "@/lib/util/units";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { deleteFromArray } from "@/lib/util/array";
import { useEffect, useState } from "react";
import Button from "../base/Button";

type QRDisplayField = { title: string, render?: (f: FilamentRecord) => string, key?: keyof FilamentRecord };

const displayableFields = {
    color: { title: "Color", key: "color" },
    initialMass: { title: "Initial Mass", render: f => grams(f.initialMass) },
    note: { title: "Note", key: "note" },
    nozzleTemperature: { title: "Nozzle Temperature", render: f => (f.nozzleTemperature ? celcius(f.nozzleTemperature) : "N/A") },
    bedTemperature: { title: "Bed Temperature", render: f => (f.bedTemperature ? celcius(f.bedTemperature) : "N/A") },
    diameter: { title: "Diameter", render: f => (f.diameter ? `${f.diameter}mm` : "N/A") },
    cost: { title: "Cost", render: f => `$${f.cost}` },
    transmissionDistance: { title: "Transmission Distance", render: f => f.transmissionDistance?.toFixed(2) },
    flowRatio: { title: "Flow Ratio", render: f => f.flowRatio?.toFixed(2) },
    spoolType: { title: "Spool Type", key: "spoolType" },
} as Record<keyof FilamentRecord, QRDisplayField>;

function QRDisplayField({ title, onMove, onDelete }: { title: string, onMove: (dir: "up" | "down") => void, onDelete: () => void }) {
    return (<div className="flex items-center justify-between">
        <p>{title}</p>
        <div className="flex gap-1 items-center text-gray-500 *:cursor-pointer">
            <ChevronUp size={20} onClick={() => onMove("up")} />
            <ChevronDown size={20} onClick={() => onMove("down")} />
            <Trash2 size={20} onClick={onDelete} />
        </div>
    </div>);
}

export default function PrintFilamentQRModal({ filament, ...props }: { filament: FilamentRecord } & ModalProps) {
    const [selectedFields, setSelectedFields] = useState<QRDisplayField[]>([]);

    const [qrdata, setQrdata] = useObjectState<QRData>({
        id: filament.id,
        title: filament.name,
        material: filament.material,
        brand: filament.brand,
        color: filament.color,
        format: "SVG",
        fields: [],
    });

    useEffect(() => {
        setQrdata({
            fields: [
                ...selectedFields.map(field => ({
                    title: field.title,
                    data: field?.render?.(filament) ??
                        (field.key && filament[field.key]?.toString()) ??
                        "N/A",
                })),
            ],
        });
    }, [selectedFields]);

    function onFieldMove(dir: "up" | "down", field: QRDisplayField) {
        const index = selectedFields.indexOf(field);

        if (index === -1)
            return;

        if (dir === "up" && index === 0)
            return;

        if (dir === "down" && index === qrdata.fields.length - 1)
            return;

        let newSelectedFields = [...selectedFields];

        if (dir === "up")
            [newSelectedFields[index - 1], newSelectedFields[index]] = [newSelectedFields[index], newSelectedFields[index - 1]];

        if (dir === "down")
            [newSelectedFields[index], newSelectedFields[index + 1]] = [newSelectedFields[index + 1], newSelectedFields[index]];

        setSelectedFields(newSelectedFields);
    }

    const url = `/api/qr?data=${btoa(JSON.stringify(qrdata))}`;

    function printQR() {
        const tab = window.open(url, "mozillaTab");
        if (!tab)
            return;

        tab.focus();
        tab.addEventListener("DOMContentLoaded", print);
    }

    return <Modal {...props} title="Print QR Code">
        <ModalHeader>Print a QR code to quickly access filament.</ModalHeader>

        <img src={url} width={375} height={250} />

        <Divider />

        <p>Fields</p>
        <div className="flex flex-col gap-1 bg-bg-lighter rounded-lg p-2">
            {selectedFields.map((f, i) => <QRDisplayField
                title={f.title}
                key={i}
                onMove={dir => onFieldMove(dir, f)}
                onDelete={() => setSelectedFields(deleteFromArray(selectedFields, f, "title"))}
            />)}
        </div>

        <p>Add Fields</p>
        <Select
            options={{
                ...Object.fromEntries(Object.entries(displayableFields)
                    .filter(v => !selectedFields.find(s => s.title === v[1].title))
                    .map(v => [v[0], v[1].title])),
            }}
            placeholder="Select a field to add"
            value=""
            onChange={v => {
                const field = displayableFields[v as keyof FilamentRecord];
                setSelectedFields([...selectedFields, field]);
            }}
        />

        <Divider />

        <p>Format</p>
        <Select
            options={{
                png: "PNG",
                svg: "SVG",
            }}
            placeholder="SVG"
            value={qrdata.format}
            onChange={f => setQrdata({ format: f as "PNG" | "SVG" })}
        />

        <ModalFooter>
            <Button onClick={printQR}>Print</Button>
        </ModalFooter>
    </Modal>;
}
