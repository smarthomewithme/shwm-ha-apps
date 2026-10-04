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
