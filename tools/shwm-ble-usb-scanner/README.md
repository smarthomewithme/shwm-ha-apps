# Smart Home With Me BLE USB Scanner + ESPHome Generator v0.2

GPL-3.0-or-later source, **release candidate** (compiled, not hardware-tested or published).

## What users will do

1. Plug a **spare ESP32 DevKit** or **Seeed XIAO ESP32-C3** into a computer using a USB data cable.
2. On the HTTPS-hosted generator, click **Install BLE Scanner on ESP32**. This uses ESP Web Tools, asks for an explicit user port choice and flashes a pre-built scanner. On first installation this **replaces any old firmware**; back up first.
3. Reconnect the USB cable/serial port if necessary; click **Connect and scan live** and select the port. The ESP32 emits BLE advertisement **JSON lines at 115200 baud** via Web Serial. Data is decoded locally.
4. Theengs browser WASM (GPL-3.0) identifies supported advertising formats. The SHWM LC026 reference profile provides validated weight readings, and is currently the **only profile with a YAML generator**. Other Theengs results are displayed but not fabricated into ESPHome templates.
5. Copy **ESPHome YAML**, use ESPHome Device Builder to **validate and compile**, then flash the compiled firmware to the SAME ESP32 (this **overwrites the temporary scanner**) via USB / ESPHome Web. Add ESPHome device to Home Assistant.

**No original scale/thermometer app, vendor account, paid vendor service or vendor cloud is required for supported BLE broadcasts.** You DO need the open-source ESPHome tooling to compile the final firmware. Encrypted/GATT-only devices may need separate integration.

## What is actually built here

- Functional web interface in `site/index.html`, `site/app.mjs`, `site/core.mjs`: Web Serial live JSONL capture, device grouping, Theengs integration hook, SHWM LC026 decoding, safe YAML generator, clipboard/download. DOM interaction smoke-tested in local Chromium with simulated LC026 data; official Theengs WASM tested in both Chromium and Node.js. No real ESP32 attached here.
- Native ESP32 NimBLE scanner firmware source at `scanner/src/main.cpp` (no Wi-Fi, no vendor cloud), PlatformIO configs for ESP32 DevKit and Seeed XIAO ESP32-C3.
- ESP Web Tools installer button with explicit manifest `site/firmware/manifest.json`; button stays hidden/disabled until firmware images are deployed.
- GitHub Actions workflows that build and merge both firmware images and build the official Theengs WebAssembly module directly from the pinned upstream GPL source; dedicated GitHub Pages deployment workflow is included but not enabled in the user repository.
- Eight unit tests in `tests/decoder.test.mjs`.

## Verified build results (October 20, 2026)

**Compiled BIN files ARE included in this release-candidate ZIP** under `site/firmware/bin/`. GitHub Actions built both targets and merged each image for ESP Web Tools:
- ESP32 DevKit: `esp32dev.bin` (666,416 bytes), SHA-256 `55be98209e590e53eaf741c81745da496a7d521ff62198b37ebcaabf648e57a2`.
- Seeed XIAO ESP32-C3: `seeed_xiao_esp32c3.bin` (571,904 bytes), SHA-256 `7943701461deab150b53ac79104e0faf9b989d08b47d9947c0faa8d767560174`.
- Official Theengs Decoder WebAssembly was built from GitHub release `v2.4.5` using Emscripten 3.1.61 as `site/vendor/theengs_decoder_wasm.mjs` (single-file JS + embedded WASM).
- Confirmed Theengs decoder in Node.js and Chromium by decoding a real supported ClearGrass/Qingping sample.
- Eight decoder unit tests passed. UI buttons passed a simulated browser DOM test; native USB and actual flash tests are still missing.

**Do not call this hardware verified.** We still need USB/serial connection and first/second flash tests on both real board types. The manifest only lists the two compiled targets; mismatching firmware and chip may cause failure. The static site MUST be served from HTTPS for Web Serial. Do not publish the WordPress tutorial as complete until hardware testing passes.

## Deploy (new dedicated GitHub repository recommended)

1. Create a new repository, e.g. `shwm-ble-scanner` (not a folder within a production content-engine repository), and copy the entire source tree to its **main** branch.
2. In repository settings enable Pages **Source: GitHub Actions**.
3. Run `Build SHWM BLE scanner firmware and Pages`. If compilation/merge/Theengs download fails, fix it and rerun; do not bypass failures. Use the workflow artifact SHA256 and check manifest paths.
4. After deployment use `https://<owner>.github.io/<repo>/` over HTTPS, confirm the blue Install button appears, and test with your spare ESP32 before linking to the blog.
5. To embed on WordPress without PHP or new plugins, use a **Custom HTML** block with `<iframe src="https://.../" title="SHWM BLE Decoder" style="width:100%;min-height:1200px;border:0" loading="lazy" allow="serial"></iframe>`; test WordPress `iframe` allowlisting, HTTPS, **Permissions-Policy serial** and Chromium permission prompts. If the host blocks Web Serial in an iframe, **link to the full HTTPS tool instead**; never present disabled buttons as operational.

Avoid WordPress inline JS: Gutenberg may sanitize `<script>` tags, and caching can show outdated versions. A dedicated static HTTPS tool is more reliable.

## Data and third-party components

SHWM code GPL-3.0-or-later. Theengs Decoder is GPL-3.0-only. Its independently built binary in `site/vendor/` comes from the official v2.4.5 source; we retain attribution and offer the source URL and version. See `THIRD_PARTY.md`. ESP Web Tools is consumed from its official distribution. No BLE uploads to our servers: Web Serial and WebAssembly run locally in the browser.