# Upstream convergence — DBackup

- **Upstream:** https://github.com/Skyfay/DBackup
- **Maintained downstream:** https://github.com/X1pheR/DBackup
- **Fork baseline:** `v3.4.0`
- **Installed production release:** `v3.4.0-x1pher.10` (do not infer that this source candidate is deployed)
- **Candidate source baseline:** downstream `main` at `90438a74360ff202f91c6ab0a4b8877a5568a488`
- **Review date:** 2026-11-09

## Machine-readable retained patch inventory

This is a **truthful inventory, not an approved release gate**. Every still-retained distinct logical patch is included, even where upstream explicitly declined its design or has not accepted a contribution. A missing upstream PR or accepted divergence ADR is recorded as `null` and is intentionally a **blocking finding**. Do not delete the record or fabricate a link to turn the gate green.

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
| **DB-P03 — retired in local candidate** | Removed downstream-only transfer multiplexing and retry behavior; restored exact upstream SFTP transfer-session pooling while preserving DB-P02 source-tree fix. Original [issue #188](https://github.com/Skyfay/DBackup/issues/188) remains history. | 2026-11-10 local rollback focused regression passed **77/77 SFTP tests + ESLint**. No production promotion yet. This retired patch is no longer a retained source divergence. |
| **DB-P04 — retired in local candidate** | Accepted upstream-intended skip of inaccessible child folders (issue [#181](https://github.com/Skyfay/DBackup/issues/181)); root failures still fatal. Full and incremental archives are kept directly inside one directory per chain. | Proportionate composite verification: real Samba 4/4, SMB unit 33/33, actual retention-runner tests 16/16 including inaccessible-chain deletion guard, chain safety 4/4, full-chain recovery 5/5 and scoped ESLint. Inaccessible folders remain invisible to retention until permissions recover; no production deployment and no claim of a single live end-to-end destructive retention run. |
| DB-P05 | Genuine [issue #182](https://github.com/Skyfay/DBackup/issues/182) / draft [PR #183](https://github.com/Skyfay/DBackup/pull/183) | Keep real Samba parser and browse semantics tested; follow upstream feedback. |
| **DB-P06 — retired in local candidate** | Removed separate manual exact-tag recovery dispatch; GitHub Actions native rerun preserves original GITHUB_SHA/GITHUB_REF (GitHub docs). Existing tag-push preflight still rejects mismatched commit and remains part of temporary downstream release integrity. Original upstream [issue #189](https://github.com/Skyfay/DBackup/issues/189) preserved as history. | No custom rerun helper necessary; existing native rerun is supported for up to 30 days after initial workflow run. No runtime or release activation; verify workflow contract before publication. |
| **DB-P07 — blocked** | Temporary fork packaging and GHCR distribution while unreleased upstream-bound fixes are needed; no standalone permanent fork strategy. | Return generic release mechanics to the existing shared Hypershell release owner and keep only indispensable interim artifact identity; retire the fork distribution once equivalent immutable upstream artifacts pass source/runtime/restore acceptance. Only a genuinely lasting material product deviation would warrant a separate explicit operator decision and exact-scope ADR. Current register exception is **not approved**. |
| DB-P08 | Genuine [issue #206](https://github.com/Skyfay/DBackup/issues/206) / open [PR #208](https://github.com/Skyfay/DBackup/pull/208) | The current fork `main` still has the earlier conservative guard in `f7a67c91`. The reworked upstream PR at `0bf62a167e2448ca7a6e9bc4d60430a80b07a5bd` passed full `pnpm validate`, but is not merged upstream or adopted in fork; perform source/adapter-chain/restore acceptance before activation. |

### DB-P04 isolated acceptance checkpoint — 2026-11-10

A synthetic Samba 4.23.10 share was isolated on an internal Docker network with no published ports, no production mounts and no persistent test data. Running the candidate adapter source via an isolated DBackup Node/SMB-capable image, four actual protocol integration tests passed: inaccessible child subtree omitted while healthy siblings remained visible, missing root share refused, readable file recovered, and synthetic archive bytes round-tripped through upload/download. The denied fixture file remained intact, with no residual uploaded archive. The integration fixture is explicitly limited to the disposable test-server hostname, never a configured production share. Separate standard Node test processes passed **33 SMB unit tests**, **4 incremental-chain retention safety tests** and scoped ESLint. The application-runtime image is suitable for live SMB integration, while unit test mocks require the standard Node test runtime; combined/mismatched runtime failures are not evidence of a functional regression.

**Accepted local-only disposition (2026-11-10):** The scanner intentionally omits inaccessible child folders without an inventory warning. DBackup stores each incremental chain's archives directly within one chain folder, so an unreadable child folder omits that whole chain. The real Samba integration passed 4/4; the actual stepRetention runner regression (16/16 suite) confirmed only listed, complete old chain members are deleted while the unlisted inaccessible chain and the retained current chain are untouched; existing chain-recovery tests passed 5/5 and fail-closed chain checks 4/4. This is **composed targeted acceptance**, not a claim that an entire destructive backup-and-retention workload ran against a Samba share. The limitation is temporary retention undercount while a folder is inaccessible, not permission to delete its hidden contents. DB-P04 is retired only in this local candidate. No GitHub publication, image change, production activation or shortened retention is authorized by this checkpoint.

**Safety boundary:** The downstream release remains blocked until `sdlc-conformance.py --downstream-repo` returns **zero** findings and the fork's canonical CI/release and actual restore acceptance pass. Do **not** promote upstream 4.x automatically; its database migration is a separate operator-approved event. Do not create new fake upstream PRs, disable the checker or switch to a destructive short retention policy merely to clear the existing assurance alert.

The [DBackup Reach Task](https://reach.hypershell.eu/tasks/task-20261108T015057701546Z-df23a707e441) owns current next actions and verification receipts. This document records source provenance, not volatile runtime health.
