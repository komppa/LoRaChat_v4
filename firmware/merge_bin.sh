#!/bin/sh

esptool.py --chip ESP32 merge_bin -o merged-flash.bin --flash_mode dio --flash_size 8MB 0x1000 .pio/build/wokwi_simulation/bootloader.bin 0x8000 .pio/build/wokwi_simulation/partitions.bin 0x10000 .pio/build/wokwi_simulation/firmware.bin 0x310000 ./spiffs.bin