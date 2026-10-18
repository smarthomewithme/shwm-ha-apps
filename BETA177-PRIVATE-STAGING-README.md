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
