# Smart Home With Me - Home Assistant Apps

Home Assistant app repository for Smart Home With Me.

Website: https://smarthomewithme.com  
Contact: smarthomewithme@gmail.com

## Repository relationship — IMPORTANT

This public repository contains **Home Assistant distribution metadata only**. The application source code is maintained separately in the private repository:

- public HA metadata/distribution: `smarthomewithme/shwm-ha-apps`
- private source/build: `smarthomewithme/shwm-content-engine`
- release image: `ghcr.io/smarthomewithme/shwm-content-engine:<version>`

Home Assistant Supervisor should use this repository as the custom repository. The app manifest is `shwm_content_engine/config.yaml`.

For every release, `version:` in that manifest must match the GHCR image version built by the private `shwm-content-engine` repository. If the image is updated but this manifest is not, Home Assistant will continue to show the old version and no update will appear.

See [`REPOSITORY_RELATIONSHIP.md`](REPOSITORY_RELATIONSHIP.md) before changing release/version metadata.
