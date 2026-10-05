# SHWM Content Engine

Private application for **Smart Home With Me**.

Website: https://smarthomewithme.com  
Contact: smarthomewithme@gmail.com

## Beta 0.4.2-beta.87

The application stores the SQLite database and the original persistent Chromium profile in `/data`. Normal updates and restarts preserve the account cookies, actors, campaigns and history.

## Facebook account and groups

Campaign Module uses the saved **personal account** through one master persistent Chromium session. Personal actors are loaded from ActorRegistry and the normal single account is selected automatically. There is no per-actor login, dedicated profile creation or automatic Facebook identity switching.

CHECK LOGIN / CHECK SESSION is read-only and registers the verified account. It does not open Browser Console or initiate login. If Facebook requires manual intervention, use OPEN LOGIN, complete the normal login/checkpoint/2FA, then **FINISH LOGIN / CLOSE CONSOLE**, followed by CHECK SESSION.

Closing the console tab alone does not finish manual ownership. Automated operations remain paused until the explicit finish action closes headed Chromium. Browser Console remains available only through trusted Home Assistant Ingress, and port 6080 is not exposed on the host.

WORKER, DIAGNOSTICS and INTERACTIVE ownership is exclusive. Workers reuse one headless context and automation page. Chromium closes after five idle minutes, retaining its saved profile. The dated session status cache speeds up UI rendering; it never authorizes publication. Every group target has live preflight and fresh expected account/actor and destination checks immediately before submit.

Group checks remain read-only. Unknown membership/readiness stays unknown. Login/security intervention preserves campaign, target, copy and history. An ambiguous external submit is never retried automatically.

See [Master session guide](MASTER_SESSION.md) for lifecycle, diagnostics and the manual test plan.

## Facebook Pages: Meta Graph API only

AI Promotion Studio uses **CONNECT META** to authorize, discover managed Pages and select a Page resource. Page operations never open Chromium or switch the browser actor.

Meta authorization requires a configured Meta App, appropriate Page permissions and a stable HTTPS callback ending in `/api/v1/meta/callback`. A temporary Home Assistant Ingress URL cannot serve as that callback. Configure a reverse proxy exposing only the callback; keep all other APIs and Browser Console private. The UI clearly reports missing setup.

App options:

- `facebook_meta_app_id` — Meta App ID
- `facebook_meta_app_secret` — backend-only password option
- `facebook_meta_redirect_uri` — stable HTTPS callback, also registered with Meta
- `facebook_meta_config_id` — optional Login for Business configuration issuing a user token
- `facebook_graph_version` — Graph version
- `facebook_page_id` and `facebook_page_access_token` — selected credentials stored through Home Assistant Supervisor options; Advanced manual setup remains available before an OAuth connection
- `facebook_page_publish_mode` — use `auto` or `graph_api`; the retained legacy `browser` option cannot enable Page browser publishing

After CONNECT META, return to Promotor, select USE THIS PAGE and TEST PAGE CONNECTION. Tokens and App Secret are never returned in status/UI, logged or saved in SQLite. Home Assistant options and backups are an interim secret store, not encryption against HA administrators. Protect administrative access and backups.

A revoked/expired OAuth Page connection requires RECONNECT and cannot fall back to Chromium or manual credentials. Publishing verifies the selected Page identity and permissions; ambiguous POSTs are never automatically retried.

See [Meta connection guide](META_CONNECTION.md) for App configuration, callback security and storage trade-offs.

## Validation after update

1. Update and restart SHWM Content Engine.
2. CHECK LOGIN; confirm the expected personal actor.
3. Open SHWM Promotor and CHECK SESSION in Campaign Module; it must reach the backend without Route not found.
4. If manual login is needed, OPEN LOGIN → complete login → FINISH LOGIN / CLOSE CONSOLE → CHECK SESSION.
5. Check the same group twice; confirm read-only checks and warm context reuse.
6. Configure CONNECT META, authorize, select the intended Page and TEST PAGE CONNECTION.
7. Confirm WordPress articles and saved module preferences remain visible.
8. Only when deliberately ready, approve a single group target and a single Page post yourself; inspect destination, actor and captured result before testing a larger campaign.

CI uses synthetic content and never makes a live Facebook post. Actual Meta permission approval, callback routing, Supervisor option persistence and live Facebook latency still require validation in the installation.

## Beta.88: one Facebook account, multiple group actors

The saved master Chromium profile is the only browser login. Campaign Module can lock a target to a registered personal profile, Page or acting profile. Own Page timeline publishing in AI Promotion Studio continues to require Meta Graph API; it never acquires the browser broker or switches a profile.

`CHECK SESSION` verifies the account without changing the acting profile. `USE ACTOR` saves the campaign preference. `CHECK ACTOR` explicitly prepares and verifies the selected actor in the same account session. Worker preparation may switch a registered actor before read-only group inspection, but a diagnostic `CHECK GROUP` never switches, joins, composes or submits.

A switch uses a uniquely resolved account menu/profile choice, then strong session and exact fingerprint verification. A unique name is only a navigation hint, never identity proof. The worker pauses on missing/ambiguous choices, wrong accounts, conflicting identity, checkpoint or unverifiable results. A Page does not get a separate login/profile. Three consecutive targets for an unchanged actor reuse the warm context. Actor affinity only breaks ties AFTER due time and priority; it cannot pull a future target forward.

Capabilities are keyed by actor and group. A personal actor's READY state cannot make a Page READY. All enabled groups remain visible with the selected actor's reason and available count. Changing the selector cannot change an already queued target's locked actor.

`ATTENTION REQUIRED` is a status, not a diagnosis. Each target now shows the persisted error code/message and recovery instructions. If historical data has no reason, the interface says so. For security attention, open Browser Console and follow Facebook's own steps, close it with `FINISH LOGIN / CLOSE CONSOLE`, then `CHECK SESSION` and `CHECK ACTOR`. For ambiguous submission, inspect the group first and resolve the outcome; do not blindly retry.

Before submit, fresh strong account proof, exact acting fingerprint and the expected group URL are required. The editable field and submit control must belong to one connected visible dialog, contain the approved copy and have no contradictory group destination. No switch occurs after composition. Existing ambiguous-outcome/duplicate prevention remains in force.

Legacy Page/acting-profile rows move to the existing master identity while retaining actor IDs, capabilities and history. Duplicate legacy fingerprints are retained for review instead of merging historical references speculatively. Successful account checks do not reset an explicitly selected Page preference.

### Manual validation after installing beta.88

A. Personal: choose the saved personal actor, USE ACTOR, CHECK SESSION, CHECK ACTOR and CHECK GROUP on one group. Confirm the displayed actor-specific capability before manually launching a reviewed test campaign.

B. Page in groups: choose the registered Page, USE ACTOR, CHECK ACTOR and CHECK GROUP where the Page already belongs. If Facebook's chooser cannot be verified, switch manually in Browser Console, close it and CHECK ACTOR again. Launch one reviewed test target only when this Page/group pair is READY. Do not create a second login.

C. Switching: execute a reviewed personal target then a reviewed Page target. Verify the expected actors, one master profile and warm context reuse. Check that an unavailable Page/group pair leaves the personal capability unchanged and pauses before any submit.

D. Own Page: use AI Promotion Studio with CONNECT META / selected Page. Confirm Graph API operation without Chromium startup/profile switching. Missing Graph configuration must return GRAPH_API_REQUIRED.

Live Facebook UI/localization, Page eligibility and old-hardware hydration remain runtime validation items. Synthetic Chromium smoke cannot prove live Facebook selector compatibility. CAPTCHA, checkpoint and 2FA always require manual action.

### Composer and Console recovery in beta.89

Closing the noVNC browser tab does not stop the server-side INTERACTIVE owner. After manual work, use FINISH LOGIN / CLOSE CONSOLE in Campaign Module (also shown on WAITING_FOR_INTERACTIVE_SESSION target errors). This stops only the interactive master session; a worker-owned operation remains protected. CHECK SESSION, CHECK ACTOR and CHECK GROUP before manually resuming the reviewed target. Approved copy and campaign state are retained.

The group publisher resolves one genuine trigger, ignoring broad tabindex/role wrappers around a nested button and cover photo. It polls bounded actionability, hit-tests points inside that control and uses ordinary Playwright clicks. COMPOSER_CLICK_BLOCKED and SUBMIT_CONTROL_BLOCKED pause for manual review. It never forces a click through another element. A submit timeout remains SUBMISSION_AMBIGUOUS and cannot trigger another automatic submit.

Validation includes synthetic Chromium layouts with a cover-photo ancestor, partial/transient/permanent overlays, delayed controls, duplicate controls and a wrapped native submit. Live Facebook layouts still require a reviewed manual target test after installation; do not re-submit an existing ambiguous target until its remote outcome is resolved.

### Live composer readiness in beta.90

Facebook may replace a composer trigger while the group hydrates. Before sending any normal click, the publisher now re-resolves the current unique semantic trigger on each readiness retry, disposes discarded handles and rechecks receiving-events geometry after its non-clicking Playwright trial. Polling uses the existing bounded deadline. Ambiguous controls, a changed group destination and permanent obstruction still block. A sent opener/submit click is never automatically repeated by this recovery path.

OPEN_COMPOSER errors now distinguish CONTROL_DETACHED, CONTROL_COVERED, CONTROL_OFFSCREEN, CONTROL_DISABLED, CONTROL_HIDDEN, CONTROL_POINTER_EVENTS, CONTROL_UNRESOLVED, PLAYWRIGHT_SCROLL_TIMEOUT, PLAYWRIGHT_TRIAL_TIMEOUT and READINESS_ERROR. The message includes only allowlisted element types and attempt/candidate counts. It excludes page HTML, labels, names, IDs, cookie values and tokens. A covered-button diagnostic can identify blockers=IMG or blockers=DIV without exposing the image URL or text.

If a group remains blocked after the update, retain the complete readiness line and inspect that group in Browser Console. Finish manual work using FINISH LOGIN / CLOSE CONSOLE, then CHECK SESSION, CHECK ACTOR and CHECK GROUP before manually resuming. A real overlay is never bypassed; live Facebook layout validation remains necessary.
