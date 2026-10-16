# SHWM Content Engine beta.176 — JIT TEST (isolated staging only)

This branch is an isolated **Home Assistant add-on manifest ONLY**.
It is intentionally not published as the regular production repository.
Main stays on beta.175 and every historical beta.169–172 test branch is unchanged.

Release acceptance (2026-10-16): the owner confirmed that the separate,
manual-approval Google Cloud Build GHCR release completed successfully.
Its release gates require matching source commit
`fb60c2a14c770372a454b87d0fa76b2ea51dc3da`, the earlier green
7/7 validation build `a2c4827e-ee5e-4535-b15b-b643ac92abbb`,
an immutable push of
`ghcr.io/smarthomewithme/shwm-content-engine:0.4.2-beta.176`,
a fresh pull, and a nonempty SHA-256 digest. The actual release digest
has not been independently copied into this document; confirm it in
the successful release build logs before installation.

Release controller (Google Cloud Build):
https://console.cloud.google.com/cloud-build/builds;region=us-central1?project=shwm-content-engine-ci
Source draft PR (not merged):
https://github.com/smarthomewithme/shwm-content-engine/pull/115

**Use a separate nonproduction HA instance.** The test and production
manifests share the same add-on slug `shwm_content_engine`; do not add
this test branch to the production HA instance or replace its repository.

After checking the release digest, add to the separate staging HA instance via Settings > Apps/Add-ons > Store > Repositories:

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
