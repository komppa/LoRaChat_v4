#ifndef FRONTEND_ROUTES_H
#define FRONTEND_ROUTES_H

#include "frontend_routes.h"
#include <SPIFFS.h>
#include <ESPAsyncWebServer.h>


void add_frontend_routes(AsyncWebServer *server);

#endif  // FRONTEND_ROUTES_H