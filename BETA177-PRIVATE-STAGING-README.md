# SHWM Content Engine beta.177 — PRIVATE GHCR STAGING TEST

**Status: image and digest verified in owner-provided Google Cloud Build logs (2026-10-18); NOT installed or functionally tested in Home Assistant.** No production upgrade, no public Facebook posts.

- Source SHA: `281f47c5bc9499801ad96170b14cf1b57a4ad08b`
- Google CI: `2ccc3b09-27f9-48bd-9694-9fc0fa4ed726` (SUCCESS)
- Staging release: `6b4363ff-76ac-4852-be8c-ade87e350c0c` (owner reports build success; log step #9 confirms privacy and digest)
- Image: `ghcr.io/smarthomewithme/shwm-content-engine-beta177-staging:0.4.2-beta.177`
- Digest: `sha256:a44b522ff2c8ae9d7db0231010ef21fe84fa763d7dbee67b548d0ce4826d07c1`
- Log confirmations: `GHCR_STAGING_PRIVATE_VERIFIED`, `SHWM_BETA177_GHCR_DIGEST=...`

## Test environment only

This branch's `shwm_content_engine/config.yaml` references the **private** staging image via `image` (without a tag, as required by Supervisor) and `version: "0.4.2-beta.177"`. It retains `boot: manual` and `groups_wp_bridge_enabled: false`. The existing manifest `main` is unchanged.

**Use an isolated/non-production HA instance, not the running beta.176 production instance.** Same on-disk add-on slug `shwm_content_engine`; separate Git branch repo IDs do not by themselves prove safe shared runtime state or prevent erroneous owner configuration. Back up before testing.

1. On isolated HA Supervisor enable Advanced Mode, then `Settings → Apps → Install app → ⋮ → Registries`; add registry `ghcr.io`, GitHub username and a package read credential with access to the private image. **Never paste secrets in issues/chat/repo.** You may need a classic PAT with `read:packages` for private GHCR.
2. Add test repo `https://github.com/smarthomewithme/shwm-ha-apps#beta177-private-staging` (short branch alias created for easier HA install; test branch source `test/beta177-private-staging`). Use `Settings → Apps → Install app → ⋮ → Repositories`.
3. Inspect displayed version `0.4.2-beta.177`, selected image and architecture `amd64`. **Only install on isolated HA and only when ready**. Keep worker PAUSED, no Facebook actions and no unsanctioned WordPress writes.
4. Test Gemini Polish master and 3 FR candidates for WP article #260 in preview, separate owner copy/schedule consent, signed WP→HA ACK and reload/restart persistence. Never authorize execution/public posting as a side effect of copy/schedule testing.

Public/production `main` and production HA remain unchanged; stage requires HA credentials to pull from private GHCR.

## Checks and rollback

If image pull reports 401/403, check the Supervisor `ghcr.io` registry credential and its `read:packages` authorization — do not make the package public. If version/labels mismatch, halt install; compare image digest with the pinned value above. On any functional issue, stop the isolated test app and preserve SQLite/logs before modifications. No automatic rollback to beta.176 is configured.
