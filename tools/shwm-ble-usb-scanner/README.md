# Smart Home With Me BLE USB Scanner + ESPHome Generator v0.5 (draft)

GPL-3.0-or-later source, **v0.5 proposed change**. No hardware-tested v0.5 binaries have been built or published yet. Do not promise browser Bluetooth adapter scans; the supported path is ESP32 BLE → USB Web Serial.

## What users will do

1. Plug a **supported ESP32** from the six-board catalog below into a computer using a USB data cable.
2. On the HTTPS-hosted generator, click **Install BLE Scanner on ESP32**. This uses ESP Web Tools, asks for an explicit user port choice and flashes a pre-built scanner. On first installation this **replaces any old firmware**; back up first.
3. Reconnect USB/serial if necessary; click **Scan nearby BLE** and select the ESP32 port. The web app verifies the scanner firmware greeting and sends `SCAN`; the ESP32 then emits real BLE advertisement **JSON lines at 115200 baud** via Web Serial. Click **Stop scanning** to send `STOP`. Standard ESPHome firmware does **not** emit this protocol. Data is decoded locally.
4. Theengs browser WASM (GPL-3.0) identifies supported advertising formats. The SHWM LC026 reference profile provides validated weight readings, and is currently the **only profile with a YAML generator**. Other Theengs results are displayed but not fabricated into ESPHome templates.
5. Copy **ESPHome YAML**, use ESPHome Device Builder to **validate and compile**, then flash the compiled firmware to the SAME ESP32 (this **overwrites the temporary scanner**) via USB / ESPHome Web. Add ESPHome device to Home Assistant.

**No original scale/thermometer app, vendor account, paid vendor service or vendor cloud is required for supported BLE broadcasts.** You DO need the open-source ESPHome tooling to compile the final firmware. Encrypted/GATT-only devices may need separate integration.

## What is actually built here

- Functional web interface in `site/index.html`, `site/app.mjs`, `site/core.mjs`: explicit live USB Scan/Stop, scanner firmware handshake and missing-data diagnosis, Web Serial JSONL capture, device grouping, Theengs integration, SHWM LC026 decoding, safe YAML generator, clipboard/download. Example button removed from primary workflow. DOM interaction smoke-tested in local Chromium with simulated LC026 data; official Theengs WASM tested in both Chromium and Node.js. No real ESP32 attached here.
- Native ESP32 NimBLE scanner firmware source at `scanner/src/main.cpp` (no Wi-Fi, no vendor cloud), PlatformIO configs for six ESP32 boards across three BLE-capable chip families.
- ESP Web Tools installer button with per-board manifests `site/firmware/manifests/<board-id>.json`; button stays hidden/disabled until firmware images are deployed.
- GitHub Actions workflows that build and merge both firmware images and build the official Theengs WebAssembly module directly from the pinned upstream GPL source; a standalone HTTPS host or GitHub Pages deployment can be configured after review.
- Twelve unit tests in `tests/decoder.test.mjs`; additionally a simulated Web Serial + Theengs + six-installer UI integration smoke test passed locally (without real hardware).

## Verified build results (October 20, 2026)

**Compiled BIN files ARE included in the v0.3 six-board CI app ZIP** under `firmware/bin/`. GitHub Actions run 39548643046 built six targets and merged each image for ESP Web Tools:
- ESP32 DevKit / WROOM-32: `esp32dev.bin` (666,416 bytes).
- NodeMCU-32S: `nodemcu-32s.bin` (666,464 bytes).
- ESP32-C3 DevKitM-1: `esp32-c3-devkitm-1.bin` (582,240 bytes).
- Seeed XIAO ESP32-C3: `seeed_xiao_esp32c3.bin` (571,904 bytes).
- ESP32-S3 DevKitC-1: `esp32-s3-devkitc-1.bin` (558,272 bytes).
- Seeed XIAO ESP32-S3: `seeed_xiao_esp32s3.bin` (552,128 bytes).

Each model has an individually scoped installation manifest. For S3 boards use the native USB connector for serial scanner output; generic ESP32/NodeMCU and ESP32-C3 DevKitM-1 use their USB-to-UART bridge. Board selection must match the hardware despite chip-family safeguards.
- Official Theengs Decoder WebAssembly was built from GitHub release `v2.4.5` using Emscripten 3.1.61 as `site/vendor/theengs_decoder_wasm.mjs` (single-file JS + embedded WASM).
- Confirmed Theengs decoder in Node.js and Chromium by decoding a real supported ClearGrass/Qingping sample.
- Twelve decoder unit tests passed. A Node.js simulated DOM/Web Serial test with fake USB frames, real Theengs WASM, six manifest checks and YAML persistence also passed locally. Browser deployment, native USB and actual hardware flash tests are still missing.

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

## Enable the isolated GitHub Pages preview (2026-10-21)

Repository owner selected **Settings → Pages → Build and deployment → Source: GitHub Actions**. Do not configure the generic Jekyll or Static HTML template, and do not change the repository default branch.

The isolated CI workflow at `.github/workflows/shwm-ble-scanner.yml` builds all **six** ESP32 board targets, compiles the pinned Theengs WASM, stages a fallback snapshot to `gh-pages-shwm-ble-preview`, and attempts official GitHub Pages deployment **only when the configured Pages source is GitHub Actions**. The preview is a public experimental tool, not hardware-verified. Do not embed it in the published WordPress article until the USB flash / receive path is verified with a spare ESP32.

On successful deployment, confirm the URL from the **Actions deploy job output** and verify real HTTPS loads. Successful CI compilation alone does not prove GitHub Pages was deployed.


## Expanded BLE board database — v0.4 (pending CI/hardware validation)

- Catalog: **45 ESP32 boards** with pinned identifiers from PlatformIO espressif32 6.9.0.
- Compiled scanner targets: **22 models**, split between original ESP32, ESP32-C3 and ESP32-S3. Each scanner image is built separately, merged with board-specific flash sizes and served with an exact model manifest.
- Other **23 catalog-only boards** are deliberately marked **YAML preview only**; the USB scanner installer will NOT claim support. The generator's ESPHome YAML must be checked in ESPHome Device Builder; board ID presence does not guarantee firmware validation.
- ESP32-S2 excluded entirely (no Bluetooth radio). ESP32-C6 and newer chips are deferred until compatible NimBLE scanner builds and Web Tools chip support are verified with the chosen toolchain.
- New searchable board selector filters manufacturer/chip family/model without removing the current target choice.
- Flashing overwrites a board's existing firmware; use a spare ESP32. No physical testing of the new models has been performed by this code-only workflow.

Adafruit Feather ESP32-S3 is temporarily YAML-preview only under pinned PlatformIO 6.9.0: its 2026-10-21 CI compilation did not emit the `bootloader.bin` required for a safe merged installer image. The other 22 scanner targets emitted their own bootloader files in the CI build logs. Never substitute an unrelated bootloader.

## v0.5 change awaiting hardware verification

The Scan button requires the temporary SHWM scanner firmware on a supported ESP32 connected over USB. A normal ESPHome image, even with `esp32_ble_tracker`, only publishes ESPHome API data and cannot directly feed this Web Serial JSONL UI. The v0.5 firmware waits for a SCAN command, emits a verified hello and scan_state acknowledgement, and stops on STOP. Legacy v0.2 scanners with continuous advertisements remain displayable. Browser Web Bluetooth general advertisement scanning is experimental/limited and is not claimed. Firmware must pass CI compilation and be tested on a real ESP32 before merge/deployment or updating WordPress post 926. Do not publish a sample as live data.
