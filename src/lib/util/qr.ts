import JSZip from "jszip";

export type ZipFile = {
    name: string;
    url: string;
    fileType: "png" | "svg";
}

export type ZipBlob = ZipFile & { blob: Blob };

export async function getImageBlob(url: string): Promise<Blob> {
    return fetch(url).then(res => res.blob());
}

export async function createZip(files: ZipFile[]): Promise<Blob> {
    const blobFiles: ZipBlob[] = await Promise.all(files.map(
        f => new Promise<ZipBlob>(async resolve => resolve({ ...f, blob: await getImageBlob(f.url) }))
    ));

    const zip = new JSZip();

    let i = 0;
    for (const file of blobFiles) {
        zip.file(`${file.name}-${i}.${file.fileType}`, file.blob);
        i++;
    }

    return zip.generateAsync({ type: "blob", streamFiles: true });
}
