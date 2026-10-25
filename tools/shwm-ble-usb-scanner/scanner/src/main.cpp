// SHWM BLE USB Scanner 0.5 -- GPL-3.0-or-later.
// No Wi-Fi, vendor/cloud accounts, pairing, connection or GATT operations.
// Outputs one advertisement per JSON line at 115200 baud over USB serial.
#include <Arduino.h>
#include <NimBLEDevice.h>
#include <string>

static constexpr uint32_t SCAN_MS = 30000;
static volatile bool scanRequested = false;
static uint32_t lastHello = 0;

static void sayHello() {
  Serial.println(F("{\"type\":\"hello\",\"firmware\":\"SHWM BLE USB Scanner\",\"version\":\"0.5.0\",\"baud\":115200}"));
  lastHello = millis();
}


static String asHex(const std::string &bytes, size_t from = 0) {
  static constexpr char digits[] = "0123456789ABCDEF";
  String result;
  result.reserve((bytes.size() - (from > bytes.size() ? bytes.size() : from)) * 2);
  for (size_t i = from; i < bytes.size(); ++i) {
    const uint8_t v = static_cast<uint8_t>(bytes[i]);
    result += digits[v >> 4]; result += digits[v & 15];
  }
  return result;
}

static String jsonSafe(const std::string &src) {
  String result;
  for (const unsigned char ch : src) {
    if (ch == '"' || ch == '\\') { result += '\\'; result += (char)ch; }
    else if (ch >= 0x20 && ch <= 0x7e) result += (char)ch;
  }
  return result;
}

class ScanCallbacks : public NimBLEScanCallbacks {
  void onResult(const NimBLEAdvertisedDevice* dev) override {
    const std::string mac = dev->getAddress().toString();
    // Suppress overly chatty beacons without hiding normal measurement updates.
    static uint32_t seenAt[64] = {0};
    unsigned int hash = 2166136261u;
    for (unsigned char ch : mac) hash = (hash ^ ch) * 16777619u;
    const uint8_t slot = hash % 64;
    const uint32_t now = millis();
    if (seenAt[slot] && now - seenAt[slot] < 250) return;
    seenAt[slot] = now;
    const std::string name = dev->haveName() ? dev->getName() : "";
    const std::string manufacturer = dev->haveManufacturerData() ? dev->getManufacturerData() : "";
    const std::string service = dev->haveServiceData() ? dev->getServiceData() : "";
    const std::string suuid = dev->haveServiceData() ? dev->getServiceDataUUID().toString() : "";
    // Limit every JSON line and avoid vendor device names injecting terminal control chars.
    Serial.print(F("{\"type\":\"adv\",\"mac\":\"")); Serial.print(mac.c_str());
    Serial.print(F("\",\"rssi\":")); Serial.print(dev->getRSSI());
    Serial.print(F(",\"name\":\"")); Serial.print(jsonSafe(name));
    Serial.print(F("\",\"manufacturerdata\":\"")); Serial.print(asHex(manufacturer));
    Serial.print(F("\",\"manufacturerpayload\":\"")); Serial.print(asHex(manufacturer, 2));
    Serial.print(F("\",\"manufacturerid\":\""));
    if (manufacturer.size() >= 2) {
      const auto lo = (uint8_t)manufacturer[0];
      const auto hi = (uint8_t)manufacturer[1];
      char id[7]; snprintf(id, sizeof(id), "0x%04X", (hi << 8) | lo);
      Serial.print(id);
    }
    Serial.print(F("\",\"servicedata\":\"")); Serial.print(asHex(service));
    Serial.print(F("\",\"servicedatauuid\":\"")); Serial.print(jsonSafe(suuid));
    Serial.println(F("\"}"));
  }
  void onScanEnd(const NimBLEScanResults&, int) override {
    if (scanRequested) NimBLEDevice::getScan()->start(SCAN_MS, false, true);
  }
} callbacks;

void setup() {
  Serial.begin(115200);
  delay(1500);
  NimBLEDevice::init("");
  NimBLEScan* scanner = NimBLEDevice::getScan();
  scanner->setScanCallbacks(&callbacks, true);
  scanner->setActiveScan(true);
  scanner->setMaxResults(0);
  scanner->setInterval(100);
  scanner->setWindow(90);
  sayHello(); // Scan starts ONLY after the browser sends SCAN.
}

void loop() {
  static char command[20] = {0};
  static size_t used = 0;
  while (Serial.available() > 0) {
    const char ch = (char)Serial.read();
    if (ch == '\n' || ch == '\r') {
      if (!used) continue;
      command[used] = '\0';
      if (strcmp(command, "PING") == 0) {
        sayHello();
      } else if (strcmp(command, "SCAN") == 0) {
        scanRequested = true;
        NimBLEDevice::getScan()->start(SCAN_MS, false, true);
        Serial.println(F("{\"type\":\"scan_state\",\"state\":\"scanning\"}"));
      } else if (strcmp(command, "STOP") == 0) {
        scanRequested = false;
        NimBLEDevice::getScan()->stop();
        Serial.println(F("{\"type\":\"scan_state\",\"state\":\"stopped\"}"));
      } else {
        Serial.println(F("{\"type\":\"scan_state\",\"state\":\"error\",\"reason\":\"unknown_command\"}"));
      }
      used = 0;
    } else if (used < sizeof(command) - 1 && ch >= 0x20 && ch <= 0x7e) {
      command[used++] = ch;
    } else {
      used = 0; // Reject malformed or overlong commands.
    }
  }
  if (!scanRequested && (uint32_t)(millis() - lastHello) >= 2500) sayHello();
  delay(20);
}
