# SHWM Content Engine — release boundary

- **Public:** `smarthomewithme/shwm-ha-apps` contains Home Assistant distribution metadata, not the application source.
- **Private:** `smarthomewithme/shwm-content-engine` contains source, tests and release infrastructure.
- **Private:** `ghcr.io/smarthomewithme/shwm-content-engine:<version>` is the versioned image; authorized access is required to pull it.

## Release invariant

Only advertise a new `version:` after an owner-approved Google Cloud Build verifies the exact source revision, successful runtime tests, the immutable versioned GHCR tag and its remote SHA-256 digest. Never move a mutable alias as a shortcut.

Make the manifest update in the public `main` branch, then fast-forward the pre-existing `beta177-private-staging` compatibility branch to the same commit. Verify both manifest contents and branch heads are identical. Do not create a new HA distribution branch per release.

## Home Assistant boundary

An HA instance subscribed to `#beta177-private-staging` must retain that exact repository URL for ordinary updates. Replacing it with `#main` is a separate repository-identity/data migration, not an ordinary version update.

Public metadata does not provide private GHCR authentication. A `401/403` image pull is a stop condition. Do not commit credentials, expose the container publicly, reinstall over stored data or claim that Home Assistant upgraded from a GitHub manifest change alone.

Preserve the /data SQLite database, browser profiles and app options. Keep the worker paused and publication disabled through release acceptance. This repository does not trigger Facebook, WordPress, or Home Assistant runtime changes.
