# Changelog

## 0.4.2-beta.83

- keeps one persistent master Facebook account session for personal-profile group campaigns and preserves the existing onboarding Chromium profile
- fixes CHECK LOGIN verifying the session without registering the personal actor; the verified probe now populates ActorRegistry and the Campaign profile automatically
- separates explicit OPEN LOGIN from read-only CHECK LOGIN, uses committed login navigation, and prevents overlapping wizard actions
- migrates legacy personal actor bindings transactionally and idempotently while preserving actor IDs, legacy identities, metadata and group history
- blocks group publishing through a Page or a dedicated per-actor session; the master personal actor remains verified before submit
- Page publishing and permalink recovery use Meta Graph API without Chromium or actor switching; configure Page ID and Page access token in auto/graph_api mode
- keeps Bearer-only credentials, article /feed transport, standalone image /photos transport and no automatic retry after ambiguous POST
- preserves campaigns and target errors when login/security intervention is required, exposing NEEDS_ATTENTION rather than losing the work
- adds 30 regression tests; the effective beta runtime passes 364 tests before release

## 0.4.2-beta.82

- replaces the beta.76 per-actor Chromium-login model with a Facebook Account Manager: the personal Facebook profile uses one persistent master account session
- migrates existing `PERSONAL_PROFILE` actors such as Jarek Drewnicki back to the master Facebook identity while preserving the old dedicated identity as rollback metadata
- keeps actor IDs and actor×group capability history stable during migration, so existing Campaign Module targets do not need to be recreated
- removes `DISCOVER ACTORS` from the normal Campaign Module and AI Promotion Studio workflow; saved actors are loaded from the persistent registry instead
- replaces Campaign Module `OPEN SESSION` / `VERIFY SESSION` with `CHECK SESSION`; the normal path performs a headless verification and does not open Browser Console
- exposes `OPEN LOGIN` only when the master Facebook session actually needs manual login or correction
- opens a lightweight preparation tab first and connects it to Browser Console only after the master Chromium session has started, avoiding a long-loading console tab during browser startup
- removes browser-session controls from AI Promotion Studio Page selection; Facebook Pages remain resources and prefer the official Meta Graph API path
- keeps Facebook-group publishing on the selected personal actor but now executes it through the actor's master Facebook account identity, eliminating duplicate Facebook logins per actor
- adds migration, account-session, UI and release regression coverage; all actor/browser, publication, worker/queue and REST gates pass before image publication

## 0.4.2-beta.81

- fixes Campaign Module and AI Promotion Studio `OPEN SESSION` navigating away from SHWM Promotor
- opens Browser Console in a separate tab so the current Promotor state, selected content and module configuration stay visible
- re-hydrates persisted actor/profile state when the user returns to the Promotor tab without running actor discovery or navigating Facebook
- adds regression coverage preventing same-tab Browser Console navigation

## 0.4.2-beta.80

- fixes Chromium `DNS_PROBE_FINISHED_BAD_CONFIG` seen in Facebook onboarding and dedicated actor sessions by giving Chromium its own managed Secure DNS (DoH) policy instead of rewriting Home Assistant/container DNS
- uses a literal-IP DoH bootstrap endpoint (`https://1.1.1.1/dns-query`) so Chromium can resolve Facebook even when the container's current resolver configuration is broken
- keeps Home Assistant, Docker and Node resolver configuration untouched; DNS recovery is scoped only to Chromium
- upgrades `TEST CONNECTION` from `navigator.onLine` to a real in-Chromium Facebook request, because an interface can report online while DNS is unusable
- treats the backend/Node Facebook probe as secondary evidence; a successful Chromium Facebook probe now produces an ONLINE result even if the backend probe times out
- exposes browser reachability and backend DNS/timeout warnings separately so a Node-side timeout can no longer masquerade as a failed Facebook browser session
- adds regression coverage for a working Chromium Facebook path combined with a failing backend DNS probe
- preserves the beta.79 login wizard, beta.78 actor discovery repair and beta.76 dedicated actor identity architecture

## 0.4.2-beta.79

- replaces the loose Facebook browser controls with a guided Facebook Login Wizard
- makes `OPEN FACEBOOK LOGIN` open Browser Console in a separate tab instead of navigating away from SHWM Content Engine
- allows an optional Facebook email/phone login hint to be stored only in the local dashboard browser and prefilled into Facebook; SHWM never accepts or stores the Facebook password or 2FA secret
- adds `TEST CONNECTION` diagnostics that distinguish add-on-to-Facebook reachability from Chromium `navigator.onLine` state and report HTTP/latency/error details
- navigates the interactive session directly to the Facebook login page for onboarding instead of relying on the full Facebook home feed
- removes Chromium `--disable-background-networking`, which is inappropriate for a normal interactive login session
- restores X11 DAMAGE support in x11vnc instead of forcing `-noxdamage`, reducing unnecessary full-screen polling
- reduces the interactive framebuffer/window from 1365×768 to 1280×720 and tunes noVNC for responsiveness with fixed local scaling, compression level 2 and quality level 5
- keeps the existing persistent Chromium identity so a successful login can be reused across restarts until Facebook invalidates the session
- preserves beta.78 actor discovery and the beta.76 dedicated-identity architecture

## 0.4.2-beta.78

- repairs `DISCOVER ACTORS` after the beta.76 dedicated-identity migration
- keeps the onboarding/default Facebook session responsible only for discovery, while returning every registered workspace actor even after that actor has moved to its own persistent Chromium identity
- prevents registered Jarek/Page actors from disappearing from Campaign Module and AI Promotion Studio immediately after successful discovery
- adds regression coverage proving onboarding discovery still returns actors whose `identity_id` is a dedicated `fbid-*` profile
- adds visible discovery progress and success/error feedback in both modules, including the number of registered actors/Pages available
- preserves the beta.76/77 rule that normal publishing never switches Facebook profiles automatically

## 0.4.2-beta.77

- hardens Facebook Page Graph API transport introduced in beta.76 without changing the dedicated-identity architecture
- sends Page Access Tokens only in the `Authorization: Bearer` header instead of query strings or form bodies
- publishes WordPress/article promotions through `/feed` with `message + link`, allowing Facebook to build the link preview from the article Open Graph metadata
- publishes standalone image posts without a canonical URL through `/photos` with the public image URL and post text as the caption
- keeps Chromium completely out of the Graph API Page path; browser publishing remains only the configured fallback
- treats POST network failures and HTTP 5xx responses as ambiguous external state, blocking automatic retry to avoid duplicate Page posts
- stores Graph transport metadata (`text`, `link`, or `photo`) and the returned remote object/post identifiers for diagnostics and history
- adds regression tests proving link preview transport, photo transport, Bearer-token handling, absence of access tokens in POST bodies, and browser bypass

## 0.4.2-beta.76

- gives every registered Facebook actor its own persistent Chromium identity/profile instead of making personal profile and Page actors share one browser profile
- removes runtime Jarek ↔ Page switching from the normal publication path; Campaign Module opens the dedicated browser identity locked to each target actor
- keeps Facebook-group publishing on guarded browser automation because Meta no longer provides a public Groups publishing API
- adds official Meta Graph API publishing for Facebook Pages in AI Promotion Studio, with `auto`, `graph_api` and `browser` transport modes
- verifies the configured Graph API Page before submit and uses the returned Meta post ID as positive publication evidence; permalink readback is attempted separately
- prevents ambiguous Graph API POST/network failures from being automatically retried, preserving duplicate-post protection
- adds Home Assistant options for Graph API version, Page ID and Page Access Token; the token is passed only through the process environment and is never returned by the status API
- keeps browser publishing as a fallback in `auto` mode when Graph API credentials are not configured
- adds per-actor `OPEN SESSION` and `VERIFY SESSION` controls so browser identities can be prepared once and then reused without profile switching during a campaign
- carries `actor_id` through durable queue leases so the worker always knows which dedicated Facebook identity owns the target
- aligns Page publisher and queue regression coverage with the dedicated-identity contract and adds a unit test proving Graph API publishing bypasses Chromium entirely
- splits CircleCI into observable gates for transforms, syntax, actor/browser tests, publication tests, worker/queue tests, remaining tests, and final release smoke/publish

## 0.4.2-beta.75

- keeps RSS completely out of Campaign Module; Campaign Module accepts only WordPress blog articles, enforced in both UI and backend
- filters AI Promotion Studio `Blog article` to WordPress ARTICLE content only
- routes RSS explicitly into `New topic / RSS` via `SEND TO AI STUDIO`; RSS no longer appears as a blog article source
- adds `CANCEL POST` for the current unpublished Promotion Studio source/drafts with a two-step confirmation
- refreshes RSS/Promotion Studio UI immediately after routing an RSS item instead of requiring a manual page reload
- hydrates persisted Facebook actors and independent module profile preferences from registry on page reload so discovered/registered profiles do not appear to vanish
- exposes queue error code/message and attempt counters in Campaign Module diagnostics instead of silently hiding failed/blocked campaigns
- preserves the fail-closed actor interlock: if the scheduled actor does not match the active Facebook actor, publishing is blocked before submit and the mismatch is surfaced to the UI
- reduces the first campaign publication slot from about 10 minutes to about 1 minute to make guarded test campaigns easier to verify

## 0.4.2-beta.74

- changes AI Promotion Studio `REGENERATE` into conservative `AI IMPROVE`: Gemini/OpenAI now use the current textarea text as the primary source and only improve grammar, clarity, flow and small wording issues instead of replacing a human rewrite from scratch
- adds `AI IMPROVE` to Campaign Module localized group copies with the same preserve-the-author-text contract
- keeps the author's meaning, facts, first-person voice, paragraph structure and URLs; AI editing uses source/article context only as a factual guard and must not invent new claims
- makes AI Promotion Studio direct publishing strictly Facebook Page-only; personal profiles remain available only for Campaign Module Facebook-group publishing
- renames Promotion Studio step 2 to `Facebook Page` and filters its selector to verified Page actors only
- repairs the RSS → AI Promotion Studio bridge: `CREATE POST` or `Use selected RSS item` now loads the generated RSS content directly into Promotion Studio while `Include RSS module` is enabled
- adds automatic News Radar refresh every 45 minutes plus an initial delayed refresh; manual `Refresh all` remains available
- clarifies current RSS beta criteria in the UI: configured feeds/languages plus built-in smart-home relevance scoring and a selectable minimum Social score; keyword weights are not configurable yet

## 0.4.2-beta.73

- filters Facebook utility/ad menu rows such as `Opcje reklam`, `Ad options`, Ads Manager, Business Suite and professional-dashboard entries out of DISCOVERED profile/Page choices in both Campaign Module and AI Promotion Studio
- keeps registered Facebook actors untouched while cleaning only transient discovery candidates
- changes the Workspace card from a live browser navigation to the last positively verified Facebook actor from the persistent actor registry
- removes the possibility of Workspace sitting indefinitely on `CHECKING` just because Facebook actor discovery/navigation is busy
- labels the Workspace value honestly as `Last verified Facebook actor`; use `REFRESH PROFILES` in a module to resync after a manual Facebook profile/Page switch
- preserves strict fail-closed login/session checks and does not change publication retry behavior

## 0.4.2-beta.72

- keeps the strict Facebook `/me` protected-session probe and the fail-closed `c_user` account binding
- fixes `PROTECTED_SESSION_CONTENT_NOT_CONFIRMED` false negatives seen when Facebook omits or delays `CurrentUserInitialData` in a fresh `/me` tab while acting as a Page
- uses the same disposable probe tab for a second Facebook Home account-binding check; the visible interactive Facebook tab is never navigated by the login check
- still rejects stale `c_user` when account-bound protected content cannot be proven
- keeps the one-time retry only for a crashed read-only probe tab; publication actions are never automatically retried
- makes Workspace `Current Facebook session` use the lightweight current-actor check instead of full profile discovery
- prevents Workspace from remaining indefinitely on `CHECKING`; timeouts now become a visible `UNAVAILABLE` state
- renames module profile refresh controls to `REFRESH PROFILES` in Campaign Module and AI Promotion Studio
- preserves independent profile preferences for Campaign Module and AI Promotion Studio

## 0.4.2-beta.5

- replaces the inline ES-module Browser Console bootstrap with a regular external bootstrap script served by the app
- resolves Browser Console asset, diagnostics and websocket URLs relative to the current Ingress URL so the Home Assistant Ingress prefix is preserved automatically
- forces JavaScript assets proxied from noVNC to use a valid `text/javascript` MIME type with `nosniff`
- reports Browser Console module-load, browser and diagnostics failures directly in the Browser Console instead of hanging indefinitely on `Connecting screen…`
- logs Browser Console bootstrap, noVNC module and diagnostics requests without exposing credentials
- adds a real headless Chromium frontend smoke test that must reach `Screen connected` before the image can be published
- keeps the existing backend readiness, websocket `101`, persistent Chromium start/stop and unit/syntax checks as publication gates

## 0.4.2-beta.4

- adds automatic Browser Console reconnect attempts
- adds in-console diagnostics for x11vnc and websockify readiness
- logs Home Assistant Ingress websocket upgrade details without exposing credentials
- allows websocket compatibility fallback for the trusted Home Assistant Ingress peer when `X-Ingress-Path` is not forwarded on the upgrade request
- adds explicit browser support readiness logs for Xvfb, Openbox, x11vnc and websockify
- adds a real end-to-end websocket `101 Switching Protocols` smoke test before publishing the image
- validates the full container, browser backend, websocket tunnel and real persistent Chromium start/stop before GHCR publication
- publishing is serialized to avoid concurrent builds overwriting the same beta tag

## 0.4.2-beta.3

- adds Openbox as a lightweight window manager for the interactive Chromium display
- forces interactive Chromium to use X11 with a fixed visible window size and position
- disables GPU rendering for the manual Xvfb/noVNC session to avoid black-screen rendering issues
- clarifies that Browser Console `Connected` means the screen transport is connected, not that Facebook is authenticated
- keeps headless verification runs separate from the interactive X11-only flags

## 0.4.2-beta.2

- adds dashboard controls for the Facebook browser session
- adds one-click `Open Facebook login`
- adds `Check login` and `Stop browser` actions
- shows current browser and Facebook session state in the Home Assistant Ingress dashboard
- removes the need to use browser developer tools or terminal commands for the normal login flow
- publishing pipeline now runs unit tests and syntax checks before pushing the beta image

Runtime hardening remains based on audited source HEAD `7ffc8d29fe6e2a669e9a6f75fdef81281cd3eee1`.

## 0.4.2-beta.1

- Home Assistant Ingress browser console
- persistent Chromium session support
- hardened Facebook login/session verification
- conservative Facebook group inspection
- screenshot retention and browser lifecycle hardening
- no Facebook post publication path in this milestone

Build source: `shwm-content-engine` audited HEAD `7ffc8d29fe6e2a669e9a6f75fdef81281cd3eee1`.
