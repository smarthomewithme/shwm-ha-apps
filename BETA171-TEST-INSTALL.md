# SHWM Content Engine beta.171 — isolated test channel

This branch is based on the historical **verified beta.171 Home Assistant distribution commit**
`47d50d8298090d2340ff0520879de6e764d1448b` (2026-10-14).

The production Home Assistant repository (`main`) is **not changed**.

## Install in Home Assistant

1. Create a full backup of the current SHWM Content Engine app and its data.
2. In **Settings → Apps → Install app → ⋮ → Repositories**, add this exact repository URL:

   ```text
   https://github.com/smarthomewithme/shwm-ha-apps#test/beta171-groups
   ```
3. Refresh/reload the app store and locate **SHWM Content Engine beta.171 — TEST**.
4. Before starting, confirm the version is **0.4.2-beta.171** and its boot setting is **manual**.
5. Avoid running beta.171 and your regular SHWM browser sessions at the same time. Do not re-use the production /data database or browser profile. Only perform nonpublishing group checks.

The branch-specific repository URL gets its own Supervisor repository ID, so this is a separate app with isolated app data, even though the manifest's app slug remains `shwm_content_engine`.

## Important limits

- This branch **only points** to the historical GHCR image tag `0.4.2-beta.171`; it does **not** build, publish or recreate that container.
- The image was recorded as GHCR-verified when beta.171 was published on 2026-10-14. **Current remote GHCR availability and installation have not been verified**.
- A fresh isolated install does not automatically contain your 18 group records or Facebook login cookies.
- The older app should not be used for production publication. Compare only the timings and observable nonpublishing behavior.

## Historical source

https://github.com/smarthomewithme/shwm-ha-apps/commit/47d50d8298090d2340ff0520879de6e764d1448b
