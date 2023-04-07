#include "config.h"
#include <Arduino.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include "heltec.h"


// If no activity in 3 seconds, timeout
int parametrization_timeout = 3000;


int init_preferences(Preferences *preferences) {
    // Open on read/write mode
    preferences->begin("lrc", false);
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
                // Correct magic word received to start parametrization mode
                parametrization_mode = true;
                break;
            }
        }
    }

    return parametrization_mode;

}

void parametrization_mode(bool in_parametrization_mode, Preferences *preferences) {

    if (parametrization_mode) {

        Serial.println("Entering parametrization mode...");

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

                    if (strcmp(type, "boolean") == 0) {
                        bool val = strcmp(value, "true") == 0 ? true : false;
                        preferences->putBool(key, val);
                    }
                    if (strcmp(type, "string") == 0) {
                        preferences->putString(key, value);
                    }
                }
            }
        }

        Serial.println("Parametrization mode timeout. Exiting...");
    }
    
}