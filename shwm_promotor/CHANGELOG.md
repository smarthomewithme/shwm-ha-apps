# Changelog

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
