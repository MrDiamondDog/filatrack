"use client";

import { pb } from "@/api/pb";
import Button, { ButtonStyles } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Spinner from "@/components/base/Spinner";
import Subtext from "@/components/base/Subtext";
import FilamentIcon from "@/components/filament/FilamentIcon";
import FilamentMiniRow from "@/components/filament/FilamentMiniRow";
import CreateFilamentModal from "@/components/modals/CreateFilamentModal";
import { DeleteModal } from "@/components/modals/DeleteModal";
import PrintFilamentModal from "@/components/modals/PrintFilamentModal";
import PrintFilamentQRModal from "@/components/modals/PrintFilamentQRModal";
import PrintList from "@/components/prints/PrintList";
import { toastError } from "@/lib/util/error";
import { useDevice } from "@/lib/util/hooks";
import { celcius, grams } from "@/lib/util/units";
import { FilamentRecord, PrintsRecord, UsersRecord } from "@/types/pb";
import { ArrowLeft, Pencil, Printer, QrCode, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function FilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");

    const [filamentList, setFilamentList] = useState<FilamentRecord[]>();
    const [filament, setFilament] = useState<FilamentRecord>();
    const [prints, setPrints] = useState<PrintsRecord[]>();

    const [isMobile, _] = useDevice();

    const router = useRouter();

    useEffect(() => {
        params.then(p => {
            pb.collection("filament").getFullList({
                filter: `user.id = "${user.id}"`,
            })
                .then(res => {
                    setFilamentList(res);
                    setFilament(res.find(f => f.id === p.id));
                })
                .catch(e => toastError("Could not fetch filament", e));

            pb.collection("prints").getFullList({
                filter: `user.id = "${user.id}" && filamentRolls ~ "${p.id}"`,
            })
                .then(setPrints)
                .catch(e => toastError("Could not fetch prints", e));
        });
    }, []);

    async function deleteFilament() {
        if (!filament)
            return;

        await pb.collection("filament").delete(filament.id)
            .then(() => router.push("/app/filament"))
            .catch(e => toastError("Could not delete filament", e));
    }

    return <MotionContainer>
        <Suspense fallback={<Spinner />}>
            {filament && <>
                <Link href="/app/filament" className="flex items-center gap-1"><ArrowLeft /> Back</Link>
                <Divider />

                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center mt-1 w-full">
                        <FilamentIcon filament={filament} size={48} />
                        <h2>{filament.name}</h2>
                    </div>

                    <div className="flex md:flex-nowrap flex-wrap justify-end gap-1">
                        <Button onClick={() => setOpenModal("print")} look={ButtonStyles.primary}><Printer /></Button>
                        <Button onClick={() => setOpenModal("qrcode")} look={ButtonStyles.secondary}><QrCode /></Button>
                        <Button onClick={() => setOpenModal("edit")} look={ButtonStyles.secondary}><Pencil /></Button>
                        <Button onClick={() => setOpenModal("delete")} look={ButtonStyles.danger}><Trash2 /></Button>
                    </div>
                </div>

                {filament.note && <p>{filament.note}</p>}

                <Divider />

                <div className="md:flex grid grid-cols-2 gap-1">
                    <div className="text-center"><Subtext>Material</Subtext> {filament.material}</div>

                    {!isMobile && <Divider vertical />}

                    {filament.brand && <>
                        <div className="text-center"><Subtext>Brand</Subtext> {filament.brand}</div>

                        {!isMobile && <Divider vertical />}
                    </>}

                    <div className="text-center">
                        <Subtext>Mass</Subtext>
                        {grams((filament.mass ?? 0))}/{grams(filament.initialMass)}
                    </div>

                    {!isMobile && <Divider vertical />}

                    {!!filament.nozzleTemperature && <>
                        <div className="text-center"><Subtext>Nozzle Temp.</Subtext> {celcius(filament.nozzleTemperature)}</div>

                        {!isMobile && <Divider vertical />}
                    </>}

                    {!!filament.bedTemperature && <>
                        <div className="text-center"><Subtext>Bed Temp.</Subtext> {celcius(filament.bedTemperature)}</div>

                        {!isMobile && <Divider vertical />}
                    </>}

                    {!!filament.diameter && <>
                        <div className="text-center"><Subtext>Diameter</Subtext> {filament.diameter}mm</div>

                        {!isMobile && <Divider vertical />}
                    </>}

                    <div className="text-center"><Subtext>Total Prints</Subtext> {prints?.length}</div>

                    {!isMobile && <Divider vertical />}
                </div>
                <Divider />

                <h3>Prints With This Filament</h3>

                <PrintList prints={prints ?? []} filament={filamentList ?? []} />

                <DeleteModal
                    open={openModal === "delete"}
                    onClose={() => setOpenModal("")}
                    object="Filament"
                    preview={<div className="bg-bg-lighter rounded-lg p-2"><FilamentMiniRow filament={filament} /></div>}
                    onDelete={deleteFilament}
                />

                <CreateFilamentModal
                    open={openModal === "edit"}
                    onClose={() => setOpenModal("")}
                    initial={filament}
                    onCreate={setFilament}
                    storages={[]}
                />

                <PrintFilamentQRModal
                    open={openModal === "qrcode"}
                    onClose={() => setOpenModal("")}
                    filament={[filament]}
                />

                <PrintFilamentModal
                    open={openModal === "print"}
                    onClose={() => setOpenModal("")}
                    filament={filament}
                    onPrintCreate={p => setPrints([...(prints ?? []), p])}
                />
            </>}
        </Suspense>
    </MotionContainer>;
}
