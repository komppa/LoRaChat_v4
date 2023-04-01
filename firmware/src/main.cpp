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


#define SCREEN_WIDTH        128     // OLED display width, in pixels
#define SCREEN_HEIGHT       64      // OLED display height, in pixels
#define OLED_RESET          -1      // Reset pin # (or -1 if sharing Arduino reset pin)

#define BAND                868E6   //you can set band here directly,e.g. 868E6,915E6,433E6

#define NODE_ID             "LoRa Chat node 1"
#define WIFI_PASSWORD       "123456789"


AsyncWebServer server(80);
AsyncWebSocket ws("/ws");


String indexHtml() {
    String response = R"(
        <html>
            <head>
                <title>LoRaChat</title>
            </head>
            <body>
                <h1>Welcome to LoRa Chat!</h1>
            </body>
        </html>
    )";
    return response;
}


void send(String payload) {
    #ifdef SIMULATION
    Serial.println("Sending: " + String(payload));
    #else
    LoRa.beginPacket();
    LoRa.print(payload);
    LoRa.endPacket();
    LoRa.receive();
    #endif
}

void onReceive(int packetSize) {

    String packet = "";
    String packSize = "";

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
}

void sendMessageOut(String message) {
    // Create a new JSON document and add the message payload
    // into it under data property. The output will look like this:
    // {
    //     "type": "message",
    //     "data": messagePayload
    // }

    Serial.println("@sendMessageOut: " + String(message));
    // Send JSON response over LoRa
    // TODO LORA
    // jsonResponse
}

void sendActiveUserOut(String username) {
    // Prepare JSON response
    DynamicJsonDocument jsonDoc(1024);
    jsonDoc["type"] = "activeusers";
    jsonDoc["data"] = username;

    String jsonResponse;
    serializeJson(jsonDoc, jsonResponse);

    Serial.println("@sendActiveUserOut: " + String(jsonResponse));

    // Send JSON response over LoRa
    // TODO LORA
    // jsonResponse
}

void handleReceivedMessage(AsyncWebSocketClient *client, uint8_t *data, size_t len) {

    DynamicJsonDocument jsonDoc(1024);
    DeserializationError error = deserializeJson(jsonDoc, data, len);

    // Check for deserialization errors
    if (error) {
        Serial.println("Failed to parse JSON message");
        return;
    }

    // Check whether the received payload is a heartbeat message
    if (jsonDoc.containsKey("type") && jsonDoc["type"].as<String>() == "heartbeat") {
        // Check if the JSON object has the "data" property
        if (jsonDoc.containsKey("data")) {
            // Print the "data" property to the Serial output
            String username = jsonDoc["data"].as<String>();
            
            sendActiveUserOut(username);
            
        } else {
            Serial.println("JSON message does not contain the 'data' property");
        }
    } else {
        Serial.println("JSON message is not of type 'connection'");
    }

    // Check whether the received payload is a new message from the user
    if (jsonDoc.containsKey("type") && jsonDoc["type"].as<String>() == "message") {
        // Check if the JSON object has the "data" property
        if (jsonDoc.containsKey("data")) {
            
            String outputString;
            serializeJson(jsonDoc, outputString);


            sendMessageOut(outputString);
            
        } else {
            Serial.println("JSON message does not contain the 'data' property");
        }
    } else {
        Serial.println("JSON message is not of type 'connection'");
    }

}

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
    if (type == WS_EVT_CONNECT) {

        Serial.printf("Client connected: %u\n", client->id());

        // Prepare JSON response
        DynamicJsonDocument jsonDoc(1024);
        jsonDoc["message"] = " 123 Welcome to LoRa Chat WebSocket server!";

        String jsonResponse;
        serializeJson(jsonDoc, jsonResponse);

        // Send JSON response to the connected client
        client->text(jsonResponse);
    } else if (type == WS_EVT_DATA) {
        handleReceivedMessage(client, data, len);
    } else if (type == WS_EVT_DISCONNECT) {
        Serial.printf("Client disconnected: %u\n", client->id());
    }
}

void serveFile(AsyncWebServerRequest *request, const char *contentType, const uint8_t *content, size_t contentLength) {
    AsyncWebServerResponse *response = request->beginResponse_P(200, contentType, content, contentLength);
    response->addHeader("Content-Encoding", "gzip");
    request->send(response);
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
    }
    #else
    const char* ssid     = NODE_ID;
    const char* password = WIFI_PASSWORD;
    WiFi.softAP(ssid, password);

    Serial.println();
    Heltec.display->clear();
    Heltec.display->drawString(0 ,0 ,String(WiFi.localIP().toString()));
    Heltec.display->display();
    
    #endif

    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists("/index.html")) {
            request->send(SPIFFS, "/index.html", "text/html");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on("/index.html", HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists("/index.html")) {
            request->send(SPIFFS, "/index.html", "text/html");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on("/manifest.json", HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists("/manifest.json")) {
            request->send(SPIFFS, "/manifest.json", "text/json");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on(MAIN_CSS_PATH, HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(MAIN_CSS)) {
            request->send(SPIFFS, MAIN_CSS, "text/css");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on(MAIN_JS_PATH, HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(MAIN_JS)) {
            request->send(SPIFFS, MAIN_JS, "text/javascript");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on(CHUNK_JS_PATH_1, HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(CHUNK_JS_1)) {
            request->send(SPIFFS, CHUNK_JS_1, "text/javascript");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on(CHUNK_JS_PATH_2, HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(CHUNK_JS_2)) {
            request->send(SPIFFS, CHUNK_JS_2, "text/javascript");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    server.on(CHUNK_JS_PATH_3, HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(CHUNK_JS_3)) {
            request->send(SPIFFS, CHUNK_JS_3, "text/javascript");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });

    // WebSocket endpoint handler
    ws.onEvent(onWsEvent);
    server.addHandler(&ws);

    // Start web server
    server.begin();

    // If read hardware is used, the interrupt is attached
    // for LoRa receive. Start also receiving LoRa messages.
    #ifndef SIMULATION
        LoRa.onReceive(onReceive);
        LoRa.receive();
    #endif

}


void loop(void) {
    delay(10);
}