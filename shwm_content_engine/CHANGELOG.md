# Changelog

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
- reports noVNC module-load, browser and diagnostics failures directly in the Browser Console instead of hanging indefinitely on `Connecting screen…`
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