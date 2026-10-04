# SHWM Content Engine

Private application for **Smart Home With Me**.

Website: https://smarthomewithme.com  
Contact: smarthomewithme@gmail.com

## Beta 0.4.2

The application runs inside Home Assistant and stores its persistent runtime data in `/data`, including browser identities and the SQLite database. This data survives normal app restarts and Home Assistant backups.

## Facebook architecture

Beta.76 separates direct Facebook Page publishing from Facebook-group publishing.

### Facebook Pages

AI Promotion Studio can publish directly to a Facebook Page through the official Meta Graph API.

Home Assistant app options:

- `facebook_page_publish_mode`
  - `auto` — prefer Graph API when Page credentials are configured, otherwise use the dedicated browser session
  - `graph_api` — require Graph API and fail closed when it is not configured
  - `browser` — always use browser publishing
- `facebook_graph_version` — Graph API version used by the runtime
- `facebook_page_id` — numeric Facebook Page ID
- `facebook_page_access_token` — Page Access Token; stored by Home Assistant as a password option and never returned by the app status API

The Graph API path verifies the configured Page before publication. A successful Meta post ID is treated as positive publication evidence. Network ambiguity after a submit is never automatically retried because doing so could create a duplicate post.

### Facebook groups

Facebook-group publishing remains browser-based because Meta no longer exposes a public Groups publishing API suitable for this workflow.

Each registered Facebook actor now owns a separate persistent Chromium identity/profile. A personal profile and a Page therefore do not share one browser profile and the worker does not switch Jarek ↔ Page during publication.

Use the actor controls in the app to:

1. open the dedicated session,
2. log in to Facebook when needed,
3. verify the session once,
4. reuse that persistent actor identity for group checks and publication.

Campaign targets remain locked to an explicit actor. Before submit, the worker verifies the exact actor again and fails closed on mismatch or an unverified session.

## What to validate after an update

- app startup and `/api/v1/health`
- Home Assistant Ingress UI
- WordPress content sync
- RSS News Radar and RSS → AI Promotion Studio routing
- persisted Campaign Module and Promotion Studio Facebook profile/Page preferences
- dedicated Facebook actor sessions
- Facebook group readiness checks
- AI Promotion Studio Page transport status (`graph_api` or browser fallback)
- publication history and captured Facebook post links

## Safety behavior

- no automatic Facebook profile switching during publication
- no automatic retry after an ambiguous external submit
- actor and group readiness are checked before group publication
- Page Graph API credentials are not exposed in status responses or logs
- browser automation is retained only where the official API does not cover the workflow
