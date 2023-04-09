#include "config.h"
#include <Arduino.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include "heltec.h"


// If no activity in 3 seconds, timeout
int parametrization_timeout = 3000;

ConfigurableParameter parameters[3];
size_t parameterCount = sizeof(parameters) / sizeof(ConfigurableParameter);


int init_preferences(Preferences *preferences) {

    // Open on read/write mode
    preferences->begin("lrc", false);

    // Initialize the parameters array
    parameters[0] = {"boolean", "WIFI_MODE", preferences->getBool("WIFI_MODE", true) ? "true" : "false"};
    parameters[1] = {"string", "WIFI_SSID", preferences->getString("WIFI_SSID", "myssid")};
    parameters[2] = {"string", "WIFI_PASSWORD", preferences->getString("WIFI_PASSWORD", "mypassword")};

    return 0;

}


bool wait_configuration_mode() {

    unsigned long start_time = millis();
    String received_data = "";
    bool parametrization_mode = false;

    while(millis() - start_time < parametrization_timeout) {
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
                StaticJsonDocument<256> doc;
                deserializeJson(doc, received_json);

                JsonArray array = doc.as<JsonArray>();
                for (JsonObject item : array) {

                    const char *type = item["type"];
                    const char *key = item["key"];
                    const char *value = item["value"];

                    // Find the parameter with the matching key
                    for (size_t i = 0; i < parameterCount; i++) {

                        if (strcmp(parameters[i].key, key) == 0) {

                            if (strcmp(type, "boolean") == 0) {
                                bool val = strcmp(value, "true") == 0 ? true : false;
                                preferences->putBool(key, val);
                                parameters[i].value = val ? "true" : "false";
                            }

                            if (strcmp(type, "string") == 0) {
                                preferences->putString(key, value);
                                parameters[i].value = String(value);
                            }

                            break;

                        } else {
                            Serial.println("Parameter with key \"" + String(parameters[i].key) + "\" not found");
                        }
                    } 
                }
            }
        }

        Serial.println("Parametrization mode timeout. Exiting...");
    }
    
}