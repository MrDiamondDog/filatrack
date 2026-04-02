import { FilamentRecord, UsersRecord } from "@/types/pb";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { QRData } from "@/app/api/qr/route";
import Divider from "../base/Divider";
import { Select } from "../base/Select";
import { celcius, grams } from "@/lib/util/units";
import { ChevronDown, ChevronUp, ExternalLink, Trash2 } from "lucide-react";
import { deleteFromArray } from "@/lib/util/array";
import { useEffect, useState } from "react";
import Button from "../base/Button";
import Subtext from "../base/Subtext";
import { pb } from "@/api/pb";
import { QRSettings } from "@/types/users";

export type QRDisplayField = { title: string, render?: (f: FilamentRecord) => string, key?: keyof FilamentRecord };

const displayableFields = {
    color: { title: "Color", key: "color" },
    initialMass: { title: "Mass", render: f => grams(f.initialMass) },
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

export function QRFieldSelector({ fields, onListUpdate }: { fields: QRDisplayField[], onListUpdate: (l: QRDisplayField[]) => void }) {
    function onFieldMove(dir: "up" | "down", field: QRDisplayField) {
        const index = fields.indexOf(field);

        if (index === -1)
            return;

        if (dir === "up" && index === 0)
            return;

        if (dir === "down" && index === fields.length - 1)
            return;

        let newSelectedFields = [...fields];

        if (dir === "up")
            [newSelectedFields[index - 1], newSelectedFields[index]] = [newSelectedFields[index], newSelectedFields[index - 1]];

        if (dir === "down")
            [newSelectedFields[index], newSelectedFields[index + 1]] = [newSelectedFields[index + 1], newSelectedFields[index]];

        onListUpdate(newSelectedFields);
    }

    return <>
        <p>Fields</p>
        <div className="flex flex-col gap-1 bg-bg-lighter rounded-lg p-2">
            {fields.map((f, i) => <QRDisplayField
                title={f.title}
                key={i}
                onMove={dir => onFieldMove(dir, f)}
                onDelete={() => onListUpdate(deleteFromArray(fields, f, "title"))}
            />)}
        </div>

        <p>Add Fields</p>
        <Select
            options={{
                ...Object.fromEntries(Object.entries(displayableFields)
                    .filter(v => !fields.find(s => s.title === v[1].title))
                    .map(v => [v[0], v[1].title])),
            }}
            placeholder="Select a field to add"
            value=""
            onChange={v => {
                const field = displayableFields[v as keyof FilamentRecord];
                onListUpdate([...fields, field]);
            }}
        />
    </>;
}

export default function PrintFilamentQRModal({ filament, ...props }: { filament: FilamentRecord[] } & ModalProps) {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return null;

    function getFullDefaultFields() {
        const defaultFields = ((user!.defaultQrSettings as QRSettings)?.fields ?? []) as Omit<QRDisplayField, "render">[];
        const displayFields = Object.values(displayableFields);

        return defaultFields.map(f => ({ ...f, render: displayFields.find(d => d.title === f.title)?.render }));
    }

    const [selectedFields, setSelectedFields] = useState<QRDisplayField[]>(getFullDefaultFields());

    const [format, setFormat] = useState<"SVG" | "PNG">((user.defaultQrSettings as QRSettings)?.format ?? "SVG");

    const [qrdata, setQrdata] = useState<QRData[]>(filament.map(f => ({
        id: f.id,
        title: f.name,
        material: f.material,
        brand: f.brand,
        color: f.color,
        format,
        fields: [],
    } as QRData)));

    useEffect(() => {
        setQrdata(filament.map(f => ({
            id: f.id,
            title: f.name,
            material: f.material,
            brand: f.brand,
            color: f.color,
            format,
            fields: selectedFields.map(v => ({
                title: v.title,
                data: v.render?.(f) ?? (v.key && f[v.key]) ?? "N/A",
            })),
        } as QRData)));
    }, [filament, selectedFields, format]);

    function makeUrl(data: QRData) {
        return `/api/qr?data=${btoa(JSON.stringify(data))}`;
    }

    const url = makeUrl(qrdata[0] ?? {});

    function printQR() {
        const tab = window.open("about:blank", "mozillaTab");
        if (!tab)
            return;

        for (const qrcode of qrdata) {
            const img = document.createElement("img");
            img.src = makeUrl(qrcode);
            img.style = "margin: 2px; max-width: 375px";
            tab.document.body.appendChild(img);
        }

        tab.focus();
        tab.print();
        tab.close();
    }

    return <Modal {...props} title="Print QR Code">
        <ModalHeader>Print a QR code to quickly access filament.</ModalHeader>

        <img src={url} width={375} height={250} />

        {filament.length > 1 && <Subtext>Printing {filament.length} QR codes.</Subtext>}

        <Divider />

        <QRFieldSelector fields={selectedFields} onListUpdate={setSelectedFields} />

        <Divider />

        <p>Format</p>
        <Select
            options={{
                PNG: "PNG",
                SVG: "SVG",
            }}
            placeholder="SVG"
            value={format}
            onChange={f => setFormat(f as "PNG" | "SVG")}
        />

        <ModalFooter>
            <Button onClick={printQR} className="flex gap-1 items-center">Print <ExternalLink /></Button>
        </ModalFooter>
    </Modal>;
}
