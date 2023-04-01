import os
import re
import shutil
import configparser


def main():


    config = configparser.ConfigParser()
    config.read('platformio.ini')

    web_build_path = '../web/build'

    # Flatten the web build directory structure by moving files to the root
    for root, dirs, files in os.walk(web_build_path):
        if root == web_build_path:
            continue
        for file in files:
            old_path = os.path.join(root, file)
            new_path = os.path.join(web_build_path, file)
            shutil.move(old_path, new_path)

    # Remove empty subdirectories
    for root, dirs, files in os.walk(web_build_path, topdown=False):
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            if not os.listdir(dir_path):
                os.rmdir(dir_path)

    files = os.listdir(web_build_path)


    css_file = ''
    js_files = []


    for file in files:

        if file.endswith('.css'):
            css_file = file

        if file.endswith('.js'):
            js_files.append(file)

    if not css_file:
        print("CSS file not found!")
        
    if len(js_files) == 0:
        print("JS file(s) not found!")

    print(f'CSS: {css_file}')
    print(f'JS: {js_files}')

    build_flags = ''

    # Javascript files and paths
    for i, file_name in enumerate(js_files, start=1):
        build_flags += f'\n-D JS_{i}="\\"/{file_name}\\""'
        build_flags += f'\n-D JS_PATH_{i}="\\"/static/js/{file_name}\\""'

    # Count of Javascript files
    build_flags += f'\n-D JS_COUNT={len(js_files)}'
    
    # Add css file
    build_flags += f'\n-D CSS="\\"/{css_file}\\""'
    build_flags += f'\n-D CSS_PATH="\\"/static/css/{css_file}\\""'

    # Set the build flags for the real Heltec hardware
    config.set('env:heltec', 'build_flags', build_flags)

    # Add simulator build flag and save to simulation environment
    build_flags += f'\n-D SIMULATION'
    config.set('env:wokwi_simulation', 'build_flags', build_flags)

    # Write the modified platformio.ini file
    with open('platformio.ini', 'w') as configfile:
        config.write(configfile)


if __name__ == '__main__':
    main()