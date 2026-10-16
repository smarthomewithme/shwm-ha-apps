# SHWM Content Engine beta.170 — separate historical test

This branch preserves the original Home Assistant metadata from commit
[`6b5e5537739619259edf3826387da6d2bd43f5b7`](https://github.com/smarthomewithme/shwm-ha-apps/commit/6b5e5537739619259edf3826387da6d2bd43f5b7)
(2026-10-14), exposing the historical `0.4.2-beta.170` image for a Facebook Groups check-speed comparison.

The `main` repository, beta.171 test branch and production app are not changed.

## Installation

1. Stop beta.171 TEST (and regular production version if running). Back up the current app and data before any changes.
2. Add the dedicated GitHub repository reference in Home Assistant Add-on/App Store > Repositories:

   ```text
   https://github.com/smarthomewithme/shwm-ha-apps#test/beta170-groups
   ```

3. Refresh the store and choose **SHWM Content Engine beta.170 — TEST**; confirm the version is `0.4.2-beta.170`.
4. Configure the WordPress Groups Bridge only if needed. Use the existing secret locally, **never put it in a Git commit, log, or chat**. The test installation has its own data and does not inherit Facebook cookies from beta.171 or production.
5. Start manually and run read-only CHECK SELECTED on the same set of groups. Note total seconds, FINAL_SESSION seconds and any ATTENTION states. Do not submit/publish posts.

## Limits and safety

- This is a historical **manifest**, not a rebuilt container. The tagged GHCR image is `ghcr.io/smarthomewithme/shwm-content-engine:0.4.2-beta.170`; its current availability/install result is unverified.
- A fresh installation has a separate Home Assistant repository/app data. Do not copy `/data` or Chromium profile from newer releases, and do not run beta.170, beta.171 and production browsers simultaneously.
- Two test installations can compete for WordPress group sync. Keep only one running for each test. WordPress-owned group policies are authoritative, including the NO_PROMO policy for Home Assistant - France.
- No changes to the production `main` branch, no CI/GHCR publishing, no automated Facebook posts.
