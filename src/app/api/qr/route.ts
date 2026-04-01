import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import QRCode from "qrcode";

const width = 750;
const height = 500;

type QRDataField = { title: string, data: string };

export type QRData = {
    id: string;
    title: string;
    material: string;
    color: string;
    brand?: string;
    fields: QRDataField[];
}

export async function GET(req: NextRequest) {
    if (!req.nextUrl.searchParams)
        return NextResponse.json({ error: "Fill out all required fields." }, { status: 400 });

    const dataParam = req.nextUrl.searchParams.get("data");

    if (!dataParam)
        return NextResponse.json({ error: "Fill out all required fields." }, { status: 400 });

    const data = JSON.parse(atob(dataParam)) as QRData;

    if (!data.title || !data.id || !data.fields || !data.material || !data.color)
        return NextResponse.json({ error: "Fill out all required fields." }, { status: 400 });

    const canvas = createCanvas(width, height, "svg");
    const ctx = canvas.getContext("2d");

    registerFont("public/fonts/Lexend-VariableFont_wght.ttf", { family: "Lexend" });
    registerFont("public/fonts/Lexend-Bold.ttf", { family: "Lexend-Bold" });

    ctx.fillStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeRect(0, 0, width, height);

    const padding = 25;
    // Padding viewer
    // ctx.lineWidth = padding * 2;
    // ctx.strokeStyle = "#f00";
    // ctx.strokeRect(0, 0, width, height);

    // Title
    ctx.fillStyle = "#000";
    ctx.font = "100px Lexend";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    const titleWidth = ctx.measureText(data.title).width;

    ctx.fillRect(padding, padding, titleWidth + 30, 105);
    ctx.fillStyle = "#fff";
    ctx.fillText(data.title, padding + 10, padding - 10);

    // Color swatch
    const swatchSize = 100;
    const swatchBorder = 10;

    ctx.fillStyle = data.color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = swatchBorder;

    ctx.beginPath();
    ctx.roundRect(
        width - padding - swatchSize,
        padding + swatchBorder,
        swatchSize - swatchBorder,
        swatchSize - swatchBorder,
        8
    );
    ctx.stroke();
    ctx.fill();

    // Brand + Material
    const brandTopOffset = 100;

    ctx.fillStyle = "#000";
    ctx.font = "50px Lexend";

    ctx.fillText(`${data.brand ? `${data.brand} ` : ""}${data.material}`, padding, padding + brandTopOffset);

    // Details
    const detailsTopOffset = brandTopOffset + 60;
    const detailsGap = 35;

    ctx.font = "30px Lexend";

    let i = 0;
    for (const field of data.fields) {
        ctx.fillText(`${field.title}: ${field.data}`, padding, padding + detailsTopOffset + detailsGap * i);
        i++;
    }

    // Logo
    const logoSize = 75;

    ctx.fillStyle = "#000";
    ctx.font = "45px Lexend-Bold";
    ctx.textBaseline = "middle";

    const logo = await loadImage("public/filament-black.png");
    ctx.drawImage(logo, padding, height - padding - logoSize, logoSize, logoSize);
    ctx.fillText("Filatrack", padding + logoSize + 10, height - padding - logoSize / 2);

    // QR Code
    const qrcodeSize = 250;

    const qrcodeCanvas = createCanvas(qrcodeSize, qrcodeSize);
    await QRCode.toCanvas(qrcodeCanvas, `https://filatrack.app/app/filament/${data.id}`, {
        width: qrcodeSize,
        margin: 0,
    });
    ctx.drawImage(qrcodeCanvas, width - padding - qrcodeSize, height - padding - qrcodeSize);

    const buffer = canvas.toBuffer();
    const body = new Uint8Array(buffer);

    return new Response(body, {
        headers: {
            "Content-Type": "image/svg+xml",
        },
    });
}
