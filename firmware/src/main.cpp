/* 
    LoRa Chat v4
    https://github.com/komppa/LoRaChat_v4
*/


#include <WiFi.h>
#include <WiFiClient.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "heltec.h"
#include <SPIFFS.h>
#include <FS.h>
#include "config.h"
#include "frontend_routes.h"


#define SCREEN_WIDTH                128     // OLED display width, in pixels
#define SCREEN_HEIGHT               64      // OLED display height, in pixels
#define OLED_RESET                  -1      // Reset pin # (or -1 if sharing Arduino reset pin)

#define BAND                        868E6   //you can set band here directly,e.g. 868E6,915E6,433E6

#define NODE_ID                     "LoRa Chat node 1"
#define DEFAULT_WIFI_PASSWORD       "123456789"


AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

Preferences preferences;


void sendLoRa(String payload) {
    #ifdef SIMULATION
    Serial.println("Sending: " + String(payload));
    #else
    LoRa.beginPacket();
    LoRa.print(payload);
    LoRa.endPacket();
    LoRa.receive();
    #endif
}

void onLoRaReceive(int packetSize) {

    String packet = "";

    #ifdef SIMULATION
    // Since we cannot use LoRa to receive, we use
    // serial to receive the message
    while (Serial.available())
    {
        packet += (char) Serial.read();
    }
    Serial.println("Received packet from Serial: " + String(packet));

    #else
    // We are using a real hardware, use LoRa to receive
    while (LoRa.available())
    {
        packet += (char) LoRa.read();
    }

    Serial.println("Received packet from LoRa: " + String(packet));
    // TODO use rssi
    // rssi = String(LoRa.packetRssi(), DEC);
    #endif

    // Check if the received packet is a JSON packet
    StaticJsonDocument<1024> jsonDoc;

    DeserializationError error = deserializeJson(jsonDoc, packet);

    if (error) {
        Serial.println("Failed to parse JSON message from LoRa");
        return;
    }

    // Check the type of the JSON message
    if (jsonDoc.containsKey("type") && jsonDoc["type"].as<String>() == "message") {
        // This is a message, send it to the WebSocket clients
        // Currently, this is done straight away, but it should be converted
        // from custom LoRa packet to JSON message in the future
        ws.textAll(packet);
    } else if (jsonDoc.containsKey("type") && jsonDoc["type"].as<String>() == "hb") {
        ws.textAll(packet);
    } else {
        Serial.println("Unknown JSON message type");
    }

}

void sendLoRaMessageOut(String from, String to, String content) {

    DynamicJsonDocument jsonDoc(1024);
    jsonDoc["type"] = "message";
    jsonDoc["data"]["from"] = from;
    jsonDoc["data"]["to"] = to;
    jsonDoc["data"]["content"] = content;

    String jsonResponse;
    serializeJson(jsonDoc, jsonResponse);

    sendLoRa(jsonResponse);

}

void sendLoRaActiveUserOut(String username) {

    DynamicJsonDocument jsonDoc(1024);
    JsonArray users = jsonDoc.createNestedArray("data");

    jsonDoc["type"] = "hb";

    // TODO now only the one username is sent out in an array
    // but in the future, all the active users should be sent out
    users.add(username);

    String jsonResponse;
    serializeJson(jsonDoc, jsonResponse);

    sendLoRa(jsonResponse);

}


/**
 * Handle received message from WebSocket.
 * 
*/
void handleWsReceivedMessage(AsyncWebSocketClient *client, uint8_t *data, size_t len) {

    DynamicJsonDocument jsonDoc(1024);
    DeserializationError error = deserializeJson(jsonDoc, data, len);

    // Check for deserialization errors
    if (error) {
        Serial.println("Failed to parse JSON message from WebSocket");
        return;
    }

    // Check whether the received payload is a heartbeat message
    // over WebSocket from the user interface
    if (jsonDoc.containsKey("type") && jsonDoc["type"].as<String>() == "hb") {
        // Check if the JSON object has the "data" property
        if (jsonDoc.containsKey("data")) {
            // Print the "data" property to the Serial output
            String username = jsonDoc["data"].as<String>();
            
            sendLoRaActiveUserOut(username);
            
        } else {
            Serial.println("JSON message does not contain the 'data' property");
        }

        return;
    }

    // Check whether the received payload is a new message from the user
    if (jsonDoc.containsKey("type") && jsonDoc["type"].as<String>() == "message") {
        // Check if the JSON object has the "data" property
        if (jsonDoc.containsKey("data")) {

            // Correct message includes from, to and content properties
            if (jsonDoc["data"].containsKey("from") && jsonDoc["data"].containsKey("to") && jsonDoc["data"].containsKey("content")) {
                
                String from = jsonDoc["data"]["from"].as<String>();
                String to = jsonDoc["data"]["to"].as<String>();
                String content = jsonDoc["data"]["content"].as<String>();

                Serial.println("Received message from: " + from + ", to: " + to + ", content: " + content);

                // Send the message to the other node
                sendLoRaMessageOut(from, to, content);

            } else {
                Serial.println("JSON message does not contain the 'from', 'to' or 'content' property");
            }
        } else {
            Serial.println("JSON message does not contain the 'data' property");
        }

        return;
    }

    Serial.println("Received message over WebSocket but it is not a message or heartbeat message. Dropping it out.");

}

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {

    if (type == WS_EVT_CONNECT) {

        Serial.printf("Client connected: %u\n", client->id());

    } else if (type == WS_EVT_DATA) {

        handleWsReceivedMessage(client, data, len);

    } else if (type == WS_EVT_DISCONNECT) {

        Serial.printf("Client disconnected: %u\n", client->id());

    }
    
}


void setup(void) {

    Heltec.begin(
        true,   // DisplayEnable Enable
        #ifdef SIMULATION
        // On simulator, do no use LoRa
        false,   // LoRa Disable on simulator
        #else
        true,   // LoRa Enable
        #endif
        true,   // Serial Enable
        true,   // LoRa use PABOOST
        BAND    // LoRa RF working band
    );

    Heltec.display->clear();
    Heltec.display->drawString(0, 0, "Starting");
    Heltec.display->drawString(0, 10, NODE_ID);
    Heltec.display->display();


    init_preferences(&preferences);
    parametrization_mode(wait_configuration_mode(), &preferences);


    #ifdef SIMULATION
    Serial.println("You are using the simulator");
    #else
    Serial.println("You are using the real hardware");
    #endif

    Heltec.display->clear();
    Heltec.display->drawString(0 ,0 ,"Welcome to LoRa Chat!");
    Heltec.display->display();
    
    if (!SPIFFS.begin(true)) {
        Serial.println("An error occurred while mounting SPIFFS");
        return;
    }

    #ifdef SIMULATION

    // To use wokwi gateway for testing API calls,
    // use the following Wokwi-GUEST network instead
    // of your own WiFi network
    WiFi.begin("Wokwi-GUEST", "", 6);
    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.println("Connecting to Wokwi-GUEST network...");
    }

    #else

    if (preferences.getBool("WIFI_MODE_AP", true) == false) {
        
        Serial.println("Node WiFi is in STATION mode");
        Heltec.display->clear();
        Heltec.display->drawString(0 ,0 ,"Node WiFi is in STATION mode");
        Heltec.display->display();

        if (preferences.getString("WIFI_SSID", "") == "") {
            Serial.println("WARNING: No WiFi SSID configured but WiFi mode is set to STATION");
        }

        WiFi.begin(preferences.getString("WIFI_SSID", "").c_str(), preferences.getString("WIFI_PASS", "").c_str());
        // Wait for connection
        while (WiFi.status() != WL_CONNECTED) {
            Serial.println("Waiting connection to WiFi network " + String(preferences.getString("WIFI_SSID", "").c_str()));
            delay(100);
        }

        Heltec.display->clear();
        Heltec.display->drawString(0, 0, "Connected to WiFi " + String(preferences.getString("WIFI_SSID", "")));
        Heltec.display->drawString(0, 10, String(WiFi.localIP().toString()));
        Heltec.display->display();
        
    } else {

        Serial.println("Node WiFi is in ACCESS POINT mode");
        Heltec.display->clear();
        Heltec.display->drawString(0 ,0 ,"Node WiFi is in ACCESS POINT mode");
        Heltec.display->display();

        if (preferences.getString("WIFI_SSID", "") == "") {
            Serial.println("WARNING: No WiFi SSID configured. Using default SSID (nodeID) for AP mode");
        }

        WiFi.softAP(preferences.getString("WIFI_SSID", NODE_ID).c_str(), preferences.getString("WIFI_PASS", DEFAULT_WIFI_PASSWORD).c_str());

    }
    
    #endif  // SIMULATION WiFi

    add_frontend_routes(&server);
    
    // WebSocket endpoint handler
    ws.onEvent(onWsEvent);
    server.addHandler(&ws);

    // Start web server
    server.begin();

    // If read hardware is used, the interrupt is attached
    // for LoRa receive. Start also receiving LoRa messages.
    #ifndef SIMULATION
        LoRa.onReceive(onLoRaReceive);
        LoRa.receive();
    #endif

}


void loop(void) {
    delay(10);
}