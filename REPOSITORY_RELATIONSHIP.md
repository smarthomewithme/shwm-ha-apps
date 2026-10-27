# SHWM Home Assistant release boundary

- `smarthomewithme/shwm-ha-apps` (public): Home Assistant app metadata only.
- `smarthomewithme/shwm-content-engine` (private): application source and release builds.
- `ghcr.io/smarthomewithme/shwm-content-engine:<version>` (private): versioned runtime image.

Release metadata in `shwm_content_engine/config.yaml` is updated only after the exact versioned GHCR release passes validation and its remote digest is verified. The active release process uses owner-approved Google Cloud Build. Never infer that an image is installed simply because the manifest is updated.

`main` is the canonical public metadata branch. The existing `beta177-private-staging` branch remains a fast-forwarded compatibility pointer for installations already subscribed to that URL. Do not change their source URL or app slug as part of a routine version bump.
