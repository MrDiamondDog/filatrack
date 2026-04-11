import { TypedPocketBase } from "@/types/pb";
import PocketBase from "pocketbase";
import postgres from "postgres";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const [_, __, ...args] = process.argv;

const pb = new PocketBase(process.env.PB_URL) as TypedPocketBase;
const sql = postgres({ username: "postgres", database: "filatrack-transfer" });

const defaultUserSettings = {
    filamentSort: "name",
    shownFilamentCardKeys: ["storage", "brand", "material", "mass"],
    shownFilamentTableKeys: [
        "storage",
        "color",
        "brand",
        "material",
        "mass",
        "initialMass",
        "nozzleTemperature",
        "bedTemperature",
    ],
    defaultQrSettings: {
        fields: [
            {
                title: "Mass",
            },
            {
                title: "Nozzle Temperature",
            },
            {
                title: "Bed Temperature",
            },
            {
                key: "note",
                title: "Note",
            },
        ],
        format: "SVG",
    },
};

const _consoleLog = console.log;
const _consoleError = console.error;

function log(...log: any[]) {
    fs.appendFileSync("./transfer/log.txt", `${log.map(l => l.toString()).join(" ")}\n`);
    _consoleLog(...log);
}

console.log = log;

function pbError(e: any) {
    throw JSON.stringify(e.response ? { response: e.response, status: e.status, route: e.route } : e);
}

let errorCount = 0;

function logError(...e: any[]) {
    errorCount++;
    fs.appendFileSync("./transfer/log.txt", `[ERROR] ${e.map(l => l.toString()).join(" ")}\n`);
    fs.appendFileSync("./transfer/error.txt", `${e.map(l => l.toString()).join(" ")}\n`);
    _consoleError(...e);
}

console.error = logError;

let usersImported = 0;
let filamentImported = 0;
let printsImported = 0;
let storagesImported = 0;

async function importUser(userId: string) {
    console.log(`${userId} - Importing user`);

    const user = (await sql`select * from "user" where id like ${userId}`)[0];
    const filament = await sql`select * from "filament" where "filament"."userId" like ${userId}`;
    const filamentLogs = await sql`
    select * 
        from "filamentLog" 
    where "filamentLog"."filamentId" 
        in (select id from "filament" where "filament"."userId" like ${userId})
    `;
    const boxes = await sql`select * from "boxes" where "boxes"."userId" like ${userId}`;

    console.log(user.id, "-", user.name, "- filament", filament.length, "- logs", filamentLogs.length, "- boxes", boxes.length);

    if (!filament.length && !filamentLogs.length && !boxes.length) {
        console.log(`${user.id} - Nothing to import, skipping`);
        return;
    }

    await pb.collection("users").create({
        id: userId,
        email: user.email,
        password: "xxxxxxxx",
        passwordConfirm: "xxxxxxxx",
        verified: true,
        avatar: (user.image) ?
            await fetch(user.image).then(res => res.blob())
                .then(res => {
                    if (res.type !== "image/png" && res.type !== "image/jpeg" && res.type !== "image/webp")
                        return undefined;
                    return res;
                })
                .catch(e => {
                    logError(e);
                    return undefined;
                }) : undefined,
        name: user.name,
        legacy: true,
        allowAnalytics: true,
        ...defaultUserSettings,
    })
        .catch(pbError);

    console.log(`${userId} - User created`);
    usersImported++;

    if (boxes.length) {
        const storageBatch = pb.createBatch();
        for (const box of boxes) {
            storageBatch.collection("storage").create({
                id: box.id,
                user: userId,
                name: box.name,
            });
        }
        await storageBatch.send().catch(pbError);
    }

    console.log(`${userId} - Storage batch done`);
    storagesImported += boxes.length;

    if (filament.length) {
        const filamentBatch = pb.createBatch();
        for (const f of filament) {
            if (!f.startingMass)
                f.startingMass = 1000;
            filamentBatch.collection("filament").create({
                id: f.id,
                user: userId,
                shortId: f.shortId,
                name: f.name,
                material: f.material,
                color: f.color,
                brand: f.brand,
                mass: f.currentMass,
                initialMass: f.startingMass,
                nozzleTemperature: f.printingTemperature,
                diameter: f.diameter,
                cost: f.cost,
                storage: f.box,
                note: f.note,
            });
        }
        await filamentBatch.send().catch(pbError);
    }

    console.log(`${userId} - Filament batch done`);
    filamentImported += filament.length;

    if (filament.map(f => f.box).filter(box => !!box).length) {
        const linkFilamentBatch = pb.createBatch();
        for (const f of filament) {
            if (!f.box)
                continue;

            linkFilamentBatch.collection("storage").update(f.box, {
                "filament+": f.id,
            });
        }
        await linkFilamentBatch.send().catch(pbError);
    }

    console.log(`${userId} - Linked filament to storage`);

    if (filamentLogs.length) {
        const printBatch = pb.createBatch();
        for (const log of filamentLogs) {
            printBatch.collection("prints").create({
                id: log.id,
                user: userId,
                filamentRolls: [log.filamentId],
                filamentUsage: { [log.filamentId]: log.filamentUsed },
                totalFilamentUsed: !log.filamentUsed ? 1 : log.filamentUsed,
                totalRollsUsed: 1,
                label: log.note,
            });
        }
        await printBatch.send().catch(pbError);
    }

    console.log(`${userId} - Created prints`);
    printsImported += filamentLogs.length;
}

async function init() {
    fs.appendFileSync("./transfer/log.txt", `------------------------ ${new Date()}\n`);
    fs.appendFileSync("./transfer/error.txt", `------------------------ ${new Date()}\n`);

    console.time("Total Elapsed Time");

    console.log("Logging in");
    await pb.collection("_superusers").authWithPassword(process.env.PB_SUPERUSER_EMAIL!, process.env.PB_SUPERUSER_PASSWORD!);
    console.log("Logged in:", pb.authStore.record?.id);

    pb.autoCancellation(false);

    console.log("Users", (await sql`select count(*)::int from "user"`)[0].count);
    console.log("Filament", (await sql`select count(*)::int from "filament"`)[0].count);
    console.log("Logs", (await sql`select count(*)::int from "filamentLog"`)[0].count);

    const emailArg = args.find(a => a.startsWith("--email="));
    if (emailArg) {
        const user = (await sql`select id from "user" where email like ${emailArg.split("=")[1]}`)[0].id;
        await importUser(user)
            .then(() => console.log(`Successfully imported user ${user}`))
            .catch(console.error);
    } else {
        const users = await sql`select id from "user"`;
        console.log(`Importing ${users.length} users.`);
        for (const user of users) {
            console.log(`Progress: ${usersImported + 1}/${users.length} (${(usersImported + 1) / users.length * 100}%)`);
            console.log(`Errors: ${errorCount}`);
            console.log(`Importing ${user.id}...`);
            await importUser(user.id)
                .then(() => console.log(`Successfully imported user ${user.id}`))
                .catch(console.error);
        }
    }

    console.log(
        `Imported: ${usersImported} users, ${filamentImported} filament, ${printsImported} prints, ${storagesImported} storages.`
    );
    console.timeEnd("Total Elapsed Time");
    console.log(`Succeeded with ${errorCount} errors.`);
}

(async() => {
    await init();
    sql.end();
})();
