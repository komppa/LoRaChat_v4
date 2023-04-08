#include <SPIFFS.h>
#include <ESPAsyncWebServer.h>


void add_frontend_routes(AsyncWebServer *server) {

    server->serveStatic("/", SPIFFS, "/index.html").setCacheControl("max-age=86400");
    server->serveStatic("/index.html", SPIFFS, "/index.html").setCacheControl("max-age=86400");

    // What files I have? Endpoit to tell that out, for slow loader (web/public/index.html)
    server->serveStatic("/asset-manifest.json", SPIFFS, "/asset-manifest.json").setCacheControl("max-age=86400");
    server->serveStatic("/manifest.json", SPIFFS, "/manifest.json").setCacheControl("max-age=86400");
    server->serveStatic(CSS_PATH, SPIFFS, CSS).setCacheControl("max-age=86400");

    #if JS_COUNT >= 1
        server->serveStatic(JS_PATH_1, SPIFFS, JS_1).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 2
        server->serveStatic(JS_PATH_2, SPIFFS, JS_2).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 3
        server->serveStatic(JS_PATH_3, SPIFFS, JS_3).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 4
        server->serveStatic(JS_PATH_4, SPIFFS, JS_4).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 5
        server->serveStatic(JS_PATH_5, SPIFFS, JS_5).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 6
        server->serveStatic(JS_PATH_6, SPIFFS, JS_6).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 7
        server->serveStatic(JS_PATH_7, SPIFFS, JS_7).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 8
        server->serveStatic(JS_PATH_8, SPIFFS, JS_8).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 9
        server->serveStatic(JS_PATH_9, SPIFFS, JS_9).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 10
        server->serveStatic(JS_PATH_10, SPIFFS, JS_10).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 11
        server->serveStatic(JS_PATH_11, SPIFFS, JS_11).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 12
        server->serveStatic(JS_PATH_12, SPIFFS, JS_12).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 13
        server->serveStatic(JS_PATH_13, SPIFFS, JS_13).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 14
        server->serveStatic(JS_PATH_14, SPIFFS, JS_14).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 15
        server->serveStatic(JS_PATH_15, SPIFFS, JS_15).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 16
        server->serveStatic(JS_PATH_16, SPIFFS, JS_16).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 17
        server->serveStatic(JS_PATH_17, SPIFFS, JS_17).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 18
        server->serveStatic(JS_PATH_18, SPIFFS, JS_18).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 19
        server->serveStatic(JS_PATH_19, SPIFFS, JS_19).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 20
        server->serveStatic(JS_PATH_20, SPIFFS, JS_20).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 21
        server->serveStatic(JS_PATH_21, SPIFFS, JS_21).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 22
        server->serveStatic(JS_PATH_22, SPIFFS, JS_22).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 23
        server->serveStatic(JS_PATH_23, SPIFFS, JS_23).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 24
        server->serveStatic(JS_PATH_24, SPIFFS, JS_24).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 25
        server->serveStatic(JS_PATH_25, SPIFFS, JS_25).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 26
        server->serveStatic(JS_PATH_26, SPIFFS, JS_26).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 27
        server->serveStatic(JS_PATH_27, SPIFFS, JS_27).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 28
        server->serveStatic(JS_PATH_28, SPIFFS, JS_28).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 29
        server->serveStatic(JS_PATH_29, SPIFFS, JS_29).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 30
        server->serveStatic(JS_PATH_30, SPIFFS, JS_30).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 31
        server->serveStatic(JS_PATH_31, SPIFFS, JS_31).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 32
        server->serveStatic(JS_PATH_32, SPIFFS, JS_32).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 33
        server->serveStatic(JS_PATH_33, SPIFFS, JS_33).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 34
        server->serveStatic(JS_PATH_34, SPIFFS, JS_34).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 35
        server->serveStatic(JS_PATH_35, SPIFFS, JS_35).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 36
        server->serveStatic(JS_PATH_36, SPIFFS, JS_36).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 37
        server->serveStatic(JS_PATH_37, SPIFFS, JS_37).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 38
        server->serveStatic(JS_PATH_38, SPIFFS, JS_38).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 39
        server->serveStatic(JS_PATH_39, SPIFFS, JS_39).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 40
        server->serveStatic(JS_PATH_40, SPIFFS, JS_40).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 41
        server->serveStatic(JS_PATH_41, SPIFFS, JS_41).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 42
        server->serveStatic(JS_PATH_42, SPIFFS, JS_42).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 43
        server->serveStatic(JS_PATH_43, SPIFFS, JS_43).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 44
        server->serveStatic(JS_PATH_44, SPIFFS, JS_44).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 45
        server->serveStatic(JS_PATH_45, SPIFFS, JS_45).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 46
        server->serveStatic(JS_PATH_46, SPIFFS, JS_46).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 47
        server->serveStatic(JS_PATH_47, SPIFFS, JS_47).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 48
        server->serveStatic(JS_PATH_48, SPIFFS, JS_48).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 49
        server->serveStatic(JS_PATH_49, SPIFFS, JS_49).setCacheControl("max-age=86400");
    #endif
    #if JS_COUNT >= 50
        server->serveStatic(JS_PATH_50, SPIFFS, JS_50).setCacheControl("max-age=86400");
    #endif
    
}