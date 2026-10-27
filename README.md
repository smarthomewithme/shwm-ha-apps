# Smart Home With Me — Home Assistant Apps

Public **Home Assistant distribution metadata only**. The SHWM Content Engine source code and its GHCR runtime image are private.

- Current advertised version: `0.4.2-beta.183` (verified GHCR release, 2026-10-27).
- App manifest: [`shwm_content_engine/config.yaml`](shwm_content_engine/config.yaml).
- Runtime image: `ghcr.io/smarthomewithme/shwm-content-engine:<version>`.

## One release channel, existing installations preserved

`main` is the canonical metadata branch. **Existing installations subscribed to**:

```text
https://github.com/smarthomewithme/shwm-ha-apps#beta177-private-staging
```

must keep that URL until a separate, verified data migration. The historical branch is maintained as a compatibility pointer to the **same commit as `main`**. Changing the repository URL can change the Home Assistant repository/add-on identifier; existing app data does not automatically follow a new slug.

The public manifest can advertise an update even if the private container cannot be downloaded. An anonymous GHCR pull is denied; the Home Assistant Supervisor must have authorized registry access. Do not add tokens to this repository. A version shown in the store is **not proof that the app was installed or updated**.

See [release boundary](REPOSITORY_RELATIONSHIP.md).
