# Changelog

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
