/* 
    LoRa Chat v4
    https://github.com/komppa/LoRaChat_v4
*/


#include <WiFi.h>
#include <WiFiClient.h>
#include <Adafruit_SSD1306.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>


#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)


Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
AsyncWebServer server(80);


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


void setup(void) {

    Serial.begin(115200);

    display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
    display.clearDisplay();
    display.setTextColor(WHITE);
    display.setTextSize(1);

    display.drawChar(0, 10, 'a', WHITE, 0, 1); // Drawing the character 'a' at (x, y) position with color WHITE and size 1
    display.display();
    display.drawChar(0, 30, 'c', WHITE, 0, 1);

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

    server.begin();
    Serial.println("HTTP server started (http://localhost:8180)");
    
}


void loop(void) {
    delay(10);
}