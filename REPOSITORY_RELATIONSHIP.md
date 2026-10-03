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

1. Build and test the release in private `smarthomewithme/shwm-content-engine`.
2. Publish the matching versioned image to GHCR.
3. Update `shwm_content_engine/config.yaml` in this repository to the same version.
4. Home Assistant Supervisor refreshes this repository and exposes the update.

## Diagnostic reminder

The custom Home Assistant repository URL must be:

`https://github.com/smarthomewithme/shwm-ha-apps`

Do not point Supervisor at the private source repository.
