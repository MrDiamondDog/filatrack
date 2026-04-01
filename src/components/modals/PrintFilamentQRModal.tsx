import { FilamentRecord } from "@/types/pb";
import Modal, { ModalHeader, ModalProps } from "../base/Modal";
import { QRData } from "@/app/api/qr/route";
import { celcius } from "@/lib/util/units";

export default function PrintFilamentQRModal({ filament, ...props }: { filament: FilamentRecord } & ModalProps) {
    const data = {
        id: filament.id,
        title: filament.name,
        material: filament.material,
        brand: filament.brand,
        color: filament.color,
        fields: [
            { title: "Nozzle Temperature", data: celcius(filament.nozzleTemperature ?? 0) },
        ],
    } as QRData;

    return <Modal {...props} title="Print QR Code">
        <ModalHeader>Print a QR code to quickly access filament.</ModalHeader>

        <img src={`/api/qr?data=${btoa(JSON.stringify(data))}`} />
    </Modal>;
}
