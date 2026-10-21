/* SHWM BLE Decoder, shared pure parsing/decoder functions — GPL-3.0-or-later */
// Pinned PlatformIO espressif32@6.9.0 board identifiers. Exact scanner images only for scanner:true.
export const BOARD_CATALOG = Object.freeze([
  {"id":"esp32dev","label":"ESP32 DevKit / WROOM-32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"nodemcu-32s","label":"NodeMCU-32S","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"esp32doit-devkit-v1","label":"DOIT ESP32 DevKit V1","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"lolin32","label":"Wemos LOLIN32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"wemos_d1_mini32","label":"Wemos D1 Mini ESP32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"pico32","label":"Espressif ESP32 PICO Kit","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"esp-wrover-kit","label":"ESP-WROVER-KIT","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"m5stack-atom","label":"M5Stack ATOM (ESP32)","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"tinypico","label":"Unexpected Maker TinyPICO","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"adafruit_feather_esp32_v2","label":"Adafruit Feather ESP32 V2","chipFamily":"ESP32","usb":"USB-UART","flashMB":8,"scanner":true},
  {"id":"esp32-c3-devkitm-1","label":"ESP32-C3 DevKitM-1","chipFamily":"ESP32-C3","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"esp32-c3-devkitc-02","label":"ESP32-C3 DevKitC-02","chipFamily":"ESP32-C3","usb":"USB-UART","flashMB":4,"scanner":true},
  {"id":"seeed_xiao_esp32c3","label":"Seeed XIAO ESP32-C3","chipFamily":"ESP32-C3","usb":"USB CDC","flashMB":4,"scanner":true},
  {"id":"lolin_c3_mini","label":"Wemos LOLIN C3 Mini","chipFamily":"ESP32-C3","usb":"USB CDC","flashMB":4,"scanner":true},
  {"id":"adafruit_qtpy_esp32c3","label":"Adafruit QT Py ESP32-C3","chipFamily":"ESP32-C3","usb":"USB CDC","flashMB":4,"scanner":true},
  {"id":"dfrobot_beetle_esp32c3","label":"DFRobot Beetle ESP32-C3","chipFamily":"ESP32-C3","usb":"USB CDC","flashMB":4,"scanner":true},
  {"id":"esp32-s3-devkitc-1","label":"ESP32-S3 DevKitC-1","chipFamily":"ESP32-S3","usb":"USB CDC (native port)","flashMB":8,"scanner":true},
  {"id":"esp32-s3-devkitm-1","label":"ESP32-S3 DevKitM-1","chipFamily":"ESP32-S3","usb":"USB CDC (native port)","flashMB":8,"scanner":true},
  {"id":"seeed_xiao_esp32s3","label":"Seeed XIAO ESP32-S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":8,"scanner":true},
  {"id":"lolin_s3_mini","label":"Wemos LOLIN S3 Mini","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":4,"scanner":true},
  {"id":"adafruit_feather_esp32s3","label":"Adafruit Feather ESP32-S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":4,"scanner":true},
  {"id":"lilygo-t-display-s3","label":"LILYGO T-Display S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":16,"scanner":true},
  {"id":"um_tinys3","label":"Unexpected Maker TinyS3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":8,"scanner":true},
  {"id":"adafruit_itsybitsy_esp32","label":"Adafruit ItsyBitsy ESP32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"adafruit_qtpy_esp32","label":"Adafruit QT Py ESP32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"esp32thing_plus","label":"SparkFun ESP32 Thing Plus","chipFamily":"ESP32","usb":"USB-UART","flashMB":16,"scanner":false},
  {"id":"firebeetle32","label":"DFRobot FireBeetle ESP32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"lolin_d32","label":"Wemos LOLIN D32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"lolin_d32_pro","label":"Wemos LOLIN D32 Pro","chipFamily":"ESP32","usb":"USB-UART","flashMB":16,"scanner":false},
  {"id":"esp32-poe","label":"Olimex ESP32-POE","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"esp32-poe-iso","label":"Olimex ESP32-POE-ISO","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"heltec_wifi_kit_32","label":"Heltec WiFi Kit 32","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"m5stack-core2","label":"M5Stack Core2","chipFamily":"ESP32","usb":"USB-UART","flashMB":16,"scanner":false},
  {"id":"ttgo-t-beam","label":"LILYGO TTGO T-Beam","chipFamily":"ESP32","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"weactstudio_esp32c3coreboard","label":"WeAct ESP32-C3 CoreBoard","chipFamily":"ESP32-C3","usb":"USB CDC","flashMB":4,"scanner":false},
  {"id":"airm2m_core_esp32c3","label":"AirM2M ESP32-C3 Core","chipFamily":"ESP32-C3","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"esp32-c3-m1i-kit","label":"ESP32-C3-M1I Kit","chipFamily":"ESP32-C3","usb":"USB-UART","flashMB":4,"scanner":false},
  {"id":"adafruit_qtpy_esp32s3_n4r2","label":"Adafruit QT Py ESP32-S3 N4R2","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":4,"scanner":false},
  {"id":"arduino_nano_esp32","label":"Arduino Nano ESP32","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":16,"scanner":false},
  {"id":"m5stack-atoms3","label":"M5Stack ATOM S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":8,"scanner":false},
  {"id":"m5stack-cores3","label":"M5Stack CoreS3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":16,"scanner":false},
  {"id":"lolin_s3","label":"Wemos LOLIN S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":16,"scanner":false},
  {"id":"adafruit_metro_esp32s3","label":"Adafruit Metro ESP32-S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":16,"scanner":false},
  {"id":"dfrobot_firebeetle2_esp32s3","label":"DFRobot FireBeetle 2 ESP32-S3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":16,"scanner":false},
  {"id":"m5stack-stamps3","label":"M5Stack StampS3","chipFamily":"ESP32-S3","usb":"USB CDC","flashMB":8,"scanner":false}
]);
export const SCANNER_BOARDS = Object.freeze(BOARD_CATALOG.filter(b=>b.scanner));
export const getBoard = id => BOARD_CATALOG.find(x => x.id === id) || null;

export function summarizeDecoded(theengs, lc) {
  if (lc) return lc.weight_kg.toFixed(2)+' kg'+(lc.stable?' · stable':' · measuring');
  if (!theengs || typeof theengs !== 'object') return 'Unrecognized RAW';
  const known = [
    ['tempc','°C'],['tempf','°F'],['hum','% RH'],['batt','% battery'],
    ['pres','hPa'],['lux','lx'],['accx','acc X'],['accy','acc Y'],
    ['weight','kg'],['weightkg','kg'],['voltage','V'],['volt','V'],['co2','ppm'],['pm25','µg/m³']
  ];
  const measurements=[];
  for (const [field,unit] of known) {
    const val=theengs[field];if(typeof val==='number' && Number.isFinite(val)) measurements.push(field+': '+val+' '+unit);
  }
  const model=String(theengs.model||theengs.model_id||theengs.brand||'Theengs').slice(0,80);
  return (model+(measurements.length?' · '+measurements.slice(0,4).join(' · '):' · recognized')).slice(0,260);
}

export const MAC_RE = /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i;
export function normalizeAdvertisement(value) {
  if (!value || typeof value !== 'object' || value.type === 'hello') return null;
  const mac = String(value.mac || value.id || '').toUpperCase();
  if (!MAC_RE.test(mac)) return null;
  const hex = (x, max = 512) => {
    const v = String(x || '').replace(/\s/g, '').toUpperCase();
    return v.length <= max && v.length % 2 === 0 && /^[0-9A-F]*$/.test(v) ? v : '';
  };
  const mfg = hex(value.manufacturerdata);
  // Scanner protocol: 2-byte manufacturer ID in LE, then advertisement payload.
  const payload = hex(value.manufacturerpayload) || mfg.slice(4);
  const uuid = String(value.manufacturerid || '').toUpperCase();
  const rssi = Number(value.rssi);
  return {
    id: mac, mac, rssi: Number.isFinite(rssi) ? rssi : null,
    name: String(value.name || '').slice(0, 64),
    manufacturerdata: mfg,
    manufacturerpayload: payload,
    manufacturerid: uuid || (mfg.length >= 4 ? `0x${mfg.slice(2,4)}${mfg.slice(0,2)}` : ''),
    servicedata: hex(value.servicedata),
    servicedatauuid: String(value.servicedatauuid || '').slice(0, 42)
  };
}
export function decodeLC026(frame) {
  if (!frame || !frame.manufacturerid.toUpperCase().endsWith('C0') || frame.manufacturerpayload.length !== 26) return null;
  const b = frame.manufacturerpayload.match(/.{2}/g).map(n => parseInt(n, 16));
  const embedded = b.slice(7, 13).map(n => n.toString(16).padStart(2, '0').toUpperCase()).join(':');
  if (frame.mac !== embedded || b[4] !== 0x0A || b[5] !== 0x01) return null;
  const flags = b[6], stable = Boolean(flags & 1), precision = (flags >> 1) & 3, unit = (flags >> 3) & 3;
  if (unit !== 0 && unit !== 2) return null;
  const divisor = precision === 1 ? 1 : precision === 2 ? 100 : 10;
  const value = ((b[0] << 8) | b[1]) / divisor;
  const kg = unit === 2 ? value * 0.45359237 : value;
  if (kg < 0 || kg > 300) return null;
  return { source: 'SHWM LC026 verified protocol', mac: frame.mac, weight_kg: +kg.toFixed(2), stable, flags, unit: unit === 2 ? 'lb' : 'kg' };
}
export function parseLine(s) {
  let obj;
  try { obj = JSON.parse(s); } catch { return null; }
  if (obj.type === 'hello') return { hello: obj };
  return normalizeAdvertisement(obj);
}
export function toTheengs(frame) {
  return {
    id: frame.mac, mac: frame.mac, rssi: frame.rssi,
    name: frame.name,
    manufacturerdata: frame.manufacturerdata,
    servicedata: frame.servicedata,
    servicedatauuid: frame.servicedatauuid
  };
}
export function espHomeScaleYAML(mac, board='esp32dev') {
  if (!MAC_RE.test(mac) || !getBoard(board)) throw new Error('Unsupported MAC/board');
  return `# SHWM verified LC026 only. Requires ESPHome with BLE tracker support.
# This firmware replaces the temporary scanner on this ESP32.
esphome:
  name: shwm-ble-scale
  friendly_name: SHWM BLE Scale
esp32:
  board: ${board}
  framework:
    type: esp-idf
logger:
api:
  encryption:
    key: !secret api_encryption_key
ota:
  - platform: esphome
    password: !secret ota_password
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
sensor:
  - platform: template
    name: "BLE Scale Weight"
    id: shwm_weight_kg
    unit_of_measurement: "kg"
    accuracy_decimals: 2
    device_class: weight
    state_class: measurement
    update_interval: never
esp32_ble_tracker:
  on_ble_advertise:
    - mac_address:
        - ${mac}
      then:
        - lambda: |-
            for (const auto &entry : x.get_manufacturer_datas()) {
              if ((entry.uuid.uuid16() & 0xFF) != 0xC0) continue;
              const auto &d = entry.data;
              if (d.size() != 13 || d[4] != 0x0A || d[5] != 0x01) continue;
              const uint8_t flags = d[6];
              if (!(flags & 0x01)) continue;
              uint64_t embedded_mac = 0;
              for (int i = 7; i < 13; ++i) embedded_mac =
                (embedded_mac << 8) | d[i];
              if (embedded_mac != x.address_uint64()) continue;
              const uint16_t raw = (uint16_t(d[0]) << 8) | d[1];
              const uint8_t unit = (flags >> 3) & 0x03;
              const uint8_t precision = (flags >> 1) & 0x03;
              const float divisor = precision == 1 ? 1.0f :
                  precision == 2 ? 100.0f : 10.0f;
              const float value = raw / divisor;
              const float kg = unit == 0 ? value :
                  unit == 2 ? value * 0.45359237f : -1.0f;
              if (kg < 5.0f || kg > 300.0f) continue;
              static uint32_t last_ms = 0;
              static float last_kg = -1.0f;
              const uint32_t now = millis();
              if (last_ms && (uint32_t)(now - last_ms) < 3000 &&
                  fabsf(kg - last_kg) < 0.01f) continue;
              last_ms = now;
              last_kg = kg;
              id(shwm_weight_kg).publish_state(kg);
            }
`;
}