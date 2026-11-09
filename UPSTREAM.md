# Upstream convergence — DBackup

- **Upstream:** https://github.com/Skyfay/DBackup
- **Maintained downstream:** https://github.com/X1pheR/DBackup
- **Fork baseline:** `v3.4.0`
- **Installed production release:** `v3.4.0-x1pher.10` (do not infer that this source candidate is deployed)
- **Candidate source baseline:** downstream `main` at `90438a74360ff202f91c6ab0a4b8877a5568a488`
- **Review date:** 2026-11-09

## Machine-readable retained patch inventory

This is a **truthful inventory, not an approved release gate**. Every retained distinct logical patch is included, even where upstream explicitly declined its design or has not accepted a contribution. A missing upstream PR or accepted divergence ADR is recorded as `null` and is intentionally a **blocking finding**. Do not delete the record or fabricate a link to turn the gate green.

<!-- SDLC-UPSTREAM-REGISTER:1 -->
```json
{
  "schema_version": 1,
  "upstream": "Skyfay/DBackup",
  "baseline": "v3.4.0",
  "patches": [
    {
      "id": "DB-P01",
      "kind": "upstream",
      "scope": "SMB recursive destination parent creation within the configured root",
      "local_commits": [
        "d4003290"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/184",
      "pr": "https://github.com/Skyfay/DBackup/pull/185",
      "pr_state": "draft"
    },
    {
      "id": "DB-P02",
      "kind": "upstream",
      "scope": "Bounded SFTP source-tree connection reuse, concurrent directory traversal, and failed-client cleanup",
      "local_commits": [
        "8fe545b2"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/186",
      "pr": "https://github.com/Skyfay/DBackup/pull/187",
      "pr_state": "draft"
    },
    {
      "id": "DB-P03",
      "kind": "upstream",
      "scope": "Distinct SFTP transfer-session multiplexing and bounded handshake retries retained in the downstream adapter",
      "local_commits": [
        "8fe545b2",
        "9c086269"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/188",
      "pr": null
    },
    {
      "id": "DB-P04",
      "kind": "upstream",
      "scope": "SMB recursive-listing fail-closed error propagation instead of upstream tolerant child-directory failures",
      "local_commits": [
        "37702a89"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/181",
      "pr": null
    },
    {
      "id": "DB-P05",
      "kind": "upstream",
      "scope": "SMB long filenames, raw directory-list parsing, quoting, directory scope and attribute normalization",
      "local_commits": [
        "e33a0962",
        "5d5098b7",
        "125fe9e1",
        "19f35879",
        "7be5ac69",
        "1eccf083"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/182",
      "pr": "https://github.com/Skyfay/DBackup/pull/183",
      "pr_state": "draft"
    },
    {
      "id": "DB-P06",
      "kind": "upstream",
      "scope": "DBackup-specific exact-tag and exact-commit GitHub release recovery dispatch",
      "local_commits": [
        "f251b8f3",
        "92a4a3b8"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/189",
      "pr": null
    },
    {
      "id": "DB-P07",
      "kind": "divergence",
      "scope": "Fork-specific package version and distribution identity, GHCR targets and release workflow behavior",
      "local_commits": [
        "71016ffd",
        "840e5526",
        "90438a74"
      ],
      "checked_on": "2026-11-09",
      "adr": null,
      "approval_ref": null
    },
    {
      "id": "DB-P08",
      "kind": "upstream",
      "scope": "Incremental chain retention protection against deleting a partial FULL/incremental dependency chain",
      "local_commits": [
        "f7a67c91"
      ],
      "checked_on": "2026-11-09",
      "issue": "https://github.com/Skyfay/DBackup/issues/206",
      "pr": "https://github.com/Skyfay/DBackup/pull/208",
      "pr_state": "open"
    }
  ]
}
```

## Disposition and release acceptance

| Patch | Current source situation | Required exit before downstream release |
| --- | --- | --- |
| DB-P01 | Genuine [issue #184](https://github.com/Skyfay/DBackup/issues/184) / draft [PR #185](https://github.com/Skyfay/DBackup/pull/185), still maintained | Preserve working nested-parent behavior; verify with target SMB servers; track maintainer review. |
| DB-P02 | Genuine [issue #186](https://github.com/Skyfay/DBackup/issues/186) / draft [PR #187](https://github.com/Skyfay/DBackup/pull/187) | Keep source-tree connection semantics distinct from transfer multiplexing; validate server-family constraints. |
| **DB-P03 — blocked** | Transfer multiplexing remains in `sftp.ts`; upstream [issue #188](https://github.com/Skyfay/DBackup/issues/188) requests **no competing PR** | Previously accepted 2026-10-15 direction is return to upstream SFTP pooling **only after** representative transfer, retry, concurrent and failure acceptance. No waiver. |
| **DB-P04 — blocked** | Fork `main` remains strict; this isolated local candidate now returns from inaccessible child scans, while keeping root errors fatal; [issue #181](https://github.com/Skyfay/DBackup/issues/181) closed by design | 33 focused SMB unit tests and scoped lint pass on candidate using reusable dependencies. **Real Samba inaccessible-subtree + backup/retention/restore acceptance still required** before retiring the retained patch ID; document inventory visibility limitations. No waiver. |
| DB-P05 | Genuine [issue #182](https://github.com/Skyfay/DBackup/issues/182) / draft [PR #183](https://github.com/Skyfay/DBackup/pull/183) | Keep real Samba parser and browse semantics tested; follow upstream feedback. |
| **DB-P06 — blocked** | Downstream-only exact-tag recovery workflow remains; upstream [issue #189](https://github.com/Skyfay/DBackup/issues/189) closed by design | Previously accepted 2026-10-15 direction is migrate responsibility to **existing shared release helper**, prove tag+SHA/retry equivalence and remove duplicate workflow implementation. No waiver. |
| **DB-P07 — blocked** | Fork distribution metadata, version and GHCR publication behavior have no upstream issue/PR | Distinguish release identity necessary for maintained fork from redundant app behavior; obtain an exact-scope accepted product divergence ADR with explicit operator approval, or retire the delta. There is **no accepted ADR** yet. |
| DB-P08 | Genuine [issue #206](https://github.com/Skyfay/DBackup/issues/206) / open [PR #208](https://github.com/Skyfay/DBackup/pull/208) | The current fork `main` still has the earlier conservative guard in `f7a67c91`. The reworked upstream PR at `0bf62a167e2448ca7a6e9bc4d60430a80b07a5bd` passed full `pnpm validate`, but is not merged upstream or adopted in fork; perform source/adapter-chain/restore acceptance before activation. |

**Safety boundary:** The downstream release remains blocked until `sdlc-conformance.py --downstream-repo` returns **zero** findings and the fork's canonical CI/release and actual restore acceptance pass. Do **not** promote upstream 4.x automatically; its database migration is a separate operator-approved event. Do not create new fake upstream PRs, disable the checker or switch to a destructive short retention policy merely to clear the existing assurance alert.

The [DBackup Reach Task](https://reach.hypershell.eu/tasks/task-20261108T015057701546Z-df23a707e441) owns current next actions and verification receipts. This document records source provenance, not volatile runtime health.
