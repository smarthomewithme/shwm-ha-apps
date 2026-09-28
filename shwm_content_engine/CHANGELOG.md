# Changelog

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
