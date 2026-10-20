# Third-party attribution and license gates

- Theengs Decoder — https://github.com/theengs/decoder — GPL-3.0; upstream WASM loaded from separately hosted files in the deployed tool; retain license notices, source and authorship. The web decoder's API is `const Module = await factory(); new Module.TheengsDecoder().decodeBLE(JSON.stringify(adv))`. Review integration under GPL-3.0 before release.
- ESP Web Tools — https://github.com/esphome/esp-web-tools — open-source in-browser firmware installer using Web Serial. Check the applicable license and distribution conditions of the pinned version before public deployment.
- NimBLE-Arduino — https://github.com/h2zero/NimBLE-Arduino — review its repository license in the actual pinned dependencies produced by PlatformIO, and preserve notices in binary distributions.

Our own project declares GPL-3.0-or-later to avoid incompatible source distribution claims. Copy the full text of GPL-3.0 when distributing final releases.