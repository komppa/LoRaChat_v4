#include "config.h"
#include <Arduino.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include "heltec.h"


// If no activity in 3 seconds, when in param mode - timeout
int parametrization_timeout = 3 * 60 * 1000;

ConfigurableParameter parameters[3];
size_t parameterCount = sizeof(parameters) / sizeof(ConfigurableParameter);


int init_preferences(Preferences *preferences) {

    // Open on read/write mode
    preferences->begin("lrc", false);

    if (!preferences->isKey("WIFI_MODE_AP")) {
        preferences->putBool("WIFI_MODE_AP", true);
    }

    if (!preferences->isKey("WIFI_SSID")) {
        preferences->putString("WIFI_SSID", "wifi_ssid");
    }

    if (!preferences->isKey("WIFI_PASS")) {
        preferences->putString("WIFI_PASS", "wifi_password");
    }

    


    bool wifi_mode_ap = preferences->getBool("WIFI_MODE_AP", true);
    parameters[0] = {"boolean", "WIFI_MODE_AP", wifi_mode_ap ? "true" : "false"};

    String wifi_ssid = preferences->getString("WIFI_SSID", "wifi_ssid");
    parameters[1] = {"string", "WIFI_SSID", wifi_ssid};

    String wifi_password = preferences->getString("WIFI_PASS", "wifi_password");
    parameters[2] = {"string", "WIFI_PASS", wifi_password};

    return 0;
}


bool wait_configuration_mode() {

    unsigned long start_time = millis();
    String received_data = "";
    bool parametrization_mode = false;

    // Param PC must send "NOT_MY_CAT" to start parametrization mode
    // in 3 seconds
    while(millis() - start_time < 3000) {
        if (Serial.available()) {
            received_data += (char)Serial.read();
            if (received_data == "NOT_MY_CAT") {
                received_data = "";
                // Correct magic word received to start parametrization mode
                parametrization_mode = true;
                break;
            }
        }
    }

    return parametrization_mode;

}


void printParameters(const ConfigurableParameter parameters[], size_t parameterCount) {

    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    for (size_t i = 0; i < parameterCount; i++) {
        JsonObject item = array.createNestedObject();
        item["type"] = parameters[i].type;
        item["key"] = parameters[i].key;
        item["value"] = parameters[i].value;
    }

    serializeJson(array, Serial);
    Serial.println();

}


void parametrization_mode(bool in_parametrization_mode, Preferences *preferences) {

    if (in_parametrization_mode) {

        printParameters(parameters, parameterCount);

        Heltec.display->clear();
        Heltec.display->drawString(0, 0, "Connected to the PC");
        Heltec.display->drawString(0, 10, "Waiting parameters...");
        Heltec.display->display();

        unsigned long start_time = millis();
        while (millis() - start_time < parametrization_timeout) {
            if (Serial.available()) {

                // Reset timeout if new data is received
                start_time = millis();

                // Read and parse JSON input
                String received_json = Serial.readString();
                Serial.println(received_json);
                StaticJsonDocument<1024> doc;
                deserializeJson(doc, received_json);

                JsonArray array = doc.as<JsonArray>();
                for (JsonObject item : array) {

                    String type = item["type"];
                    String key = item["key"];
                    String value = item["value"];

                    // Find the parameter with the matching key
                    for (size_t i = 0; i < parameterCount; i++) {
                        if (parameters[i].key == key) {

                            if (type == "boolean") {
                                bool val = value == "true" ? true : false;
                                preferences->putBool(key.c_str(), val);
                                parameters[i].value = val ? "true" : "false";
                            }

                            if (type == "string") {
                                preferences->putString(key.c_str(), value.c_str());
                                parameters[i].value = value;
                            }

                            break;
                        }
                    } 
                }
            }
        }

        Serial.println("Parametrization mode timeout. Exiting...");
    }
    
}