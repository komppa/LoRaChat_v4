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

void setupServerRoute(const char* path, const char* filename) {
    server.on(path, HTTP_GET, [filename](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(filename)) {
            request->send(SPIFFS, filename, "text/css");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });
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

    server.on(CSS_PATH, HTTP_GET, [](AsyncWebServerRequest *request) {
        if (SPIFFS.exists(CSS)) {
            request->send(SPIFFS, CSS, "text/css");
        } else {
            request->send(404, "text/plain", "File not found");
        }
    });


    #if JS_COUNT >= 1
    setupServerRoute(JS_PATH_1, JS_1);
    #endif
    #if JS_COUNT >= 2
        setupServerRoute(JS_PATH_2, JS_2);
    #endif
    #if JS_COUNT >= 3
        setupServerRoute(JS_PATH_3, JS_3);
    #endif
    #if JS_COUNT >= 4
        setupServerRoute(JS_PATH_4, JS_4);
    #endif
    #if JS_COUNT >= 5
        setupServerRoute(JS_PATH_5, JS_5);
    #endif
    #if JS_COUNT >= 6
        setupServerRoute(JS_PATH_6, JS_6);
    #endif
    #if JS_COUNT >= 7
        setupServerRoute(JS_PATH_7, JS_7);
    #endif
    #if JS_COUNT >= 8
        setupServerRoute(JS_PATH_8, JS_8);
    #endif
    #if JS_COUNT >= 9
        setupServerRoute(JS_PATH_9, JS_9);
    #endif
    #if JS_COUNT >= 10
        setupServerRoute(JS_PATH_10, JS_10);
    #endif
    #if JS_COUNT >= 11
        setupServerRoute(JS_PATH_11, JS_11);
    #endif
    #if JS_COUNT >= 12
        setupServerRoute(JS_PATH_12, JS_12);
    #endif
    #if JS_COUNT >= 13
        setupServerRoute(JS_PATH_13, JS_13);
    #endif
    #if JS_COUNT >= 14
        setupServerRoute(JS_PATH_14, JS_14);
    #endif
    #if JS_COUNT >= 15
        setupServerRoute(JS_PATH_15, JS_15);
    #endif
    #if JS_COUNT >= 16
        setupServerRoute(JS_PATH_16, JS_16);
    #endif
    #if JS_COUNT >= 17
        setupServerRoute(JS_PATH_17, JS_17);
    #endif
    #if JS_COUNT >= 18
        setupServerRoute(JS_PATH_18, JS_18);
    #endif
    #if JS_COUNT >= 19
        setupServerRoute(JS_PATH_19, JS_19);
    #endif
    #if JS_COUNT >= 20
        setupServerRoute(JS_PATH_20, JS_20);
    #endif
    #if JS_COUNT >= 21
        setupServerRoute(JS_PATH_21, JS_21);
    #endif
    #if JS_COUNT >= 22
        setupServerRoute(JS_PATH_22, JS_22);
    #endif
    #if JS_COUNT >= 23
        setupServerRoute(JS_PATH_23, JS_23);
    #endif
    #if JS_COUNT >= 24
        setupServerRoute(JS_PATH_24, JS_24);
    #endif
    #if JS_COUNT >= 25
        setupServerRoute(JS_PATH_25, JS_25);
    #endif
    #if JS_COUNT >= 26
        setupServerRoute(JS_PATH_26, JS_26);
    #endif
    #if JS_COUNT >= 27
        setupServerRoute(JS_PATH_27, JS_27);
    #endif
    #if JS_COUNT >= 28
        setupServerRoute(JS_PATH_28, JS_28);
    #endif
    #if JS_COUNT >= 29
        setupServerRoute(JS_PATH_29, JS_29);
    #endif
    #if JS_COUNT >= 30
        setupServerRoute(JS_PATH_30, JS_30);
    #endif
    #if JS_COUNT >= 31
        setupServerRoute(JS_PATH_31, JS_31);
    #endif
    #if JS_COUNT >= 32
        setupServerRoute(JS_PATH_32, JS_32);
    #endif
    #if JS_COUNT >= 33
        setupServerRoute(JS_PATH_33, JS_33);
    #endif
    #if JS_COUNT >= 34
        setupServerRoute(JS_PATH_34, JS_34);
    #endif
    #if JS_COUNT >= 35
        setupServerRoute(JS_PATH_35, JS_35);
    #endif
    #if JS_COUNT >= 36
        setupServerRoute(JS_PATH_36, JS_36);
    #endif
    #if JS_COUNT >= 37
        setupServerRoute(JS_PATH_37, JS_37);
    #endif
    #if JS_COUNT >= 38
        setupServerRoute(JS_PATH_38, JS_38);
    #endif
    #if JS_COUNT >= 39
        setupServerRoute(JS_PATH_39, JS_39);
    #endif
    #if JS_COUNT >= 40
        setupServerRoute(JS_PATH_40, JS_40);
    #endif
    #if JS_COUNT >= 41
        setupServerRoute(JS_PATH_41, JS_41);
    #endif
    #if JS_COUNT >= 42
        setupServerRoute(JS_PATH_42, JS_42);
    #endif
    #if JS_COUNT >= 43
        setupServerRoute(JS_PATH_43, JS_43);
    #endif
    #if JS_COUNT >= 44
        setupServerRoute(JS_PATH_44, JS_44);
    #endif
    #if JS_COUNT >= 45
        setupServerRoute(JS_PATH_45, JS_45);
    #endif
    #if JS_COUNT >= 46
        setupServerRoute(JS_PATH_46, JS_46);
    #endif
    #if JS_COUNT >= 47
        setupServerRoute(JS_PATH_47, JS_47);
    #endif
    #if JS_COUNT >= 48
        setupServerRoute(JS_PATH_48, JS_48);
    #endif
    #if JS_COUNT >= 49
        setupServerRoute(JS_PATH_49, JS_49);
    #endif
    #if JS_COUNT >= 50
        setupServerRoute(JS_PATH_50, JS_50);
    #endif
    
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