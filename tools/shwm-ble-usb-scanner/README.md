# Smart Home With Me BLE USB Scanner + ESPHome Generator v0.2

GPL-3.0-or-later source, development build (not production-ready).

## What users will do

1. Plug a **spare ESP32 DevKit** or **Seeed XIAO ESP32-C3** into a computer using a USB data cable.
2. On the HTTPS-hosted generator, click **Install BLE Scanner on ESP32**. This uses ESP Web Tools, asks for an explicit user port choice and flashes a pre-built scanner. On first installation this **replaces any old firmware**; back up first.
3. Reconnect the USB cable/serial port if necessary; click **Connect and scan live** and select the port. The ESP32 emits BLE advertisement **JSON lines at 115200 baud** via Web Serial. Data is decoded locally.
4. Theengs browser WASM (GPL-3.0) identifies supported advertising formats. The SHWM LC026 reference profile provides validated weight readings, and is currently the **only profile with a YAML generator**. Other Theengs results are displayed but not fabricated into ESPHome templates.
5. Copy **ESPHome YAML**, use ESPHome Device Builder to **validate and compile**, then flash the compiled firmware to the SAME ESP32 (this **overwrites the temporary scanner**) via USB / ESPHome Web. Add ESPHome device to Home Assistant.

**No original scale/thermometer app, vendor account, paid vendor service or vendor cloud is required for supported BLE broadcasts.** You DO need the open-source ESPHome tooling to compile the final firmware. Encrypted/GATT-only devices may need separate integration.

## What is actually built here

- Functional web interface in `site/index.html`, `site/app.mjs`, `site/core.mjs`: Web Serial live JSONL capture, device grouping, Theengs integration hook, SHWM LC026 decoding, safe YAML generator, clipboard/download. UI is tested on local Chromium with simulated scanner data; no real ESP32 attached here.
- Native ESP32 NimBLE scanner firmware source at `scanner/src/main.cpp` (no Wi-Fi, no vendor cloud), PlatformIO configs for ESP32 DevKit and Seeed XIAO ESP32-C3.
- ESP Web Tools installer button with explicit manifest `site/firmware/manifest.json`; button stays hidden/disabled until firmware images are deployed.
- GitHub Actions source workflow that builds and merges both firmware images, downloads the official Theengs WebAssembly binary + JS, runs tests, and deploys the static site via GitHub Pages.
- Eight unit tests in `tests/decoder.test.mjs`.

## IMPORTANT build/publish gates

**NO `.bin` firmware is shipped in this ZIP**: this runtime cannot download/compile the Arduino toolchain. GitHub Actions must compile firmware and publish both binaries before the installer becomes visible. The workflow is written but **has not been run**. Do not claim first-flash support works until GitHub Actions and a physical board test pass. Verify the Theengs assets' actual GitHub Pages paths (they are retrieved from its browser parser bundle), GPL notices, and runtime in the deployed site. If upstream Theengs files have moved, adjust the workflow URLs.

`site/firmware/manifest.json` references ESP32 and ESP32-C3 images. They MUST contain merged images appropriate to their chip variant. Do not mix an ESP32 binary with ESP32-C3. For the C3, verify physical board USB CDC mode.

## Deploy (new dedicated GitHub repository recommended)

1. Create a new repository, e.g. `shwm-ble-scanner` (not a folder within a production content-engine repository), and copy the entire source tree to its **main** branch.
2. In repository settings enable Pages **Source: GitHub Actions**.
3. Run `Build SHWM BLE scanner firmware and Pages`. If compilation/merge/Theengs download fails, fix it and rerun; do not bypass failures. Use the workflow artifact SHA256 and check manifest paths.
4. After deployment use `https://<owner>.github.io/<repo>/` over HTTPS, confirm the blue Install button appears, and test with your spare ESP32 before linking to the blog.
5. To embed on WordPress without PHP or new plugins, use a **Custom HTML** block with `<iframe src="https://.../" title="SHWM BLE Decoder" style="width:100%;min-height:1200px;border:0" loading="lazy" allow="serial"></iframe>`; test WordPress `iframe` allowlisting, HTTPS, **Permissions-Policy serial** and Chromium permission prompts. If the host blocks Web Serial in an iframe, **link to the full HTTPS tool instead**; never present disabled buttons as operational.

Avoid WordPress inline JS: Gutenberg may sanitize `<script>` tags, and caching can show outdated versions. A dedicated static HTTPS tool is more reliable.

## Data and third-party components

SHWM code GPL-3.0-or-later. Theengs Decoder is GPL-3.0; its own binary and JS are fetched on deployment, not copied verbatim into this source archive. See `THIRD_PARTY.md`. ESP Web Tools is consumed from its official distribution. No BLE uploads to our servers: Web Serial and WebAssembly run locally in the browser.