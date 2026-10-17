# SHWM Content Engine beta.177 — separate PRIVATE staging (NOT INSTALLABLE YET)

**HOLD — missing verified private GHCR image/digest.**

Source: `smarthomewithme/shwm-content-engine` exact SHA `281f47c5bc9499801ad96170b14cf1b57a4ad08b`. Google CI build #7 `2ccc3b09-27f9-48bd-9694-9fc0fa4ed726` SUCCESS. Release preparation in private source branch `release/beta177-private-staging`.

This branch is separate from public/production main and the existing beta.176 test branch. It deliberately INHERITS beta.176 config until the private beta.177 GHCR package/tag/digest is verified. **DO NOT add/install this HA repo yet.** After confirming a matching immutable `0.4.2-beta.177` image and package visibility, update only this branch's `shwm_content_engine/config.yaml` to beta.177, keep `boot: manual`, bridge disabled, no worker and retain existing password schemas. Private GHCR images may require additional registry authentication.

Use ONLY a separate non-production HA instance: add-on slug `shwm_content_engine` is shared with production. No public production manifest changes, no WP Suite upgrades, no HA install, no merge, no GHCR privacy changes, no Worker enablement, no Facebook post.
