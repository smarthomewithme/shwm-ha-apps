# SHWM Content Engine beta.169 — historical test channel

This branch is based on the authentic 2026-10-13 historical Home Assistant manifest from commit [`70fd9ca61075f870b8e7f4d6d4e09b1ad0158383`](https://github.com/smarthomewithme/shwm-ha-apps/commit/70fd9ca61075f870b8e7f4d6d4e09b1ad0158383) describing `0.4.2-beta.169`, previously recorded as GHCR-verified.

It is a separate Home Assistant test repository and does NOT alter production `main`, beta.170 or beta.171 branches.

## Install

1. Stop other beta.170/beta.171/production SHWM instances. Take a backup first.
2. In Home Assistant Settings -> Add-ons/Apps -> App Store -> ⋮ -> Repositories, add:

   ```
   https://github.com/smarthomewithme/shwm-ha-apps#test/beta169-groups
   ```

3. Refresh the store and install **SHWM Content Engine beta.169 — TEST**. Confirm version `0.4.2-beta.169`.
4. Configure your existing Groups Bridge locally if needed: `groups_wp_bridge_enabled: true`, `groups_wp_bridge_site_url: https://smarthomewithme.com`, and existing `groups_wp_bridge_key` in the app's password field. Do not copy it into GitHub or chat.
5. Start manually. Compare read-only `CHECK SELECTED` on the same group set, logging total time, `FINAL_SESSION` and `ATTENTION` results. **Never publish Facebook posts from the test build.**

## Cautions

- This branch is a **distribution manifest**, not a rebuilt image. It points to `ghcr.io/smarthomewithme/shwm-content-engine:0.4.2-beta.169`. Current GHCR availability is unverified; install success is not guaranteed.
- Keep beta.169's data isolated; never copy a newer version's SQLite database or Chromium profile into this historical version.
- Never run the different SHWM browser instances concurrently; limit shared WordPress group synchronization to a single running instance.
- Facebook group policies on WordPress remain authoritative (including `NO_PROMO` for Home Assistant - France).
- No changes to production, CI release gates, GHCR or Facebook publications.
