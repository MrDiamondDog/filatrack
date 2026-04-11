import { QRDisplayField } from "@/components/modals/PrintFilamentQRModal";

export type QRSettings = {
    fields: Omit<QRDisplayField, "render">[];
    format: "PNG" | "SVG";
}
