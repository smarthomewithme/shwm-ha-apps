# Changelog

## 2.0.0-alpha.4 — MCP Authentication Hotfix (pending release)

- Load the editorial token from Supervisor's restricted options file before the app drops privileges.
- Preserve existing Promotor data and execution locks. This entry describes a candidate; the installable version remains alpha.3 until publication is approved.

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
