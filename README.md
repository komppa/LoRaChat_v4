# LoRaChat

LoRaChat is a project that uses LoRa radios to create a mesh network, allowing you to chat with your friends without relying on traditional communication infrastructure like cellular networks or the internet. LoRaChat is perfect for remote locations, off-grid communication, or just for the fun of building and using a decentralized communication system.

<br></br>
![LoRaChat UI](./images/ui.png)
<br></br>

## Project Structure

This repository consists of two main directories:

- `web`: This directory contains the web-based user interface built with React, which enables users to chat with each other through the LoRaChat network.
- `firmware`: This directory contains the firmware for the microcontroller unit (MCU) with the LoRa radio. The firmware is responsible for creating a Wi-Fi network that users can connect to in order to access the LoRaChat network. It also handles the routing of packets within the mesh network.

## Getting Started

Follow these steps to set up and use LoRaChat:

### Hardware Requirements

- ESP32 with Wi-Fi capabilities (e.g., Heltec ESP32 WiFi LoRa v2)

### Software Requirements

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for building and running the web user interface
- A suitable Integrated Development Environment (IDE) and toolchain for your chosen MCU (but preferrably PlatformIO)

### Setup

Clone this repository to your local machine.

```bash
git clone https://github.com/komppa/LoRaChat_v4.git
```

Navigate to the firmware directory.
Compile and upload the firmware to your MCU.

## Running the Web User Interface on your local machine

Navigate to the web directory.

```bash
cd LoRaChat/web
```

Install the required dependencies.

```bash
npm install
```

Start the UI development server.
```bash
npm run start
```

Open your browser and navigate to http://localhost:3000 to access the web user interface.
Connect to the Wi-Fi network created by the LoRaChat firmware, and start chatting with your friends!

## Compilating the firmware

Navigate to the firmware directory.

```bash
cd LoRaChat/firmware
```

Install the required dependencies.

```bash
platformio run -e heltec                    # For compiling real hardware
platformio run -e wokwi_simulation          # For compiling Wokwi simulator
```

## Merging frontend build to firmware

Convert react app build files to correct format using _build_flag_setter.py_ script that can be found at firmware directory.

```bash
python3 build_flag_setter.py
```

This script flattens the CRA build directory to be one dimensional directory (no child folders). The script also sets built javascript and possible css files to be merged to platformio.ini file as build flags to be used to serve the files from SPIFFS.

The script counts needed static endpoints and sets the correct number to the platformio.ini file. In that way, the precompailer knows how many endpoints should be compiled in to the firmware. 

## Custom parition table

The device uses custom partition table (firmware/_partition_table.csv_) to get rid of OTA possibility to save space. The custom partition table allows firmware and file system to be large enough to fit the firmware itself and the react app build files.  

## Creating file system (SPIFFS) binary

The device uses SPIFFS file system to serve the react app build files. The file system is created using ESP IDF's spiffsgen.py script. The script is run inside docker container that has ESP IDF installed. The script is run with the following command:

To create the file system binary, run the following command in the web directory:

```bash
# Using docker
docker run --rm -v $PWD:/project -w /project espressif/idf python /opt/esp/idf/components/spiffs/spiffsgen.py 4194304 build spiffs.bin

# Or without using Docker
$IDF_PATH/components/spiffs/spiffsgen.py 4194304 build spiffs.bin
```

Now, the file system binary is ready to be flashed to the device. Before that, move the created binary to the firmware directory.

```bash
mv -f spiffs.bin ../firmware/.
```

## Flashing the firmware

To flash the firmware, run the following command in the firmware directory:

```bash
# Flash each bin file separately
esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 921600 write_flash -z --flash_mode dio --flash_freq 40m --flash_size detect 0x1000 .pio/build/heltec/bootloader.bin 0x8000 .pio/build/heltec/partitions.bin 0x10000 .pio/build/heltec/firmware.bin 0x310000 spiffs.bin
```


Alternatively if you want create a merged binary file, you can use the following commands:

```bash 
# Merge binaries together and flash

# Merge by using Docker
docker run --rm -v $PWD:/project -w /project espressif/idf esptool.py --chip ESP32 merge_bin -o merged-flash.bin --flash_mode dio --flash_size 8MB 0x1000 .pio/build/wokwi_simulation/bootloader.bin 0x8000 .pio/build/wokwi_simulation/partitions.bin 0x10000 .pio/build/wokwi_simulation/firmware.bin 0x310000 spiffs.bin

# Merge without using Docker
# This creates merged-flash.bin file that can be flashed with esptool.py
esptool.py --chip ESP32 merge_bin -o merged-flash.bin --flash_mode dio --flash_size 8MB 0x1000 .pio/build/wokwi_simulation/bootloader.bin 0x8000 .pio/build/wokwi_simulation/partitions.bin 0x10000 .pio/build/wokwi_simulation/firmware.bin 0x310000 ./spiffs.bin 

# Flash merged bin! Note: offset is 0x0000 + check the port!
esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 921600 write_flash -z --flash_mode dio --flash_freq 40m --flash_size 8MB 0x0 merged-flash.bin 
```

## Contributing

We welcome contributions to improve and expand the capabilities of LoRaChat. If you would like to contribute, please feel free to submit a pull request or open an issue on GitHub.