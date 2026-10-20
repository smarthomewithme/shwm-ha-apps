// SHWM BLE USB Scanner 0.2 -- GPL-3.0-or-later.
// No Wi-Fi, vendor/cloud accounts, pairing, connection or GATT operations.
// Outputs one advertisement per JSON line at 115200 baud over USB serial.
#include <Arduino.h>
#include <NimBLEDevice.h>
#include <string>

static constexpr uint32_t SCAN_MS = 30000;

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
    NimBLEDevice::getScan()->start(SCAN_MS, false, true);
  }
} callbacks;

void setup() {
  Serial.begin(115200);
  delay(1500);
  Serial.println(F("{\"type\":\"hello\",\"firmware\":\"SHWM BLE USB Scanner\",\"version\":\"0.2.0\",\"baud\":115200}"));
  NimBLEDevice::init("");
  NimBLEScan* scanner = NimBLEDevice::getScan();
  scanner->setScanCallbacks(&callbacks, true);
  scanner->setActiveScan(true);
  scanner->setMaxResults(0);
  scanner->setInterval(100);
  scanner->setWindow(90);
  scanner->start(SCAN_MS, false, true);
}

void loop() { delay(20); }