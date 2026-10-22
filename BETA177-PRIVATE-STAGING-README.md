# SHWM Content Engine beta.181 — EXISTING PRIVATE GHCR STAGING CHANNEL

**Current state (22.10.2026):** the existing Home Assistant staging repository branch `beta177-private-staging` now advertises **beta.181** in `shwm_content_engine/config.yaml` (commit `b747661f6a57d89a5dc0b25e97620fe4d3a9e3c0`). This is a Git metadata change only. **It has NOT installed, upgraded or started any Home Assistant application**. It does not update production `main`, any WordPress site, Facebook profile/page/group, or publication worker.

## Verified private beta.181 GHCR image

- Source repository: private `smarthomewithme/shwm-content-engine`; source SHA `97b56de2ba478e7bc1c41bca69ec63751d9fbc31` (PR #131).
- Validation Cloud Build: `2d40921e-34d3-4110-9368-842440771684` — **8/8 SUCCESS**.
- One direct GHCR-only Cloud Build: `2afa9ff0-c53a-4c08-a9f1-f088a0aae731` — **12/12 SUCCESS**, created 22.10.2026 08:13:14 UTC. This is the successful release; the failed tag-triggered GitHub Actions run did not run any container build.
- Private image: `ghcr.io/smarthomewithme/shwm-content-engine-beta181-staging:0.4.2-beta.181`.
- Verified immutable digest: `sha256:e80157761436563f4b63622407b1b991ca98d33514f28e18e888d107433c50ab` (from direct Cloud Build step `verify-private-ghcr-digest`).
- Positive markers: `GHCR_BETA181_STAGING_PRIVATE_VERIFIED`, `SHWM_HA_WP_FACEBOOK_UNCHANGED`.
- Existing HA-facing manifest uses `version: "0.4.2-beta.181"` and an `image:` without explicit version tag, as required by the existing Supervisor add-on metadata layout.

## Owner-only isolated Home Assistant acceptance

1. **Use only the pre-existing isolated/test HA**, not production. Back up app options, database, browser identity profile, persistent storage and relevant secrets, but never commit or paste their values in GitHub.
2. Keep the pre-existing repository URL `https://github.com/smarthomewithme/shwm-ha-apps#beta177-private-staging`. Do not add a duplicate repository, change app `slug`, install production branch or touch `main`.
3. Refresh the Apps/add-on store metadata in the isolated HA; confirm **beta.181** and image `ghcr.io/smarthomewithme/shwm-content-engine-beta181-staging`. If the version does not appear, STOP rather than recreating or reinstalling.
4. Authenticate the **private** GHCR package only in the isolated HA if required. If a pull returns 401/403, STOP; do not make the package public, upload a registry credential to GitHub, or switch to a nonstaging package.
5. Independently verify pulled digest against the above immutable `sha256:` before starting the app. A manifest update is not a digest attestation.
6. If explicitly upgrading the isolated app, preserve persistent data and confirm `boot: manual`, no automatic publication, PAUSED worker and staging-only ingress; do not execute real Facebook/WordPress posts. The previous beta.180 package remains available for a deliberately reviewed rollback, subject to SQLite migration compatibility.

**Do not** rebuild GHCR, rerun Google build `2afa9ff0-c53a-4c08-a9f1-f088a0aae731`, delete the one-shot local release lock, or rerun tag `shwm-beta181-private-ghcr-approve-20261022`. This release has already succeeded. A separate owner-controlled HA upgrade is the only remaining deployment step.

---

## Historical staging notes (beta.178 snapshot; not current install instructions)

# SHWM Content Engine beta.178 — PRIVATE GHCR STAGING TEST

**The existing beta.177 HA test channel has been upgraded in GitHub metadata to beta.178 (18.10.2026).** The HA-visible short Git branch name `beta177-private-staging` is kept **deliberately**: do not create a new test branch, URL fragment, HA repository, app slug or Supervisor entry. **This does not prove an installation in Home Assistant**. Production `main` remains unchanged, and nothing has been published to Facebook.

## Verified beta.178 release

- Source PR/branch: private `smarthomewithme/shwm-content-engine`, existing PR #122, `feature/promotor-beta177-integrated`.
- Source revision: `68aefcf52766c1923406a089fda5688f79d960a4`.
- Google CI: `c9b8f0f3-5f7e-4733-91e9-c82d30958026` (**7/7 SUCCESS**).
- Manually approved Google private GHCR release: `838069f2-0e15-43f5-b469-c8a1d2b85d73` (**10/10 SUCCESS**).
- Private GHCR image: `ghcr.io/smarthomewithme/shwm-content-engine-beta178-staging:0.4.2-beta.178`.
- Immutable verified digest: `sha256:34668367865f43f77ad7d645b557a6a6cfa30cbe605a1745862ef462391cf741`.
- Release evidence: `GHCR_STAGING_PRIVATE_VERIFIED`, `SHWM_HA_MANIFEST_UNCHANGED_FACEBOOK_UNTOUCHED`. The release's digest log uses the legacy **`SHWM_BETA177_GHCR_DIGEST=`** prefix even though the tag and verified source/version are beta.178.

## Existing Home Assistant test channel: how to receive the update

Manifest: [`shwm_content_engine/config.yaml`](shwm_content_engine/config.yaml) on **this existing HA-facing branch** (`beta177-private-staging`), mirrored from `test/beta177-private-staging`.

The manifest now references `version: "0.4.2-beta.178"` and `image: ghcr.io/smarthomewithme/shwm-content-engine-beta178-staging` (**without tag**, as expected by the HA Supervisor). Its human-facing name/panel/description also say beta.178. Existing `slug: shwm_content_engine`, `arch: amd64`, `boot: manual`, `startup: application`, `ingress: true`, options and schema remain unchanged. The default `groups_wp_bridge_enabled: false` remains in place.

1. Use **only the previously agreed isolated HA test instance**, not production HA. Before installing/upgrading, back up the existing test app's SQLite data, persistent browser profile, sessions and configuration. Do **not** remove the installed app or create another custom add-on repository; that risks a separate Supervisor identity or loss of persistent data.
2. In the existing test Home Assistant, confirm its unchanged repository URL is **`https://github.com/smarthomewithme/shwm-ha-apps#beta177-private-staging`**. This short branch is the branch actually loaded by the installed app; do not substitute `#test/beta177-private-staging` or add a second repo. Refresh the existing repository information in the Home Assistant add-on store. **Do not add an extra `#branch` alias**.
3. Check the Supervisor registry can pull the **private** GHCR package. If authentication fails with 401/403, use properly scoped package read credentials inside the **isolated test HA**, not secrets in this repository, issue comments, logs or ChatGPT. Never make the package public to bypass auth.
4. Check the displayed version is `0.4.2-beta.178`, architecture `amd64`, and the image matches the private beta.178 package before pressing Update/Install. The manifest update itself does **not** install or start Home Assistant. Keep worker `PAUSED`, no automatic start and no Facebook publish.
5. Functional acceptance **without public posting**: verify a real published WordPress source article #260, generate a real Gemini Polish master and three distinct French proposals for the **exact** target group `Home Assistant - France` (with hyphen; distinct from `Home Assistant France`); check signed WordPress → HA DRAFT `ACKED/ACCEPTED`, durable draft after UI refresh/HA restart, and no queued or attempted publications. A forbidden group may allow a nonpublishing draft but must remain blocked for publication review/execution. Keep owner copy/schedule/execution permissions separate.

**Prod stays untouched:** `shwm-ha-apps:main` and the production Home Assistant app are not changed. Do not promote beta.178, enable posting or authorize external Facebook actions without a separate owner's decision.

## History and rollback

This same branch previously pointed to private beta.177 staging image `ghcr.io/smarthomewithme/shwm-content-engine-beta177-staging:0.4.2-beta.177`, digest `sha256:a44b522ff2c8ae9d7db0231010ef21fe84fa763d7dbee67b548d0ce4826d07c1`, source `281f47c5bc9499801ad96170b14cf1b57a4ad08b`, CI `2ccc3b09-27f9-48bd-9694-9fc0fa4ed726`. That image/tag was **not overwritten**; this is a distinct private beta.178 package.

If beta.178 fails live test, **stop the isolated test app and preserve diagnostics/data**. To return to beta.177, deliberately revert the existing test manifest's version and image to those historical values, check the package permissions/digest, and re-evaluate test SQLite compatibility **before** any downgrade; rollback is **not automatic**.

Detailed Google workflow, IDs and PowerShell read-only commands: [SHWM CI/GHCR Runbook](https://github.com/smarthomewithme/shwm-content-engine/blob/docs/beta177-ghcr-postmortem-20261018/docs/SHWM-GOOGLE-CI-GHCR-POWERSHELL-RUNBOOK.md).

### Discovery fix on 18.10.2026

The initial beta.178 manifest update was committed to `test/beta177-private-staging`, while the HA Supervisor repository URL uses existing short branch `#beta177-private-staging`; therefore refreshing Apps still read beta.177. The matching beta.178 `config.yaml` was **also** applied to this HA-facing short branch. Both existing branch manifests now match exactly. Never consider the source/test branch update alone sufficient to update an installed HA app: verify the configured repository's `#branch` and read back the manifest there. The installed HA application remains unverified until Supervisor reload and actual isolated test update.
