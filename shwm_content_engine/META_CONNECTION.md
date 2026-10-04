# Smart Home With Me — Meta connection

Groups use the saved personal Facebook account in Chromium. Facebook Pages use Graph API only. Connecting Meta never logs into Chromium, switches profiles or publishes anything.

## Setup

1. Configure a Meta App that supports Facebook Login or Facebook Login for Business and Page permissions. App Review/Advanced Access and business verification may be required for users outside the app's development roles.
2. Set `facebook_meta_app_id` and the password option `facebook_meta_app_secret`. For Login for Business set `facebook_meta_config_id` to a configuration issuing a **user access token**, with `pages_show_list`, `pages_read_engagement` and `pages_manage_posts`. A Business configuration replaces the scope parameter.
3. Set `facebook_meta_redirect_uri` to a stable HTTPS URL ending exactly in `/api/v1/meta/callback`. Register the identical URI in Meta's Valid OAuth Redirect URIs. Dynamic Home Assistant Ingress URLs cannot be used as callbacks.
4. Configure the reverse proxy to expose **only** that GET callback. Never expose the dashboard, API, Browser Console or port 6080 publicly. Do not log callback query strings; they contain a one-time authorization code. The callback suppresses referrers and removes its query from browser history.
5. In AI Promotion Studio choose CONNECT META, authorize in the separate Meta tab, return and USE THIS PAGE. TEST PAGE CONNECTION is read-only. Choose an approved draft only when deliberately ready to publish.

Without the Meta App and stable callback, one-click authorization is unavailable; the UI explains the requirements. Advanced manual Page ID/token configuration remains available before an OAuth connection is established. It cannot silently replace an expired/revoked OAuth connection.

## Secrets and persistence

OAuth state is random, one-time, expires after ten minutes and is bound to a browser setup key. Restarting the application invalidates incomplete attempts. Discovery tokens are kept only in memory until selection or expiry; select within ten minutes, otherwise reconnect.

The selected Page token is saved through the authenticated Supervisor `/addons/self/options` API using existing `facebook_page_id` and password option `facebook_page_access_token`. Other options are preserved. No new Supervisor administrator access is requested. SQLite migration 0011 contains account/Page names, tasks, permissions, selected Page ID and timestamps, **no credentials**.

This intentionally uses Home Assistant's existing options secret handling. It does not provide encryption against someone able to read the Supervisor configuration or a complete HA backup. Protect backups and HA administrative access. No ineffective local encryption key is stored beside the database.

Graph reads and publishing use Authorization Bearer headers; credentials are never returned by status APIs. The documented backend authorization-code exchange `/oauth/access_token` uses client ID/secret, redirect URI and code parameters; it cannot be authenticated with a Page Bearer token. That backend request URL and provider errors are never logged or reflected. No long-lived user token is retained. Token validity is checked on Page preflight; revocation requires CONNECT META / RECONNECT, without browser fallback. Ambiguous publishing POSTs remain blocked from automatic retry.

## Validation boundaries

Synthetic tests exercise OAuth, discovery, selection, conflicts, storage and secret filtering. Actual Meta authorization, app permission approval, callback routing and Supervisor option persistence need validation in the real installation; unit tests do not prove these external services.

Primary references checked during development:

- Meta's Facebook API collection: https://www.postman.com/meta/facebook/documentation/r56bjfd/facebook-api — `/me/accounts`, Page tokens and PROFILE_PLUS tasks.
- Meta access tokens: https://developers.facebook.com/documentation/facebook-login/guides/access-tokens
- Manual Facebook Login flow: https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow
- Login for Business: https://developers.facebook.com/docs/facebook-login/facebook-login-for-business
- HA Supervisor API: https://developers.home-assistant.io/docs/api/supervisor/endpoints/
- HA app communication: https://developers.home-assistant.io/docs/apps/communication/

Some Meta documentation pages rate-limited retrieval. The official Meta collection confirmed Page discovery/task structure; permission/Business configuration and the authorization-code exchange still require the app-specific live setup test. No Python SDK or new runtime dependency is used.
