"use client";

import Button, { ButtonStyles } from "@/components/Button";
import Divider from "@/components/Divider";
import Input from "@/components/Input";
import Modal, { ModalFooter, ModalProps } from "@/components/Modal";
import Subtext from "@/components/Subtext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { randomFrom, randomInt } from "./random";
import { endpoints, lastPrivacyPolicyUpdate } from "./constants";
import { ExternalLink } from "lucide-react";

type Dialog = {
    toast?: (openModal?: () => void, closeToast?: () => void) => number | string,
    modal?: (props: ModalProps) => React.ReactNode
}

function getSeenDialogs(): string[] {
    return JSON.parse(localStorage.getItem("dialogs") || "[]");
}

function setSeenDialog(dialog: string) {
    if (getSeenDialogs().includes(dialog))
        return;

    localStorage.setItem("dialogs", JSON.stringify([...getSeenDialogs(), dialog]));
}

export const dialogs: Record<string, Dialog> = {
    feedback: {
        toast: (openModal, closeToast) => toast.info("Feedback", {
            description: <div className="flex flex-col gap-2">
                <p>Something bothering you about Filatrack, or want something changed? Help us out!</p>
                <div className="flex flex-row gap-2">
                    <Button onClick={openModal} className="text-xs">Give Feedback</Button>
                    <Button onClick={() => {
                        setSeenDialog("feedback");
                        closeToast?.();
                    }} className="text-xs" look={ButtonStyles.secondary}>
                        Don't Show Again
                    </Button>
                </div>
            </div>,
            duration: 99999,
        }),
        modal: props => <Modal {...props} title="Give Feedback">
            <Subtext>Help us make Filatrack betterer!</Subtext>
            <Divider />
            <form onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);

                // * What are ya doin snoopin for access keys??
                // * Well, you can have this one. It's meant to be public anyway.
                formData.append("access_key", "dd6195d1-0709-4de6-88f7-c8d208e28183");

                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    (e.target as HTMLFormElement).reset();
                    toast.success("Submitted! Thanks for your input!");
                } else {
                    toast.error(`Error while submitting form! ${data.message}`);
                }

                props.onClose();
            }}>
                <Input type="text" name="name" required label="Name" />
                <Input type="email" name="email" required label="Email" />
                <Input multiline name="message" required label="Message" />

                <Button type="submit">Submit Form</Button>
            </form>
        </Modal>,
    },
    support: {
        toast: (_, closeToast) => toast.info("Support", {
            description: <div className="flex flex-col gap-2">
                <p>
                    Filatrack is entirely ad-free and makes no money by itself. It is entirely based on free software and
                    donations. If you would like to help Filatrack keep running, please consider supporting the project!
                </p>
                <div className="flex flex-row gap-2">
                    <a href="https://github.com/sponsors/MrDiamondDog" target="_blank"><Button className="text-xs">Support</Button></a>
                    <Button
                        onClick={() => {
                            setSeenDialog("support");
                            closeToast?.();
                        }}
                        className="text-xs"
                        look={ButtonStyles.secondary}
                    >
                        Don't Show Again
                    </Button>
                </div>
            </div>,
            duration: 99999,
        }),
    },
    supportModal: {
        modal: props => <Modal {...props} title="Help Keep Filatrack Running">
            <Subtext>We need your help.</Subtext>

            <Divider />

            <p>
                Hosting Filatrack isn't free— the domain, hosting services, and database all contribute
                to the costs required to run Filatrack.
            </p>

            <Divider />

            <p>
                Please consider donating either through GitHub sponsors or Buy Me a Coffee. Anything helps, and
                you are not required to donate.
            </p>

            <Subtext>
                P.S.: Some donations have benefits!
            </Subtext>

            <Divider />

            <div className="w-full flex gap-2 justify-center">
                <a href="https://github.com/sponsors/MrDiamondDog" target="_blank">
                    <Button>GitHub Sponsors <ExternalLink /></Button>
                </a>
                <a href="https://buymeacoffee.com/zoy33nftqp" target="_blank">
                    <Button>Buy Me a Coffee <ExternalLink /></Button>
                </a>
            </div>

            <ModalFooter>
                <Button onClick={props.onClose}>Close</Button>
            </ModalFooter>
        </Modal>,
    },
    discord: {
        toast: (_, closeToast) => toast.info("Discord", {
            description: <div className="flex flex-col gap-2">
                <p>
                    Want something added to Filatrack? Comes suggest it in our discord server!
                </p>
                <div className="flex flex-row gap-2">
                    <a href={endpoints.discord} target="_blank"><Button className="text-xs">Join</Button></a>
                    <Button
                        onClick={() => {
                            setSeenDialog("discord");
                            closeToast?.();
                        }}
                        className="text-xs"
                        look={ButtonStyles.secondary}
                    >
                        Don't Show Again
                    </Button>
                </div>
            </div>,
            duration: 99999,
        }),
    },
};

const privacyPolicyUpdateDialog: Dialog = {
    toast: (_, closeToast) => toast.info("Privacy Policy", {
        description: <div className="flex flex-col gap-2">
            <p>
                We have updated our privacy policy.
            </p>
            <div className="flex flex-row gap-2">
                <Button
                    onClick={() => {
                        closeToast?.();
                        window.open(endpoints.privacyPolicy);
                    }}
                    className="text-xs"
                    look={ButtonStyles.primary}
                >
                    Open
                </Button>
            </div>
        </div>,
        duration: 9999999,
    }),
};

export function RandomDialogs() {
    const dialogIds = Object.keys(dialogs);

    const [selectedDialog, setSelectedDialog] = useState(randomFrom(dialogIds.filter(id => !getSeenDialogs().includes(id))));
    const [modalOpen, setModalOpen] = useState(false);
    const [toastId, setToastId] = useState<number | string>();

    useEffect(() => {
        (async() => {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const lastSeenPrivacyPolicy = getSeenDialogs().find(d => d.startsWith("privacy-policy:"));

            if (!lastSeenPrivacyPolicy) {
                setToastId(privacyPolicyUpdateDialog.toast!(undefined, () => toast.dismiss(toastId)));
                setSeenDialog(`privacy-policy:${new Date()}`);
                return;
            }

            const lastSeenDate = lastSeenPrivacyPolicy.split(":")[1];

            if (new Date(lastSeenDate) < lastPrivacyPolicyUpdate) {
                setToastId(privacyPolicyUpdateDialog.toast!(undefined, () => toast.dismiss(toastId)));
                setSeenDialog(`privacy-policy:${new Date()}`);
                return;
            }

            if (!selectedDialog)
                return;

            if (getSeenDialogs().includes(selectedDialog))
                return;

            if (randomInt(0, 100) < 60)
                return;

            if (dialogs[selectedDialog].toast) {
                setToastId(dialogs[selectedDialog].toast(() => setModalOpen(true), () => toast.dismiss(toastId)));
                return;
            }

            setModalOpen(true);
        })();
    }, [selectedDialog]);

    return selectedDialog && dialogs[selectedDialog].modal?.({
        open: modalOpen,
        onClose: () => {
            setSeenDialog(selectedDialog);
            setModalOpen(false);
            toast.dismiss(toastId);
        },
    });
}
