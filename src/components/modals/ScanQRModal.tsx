import { useEffect, useRef, useState } from "react";
import Modal, { ModalHeader, ModalProps } from "../base/Modal";
import QrScanner from "qr-scanner";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/constants";
import { analyticsEvent } from "@/lib/analytics";

export default function ScanQRModal(props: ModalProps) {
    const cameraVideo = useRef<HTMLVideoElement | null>(null);

    const [rejected, setRejected] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const [scanner, setScanner] = useState<QrScanner>();

    const router = useRouter();

    useEffect(() => {
        if (!cameraVideo.current)
            return;

        if (!props.open) {
            scanner?.stop();
            setScanner(undefined);
            stream?.getTracks().forEach(t => t.stop());
            setStream(undefined);
            return;
        }

        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
            },
            audio: false,
        })
            .then(stream => {
                setStream(stream);
                cameraVideo.current!.srcObject = stream;

                const scanner = new QrScanner(
                    cameraVideo.current!,
                    res => {
                        if (!res.data.startsWith(`${baseUrl}`))
                            return;

                        analyticsEvent("SCAN_QR", { });

                        props.onClose();
                        router.push(new URL(res.data).pathname);
                        scanner.stop();
                    },
                    {
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        onDecodeError: console.log,
                    }
                );

                setScanner(scanner);

                scanner.start();
            })
            .catch(() => setRejected(true));
    }, [props.open]);

    return (<Modal open={props.open} onClose={props.onClose} title="Scan QR Code">
        <ModalHeader>Scan a Filatrack QR code. Does not work with QR codes produced by other websites.</ModalHeader>

        {!rejected && <>
            <video ref={cameraVideo} autoPlay playsInline className="w-full" />
            <p>Put the QR code in view and you will be redirected to the filament page.</p>
        </>}
        {rejected && <p>You denied access to your camera.</p>}
    </Modal>);
}
