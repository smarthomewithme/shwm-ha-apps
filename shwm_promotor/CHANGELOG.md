# Changelog

## 2.0.0-alpha.13 — Assisted Editor & Publisher Recovery

- Add optional assisted preparation of an approved post and photos in Chromium; the owner reviews and clicks Publish. Disabled by default; live editor acceptance and platform authorization remain pending.
- Preserve the direct publisher contract for future authorized transport. Automatic execution remains blocked.
- Record manual attempts and owner-reported outcomes in the existing queue and history; add authorized rescheduling of conflicting future slots.
- Preserve SQLite schema 5, drafts, profile and integrations. Unified Updates verifies the matching Core bundle; restart HA Core manually when prompted.

## 2.0.0-alpha.12 — Native Photo Bridge Verified Azure Host

- Accept the single Azure Blob hostname confirmed by production attachment diagnostics. Existing download safeguards apply.
- Update Core through Unified Updates. Restart Home Assistant Core manually when prompted.

## 2.0.0-alpha.11 — Native Photo Bridge Host Diagnosis

- For an unsupported attachment source, the owner-only diagnostic returns its sanitized hostname. The source stays blocked and the draft stays unchanged.
- Update the Core integration automatically from alpha.10 via Unified Updates. Restart Home Assistant Core manually when prompted.

## 2.0.0-alpha.10 — Native Photo Bridge & Unified Updates

- Add a dedicated ChatGPT attachment tool with a diagnostic mode that does not modify drafts.
- Install the matching HA Core integration once. Future supported alpha releases synchronize verified integration files. Restart HA Core manually to load new files.
- Keep SQLite schema 5, stored drafts, Chromium profile and Deal Hunter configuration. Worker remains paused and execution stays disabled.

## 2.0.0-alpha.9 — Media & Photo Bridge

- Upload and reorder original JPEG, PNG and WebP attachments. Use shared or language-specific photo sets, or import the WordPress featured image.
- Bind ordered photos to editorial approval, manual authorization and publication history. The worker stays paused and automatic execution remains disabled.
- Back up the full app volume before the SQLite 4 to 5 migration. Update the existing Core integration for native MCP files.

## 2.0.0-alpha.8 — Deal Hunter Integration

- Prepare promotions from explicitly approved Deal Hunter offers in the existing editor and schedule.
- Preserve confirmed SKU and price data and the original affiliate link. A missing target market blocks deal targeting.
- The read-only integration requires a separately deployed Deal Hunter contract. The amd64 update keeps existing data and execution locks.

## 2.0.0-alpha.7 — Content & Session Completion

- Optional AI copy generation, local Facebook session diagnostics and publication history.
- Explicit approval for repeat promotions. Existing data and execution locks are preserved.
- The generator uses up to 6,500 characters of cleaned article content.

## 2.0.0-alpha.6 — Scheduling & UX Fix

- Show ten groups per page and hide cancelled promotions by default.
- Select a confirmed Facebook account and enter a local date and time with daylight-saving disambiguation. Schedule suggestions show group names and validation appears beside the form.
- Return article excerpts in the MCP chunk field while preserving version and offset checks.
- In-place amd64 update keeps SQLite schema 4 and existing app data. The worker stays paused and automatic execution remains disabled.

## 2.0.0-alpha.5 — Scheduling, Moderation & History

- Publication calendar, durable scheduling, approval of the exact scope, and manual outcomes with evidence.
- Promotion list improvements and paginated article reads through the existing Home Assistant MCP integration.
- In-place amd64 update. SQLite migrates to schema 4. Current groups, drafts, token and Chromium profile retain their existing storage. Worker stays paused and automatic execution remains disabled.

## 2.0.0-alpha.4 — MCP Authentication Hotfix

- Load the editorial token from Supervisor's restricted options file before the app drops privileges.
- Keep the existing app data, token and Chromium profile. Worker stays paused and publication execution remains disabled.
- Maintenance release for MCP & Multilingual Copy. Scheduling, Moderation & History remains a separate planned stage.

## 2.0.0-alpha.3 — MCP & Multilingual Copy

- Per-group multilingual promotion drafts, a manual editor, and localized article links when available and allowed.
- Editorial review, duplicate protection and revision checks. Approval does not schedule or publish posts.
- Companion integration for the existing Home Assistant MCP. This amd64 update keeps the existing app and data volume and migrates SQLite to schema 3.

## 2.0.0-alpha.2.1 — UX Refinement

- Responsive light and dark interface with a compact WordPress article preview.
- Group filters, selection across filters, and a side editor for the group registry.
- In-place amd64 update for the existing Promotor installation.

## 2.0.0-alpha.2 — Groups & Content

- Facebook group registry and internal SHWM policy, with JSON preview, import and export.
- Read-only WordPress article selection and saved working selections.
- Account confirmation in Diagnostics. The publication history starts empty.

## 2.0.0-alpha.1 — Core Recovery

- First amd64 test release of the standalone Promotor app.
- Admin-only Home Assistant Ingress, Chromium and noVNC, and a persistent browser profile.
- Manual session handling with publication execution disabled.
