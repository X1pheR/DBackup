import { afterAll, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { SMBAdapter } from "@/lib/adapters/storage/smb";

// Only against a disposable, isolated Samba share. Never a production share.
const address = process.env.DBACKUP_TEST_SMB_ADDRESS;
// Explicit ephemeral Docker test hostname and share guard: a production SMB share must never match.
const isIsolatedFixture = !!address && /^\/\/dbackup-db-p04-samba-[a-z0-9-]+\/Shared$/.test(address);
const config = {
    address: address ?? "",
    username: process.env.DBACKUP_TEST_SMB_USER ?? "samba",
    password: process.env.DBACKUP_TEST_SMB_PASS,
    maxProtocol: "SMB3",
    pathPrefix: "dbp04-acceptance",
};

describe.skipIf(!isIsolatedFixture)("SMB inaccessible subtree: upstream-tolerant listing", () => {
    let tempDir = "";
    afterAll(async () => {
        if (tempDir) await rm(tempDir, { recursive: true, force: true });
    });

    it("enumerates healthy siblings without exposing an inaccessible subtree", async () => {
        const files = await SMBAdapter.list(config);
        expect(files.map((entry) => entry.path).sort()).toEqual(["healthy/keep.sql", "root.sql"]);
        expect(files.every((entry) => entry.size > 0)).toBe(true);
    });

    it("fails on a missing root share rather than returning an empty inventory", async () => {
        const bad = { ...config, address: address!.replace(/\/[^/]+$/, "/missing-db-p04-share") };
        expect(bad.address).not.toBe(address);
        await expect(SMBAdapter.list(bad)).rejects.toThrow();
    });

    it("downloads the healthy sibling without touching the inaccessible subtree", async () => {
        tempDir ||= await mkdtemp(path.join(os.tmpdir(), "dbackup-db-p04-"));
        const dest = path.join(tempDir, "recovered.sql");
        expect(await SMBAdapter.download(config, "healthy/keep.sql", dest)).toBe(true);
        expect(await readFile(dest, "utf8")).toBe("healthy-source\n");
    });

    it("uploads and restores identical synthetic archive bytes", async () => {
        tempDir ||= await mkdtemp(path.join(os.tmpdir(), "dbackup-db-p04-"));
        const source = path.join(tempDir, "source.tar");
        const dest = path.join(tempDir, "restored.tar");
        const bytes = Buffer.from("synthetic-backup-payload-db-p04\n");
        await writeFile(source, bytes);
        expect(await SMBAdapter.upload(config, source, "restore/roundtrip.tar")).toBe(true);
        try {
            expect(await SMBAdapter.download(config, "restore/roundtrip.tar", dest)).toBe(true);
            expect(await readFile(dest)).toEqual(bytes);
        } finally {
            expect(await SMBAdapter.delete(config, "restore/roundtrip.tar")).toBe(true);
        }
    });
});
