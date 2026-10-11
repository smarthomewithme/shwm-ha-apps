# Repository relationship — SHWM Home Assistant Apps

> **IMPORTANT:** this public repository is the Home Assistant distribution half of SHWM Content Engine.

## Repositories

### `smarthomewithme/shwm-ha-apps` — PUBLIC

This is the **Home Assistant distribution/metadata repository** used by Home Assistant Supervisor.

Supervisor reads:

`shwm_content_engine/config.yaml`

from this repository to determine the available SHWM Content Engine version.

This repository intentionally contains metadata only, not the application source code.

### `smarthomewithme/shwm-content-engine` — PRIVATE

This is the **source/build repository**.

Application source, tests, transforms and release CI live there. The release image is built from that private repository and published to:

`ghcr.io/smarthomewithme/shwm-content-engine:<version>`

## Release invariant

For every Home Assistant release, these three versions must describe the same release:

1. the effective release version built from `smarthomewithme/shwm-content-engine`,
2. the GHCR image tag `ghcr.io/smarthomewithme/shwm-content-engine:<version>`,
3. `version:` in this repository's `shwm_content_engine/config.yaml`.

**If the private repository publishes a new GHCR image but this public manifest is not updated, Home Assistant will continue to report the old version and no update will appear.**

## Correct release flow

1. CircleCI builds and tests the release from the private `smarthomewithme/shwm-content-engine` distribution branch.
2. The successful CircleCI `release-beta` job publishes the versioned GHCR image and validates the image manifest.
3. Only after this verification, update `shwm_content_engine/config.yaml` in this public repository to that same version (currently a separate, deliberate release-metadata change).
4. Home Assistant Supervisor refreshes this repository and exposes the update.

GitHub Actions is **not** the active publishing or version-sync service. The legacy hourly GHCR polling workflow was retired on 2026-10-11 after it repeatedly failed with HTTP 401. Do not turn it back on or advertise a newer version solely to clear a Home Assistant update message.

## Diagnostic reminder

The custom Home Assistant repository URL must be:

`https://github.com/smarthomewithme/shwm-ha-apps`

Do not point Supervisor at the private source repository.
