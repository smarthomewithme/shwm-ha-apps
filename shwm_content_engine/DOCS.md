# SHWM Content Engine

Private application for **Smart Home With Me**.

Website: https://smarthomewithme.com  
Contact: smarthomewithme@gmail.com

## Beta 0.4.2

This beta validates the Home Assistant runtime path for the browser/session layer.

After startup, open the app from the Home Assistant sidebar. Validate:

- app startup and health
- Ingress dashboard
- manual browser console through Home Assistant Ingress
- persistent Chromium session start/stop
- Facebook login-state inspection
- conservative Facebook group inspection

This beta does **not** publish Facebook posts and does not automatically join groups.

Runtime data is stored in `/data` and is retained across app restarts and Home Assistant backups.
