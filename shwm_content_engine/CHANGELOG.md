# Changelog

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
