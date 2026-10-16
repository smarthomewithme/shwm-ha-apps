# SHWM Content Engine beta.176 — JIT TEST (staged, NOT RELEASED)

This branch is an isolated **Home Assistant add-on manifest ONLY**.
It is intentionally not published as the regular production repository.
Main stays on beta.175 and every historical beta.169–172 test branch is unchanged.

**Do not install yet.** First confirm that the manual, full-validation
GitHub Actions workflow built and pushed an immutable
`ghcr.io/smarthomewithme/shwm-content-engine:0.4.2-beta.176`
image and returned a digest.

Build controller:
https://github.com/smarthomewithme/shwm-content-engine/actions/workflows/shwm-jit-beta176-ghcr.yml
Source draft PR: https://github.com/smarthomewithme/shwm-content-engine/pull/115

When the image is verified, add to HA > Add-ons / Apps > Store > Repositories:

```text
https://github.com/smarthomewithme/shwm-ha-apps#test/beta176-jit
```

Select "SHWM Content Engine beta.176 — JIT TEST" with manual boot. Verify
`0.4.2-beta.176`. Preserve all existing production addon data; DO NOT copy
a newer SQLite database or Chromium session to the isolated test addon.

Operator test:
- Stop all other SHWM add-ons so only one authenticated Chromium session
  and one WordPress Groups Bridge writer are active.
- Manually log into the intended PERSONAL_PROFILE using beta.176 Browser
  Console. Never copy Facebook cookies/secrets into issues or chat.
- Connect the existing WordPress Groups Bridge locally if needed, then
  confirm the saved group destinations without CHECK SELECTED.
- Prepare an inert campaign draft, choose groups, review text and an explicit
  safe schedule; leave worker PAUSED; check that no full-group scan runs.
- Use synthetic/readonly diagnostics to validate skipped groups and wrong
  actors. No actual group post without a separate exact owner approval.
- WP-to-HA signed handoff is a compatibility gap: the installed v3 owner
  manifest still requires a timestamped group capability at review. The
  current beta.176 pilot enables the native HA Campaign Builder only until
  an updated WP plugin + compatible signed protocol is tested.

Do not merge public manifest, switch production alias or write to Facebook.
Known WordPress rule prohibitions and owner consent are preserved.
