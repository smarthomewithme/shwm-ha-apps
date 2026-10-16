# SHWM Content Engine beta.172 — historical Facebook Groups test

This branch starts from the authentic Home Assistant beta.172 distribution commit [`a2e2e71b5aa4843117d5387e0d602b4f125b74b8`](https://github.com/smarthomewithme/shwm-ha-apps/commit/a2e2e71b5aa4843117d5387e0d602b4f125b74b8), dated 2026-10-14 and described in repository history as GHCR-verified.

This historical test branch is separate from production `main` (beta.175), beta.169, beta.170 and beta.171 branches.

## Home Assistant installation

1. Stop your other SHWM test and production app instances, and back up the current SHWM app and data.
2. In Home Assistant Settings -> Add-ons / Apps -> App Store -> ⋮ -> Repositories, add:

   ```text
   https://github.com/smarthomewithme/shwm-ha-apps#test/beta172-groups
   ```

3. Refresh the store and install **SHWM Content Engine beta.172 — TEST**, with the version label `0.4.2-beta.172`.
4. Configure WordPress Groups Bridge **locally** if you need to recover the 18-group registry: `groups_wp_bridge_enabled: true`, `groups_wp_bridge_site_url: https://smarthomewithme.com`, and your existing secret `groups_wp_bridge_key`. Do not put this key into chats, files or GitHub.
5. Start manually. Test the same number of groups using read-only `CHECK SELECTED`; record total duration, `FINAL_SESSION` and final `READY / ATTENTION`. No real Facebook publications.

## Safety and limitations

- This branch contains only historical Home Assistant distribution metadata, not a container build. The image is `ghcr.io/smarthomewithme/shwm-content-engine:0.4.2-beta.172`. Current remote GHCR availability and a successful Home Assistant installation have not been verified in this operation.
- Test installs have separate app data. Do not copy the newer SQLite database or Chromium profile backwards into beta.172.
- Do not run multiple browser sessions or Group Bridge writers simultaneously. WordPress policies remain authoritative, including the Home Assistant - France `NO_PROMO` rule.
- Production `main`, GHCR, CI release settings and Facebook publication remain untouched.
