/* 
    LoRa Chat v4
    https://github.com/komppa/LoRaChat_v4
*/


#include <WiFi.h>
#include <WiFiClient.h>
#include <Adafruit_SSD1306.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>


#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)


Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
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

void sendMessageOut(String message) {
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
            // Print the "data" property to the Serial output
            String message = jsonDoc["data"].as<String>();

            sendMessageOut(message);
            
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


void setup(void) {

    Serial.begin(115200);

    // display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
    // display.clearDisplay();
    // display.setTextColor(WHITE);
    // display.setTextSize(1);

    // display.drawChar(0, 10, 'a', WHITE, 0, 1); // Drawing the character 'a' at (x, y) position with color WHITE and size 1
    // display.display();
    // display.drawChar(0, 30, 'c', WHITE, 0, 1);

    // To use wokwi gateway for testing API calls,
    // use the following Wokwi-GUEST network instead
    // of your own WiFi network
    WiFi.begin("Wokwi-GUEST", "", 6);
    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
    }

    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(200, "text/html", indexHtml());
    });

    ws.onEvent(onWsEvent);
    server.addHandler(&ws);

    server.begin();
    Serial.println("HTTP server started (http://localhost:8180)");
    
}


void loop(void) {
    delay(10);
}