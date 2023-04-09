#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <Preferences.h>
#include <ArduinoJson.h>
#include "heltec.h"


struct ConfigurableParameter {
    const char *type;
    const char *key;
    String value;
};


int init_preferences(Preferences *preferences);
bool wait_configuration_mode();
void parametrization_mode(bool in_parametrization_mode, Preferences *preferences);

#endif  // CONFIG_H