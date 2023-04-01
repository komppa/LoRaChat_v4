import os
import re
import shutil


def main():

    web_build_path = '../web/build'

    # Flatten the directory structure by moving files to the root
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


    main_css_filename = ''
    main_js_filename = ''
    chunk_js_filenames = []


    for file in files:

        if file.endswith('.css'):
            main_css_filename = file

        if file.endswith('.js') and 'chunk' not in file:
            main_js_filename = file

        if file.endswith('.chunk.js'):
            chunk_js_filenames.append(file)


    if not main_css_filename:
        print("CSS file not found!")
        
    if not main_js_filename:
        print("Main JS file not found!")

    if len(chunk_js_filenames) == 0:
        print("Chunk JS file(s) not found!")

    print(f'CSS: {main_css_filename}')
    print(f'JS: {main_js_filename}')
    print(f'Chunk JS: {chunk_js_filenames}')

    with open('platformio.ini', 'r') as pio_file:
        content = pio_file.read()

    print(chunk_js_filenames)

    # MAIN_CSS
    content = re.sub(r'(-D MAIN_CSS=.+?)', f'-D MAIN_CSS="\\\"/{main_css_filename}\\\"', content)
    content = re.sub(r'(-D MAIN_CSS_PATH=.+?)', f'-D MAIN_CSS_PATH="\\\"/static/css/{main_css_filename}\\\"', content)

    # MAIN_JS
    content = re.sub(r'(-D MAIN_JS=.+?)', f'-D MAIN_JS="\\\"/{main_js_filename}\\\"', content)
    content = re.sub(r'(-D MAIN_JS_PATH=.+?)', f'-D MAIN_JS_PATH="\\\"/static/js/{main_js_filename}\\\"', content)

    # CHUNK_JS
    for i in range(len(chunk_js_filenames)):
        content = re.sub(r'(-D CHUNK_JS_' + str(i+1) + '.+?)', f'-D CHUNK_JS_' + str(i+1) + '="\\\"/' + chunk_js_filenames[i] + "\\\\", content)
        content = re.sub(r'(-D CHUNK_JS_PATH_' + str(i+1) + '.+?)', f'-D CHUNK_JS_PATH_' + str(i+1) + '="\\\"/static/js/' + chunk_js_filenames[i] + "\\\\", content)

    # HOW MANY CHUNKS ARE THERE FOR MACRO TO CREATE
    content = re.sub(r'(-D CHUNCK_JS_COUNT=.+?)', f'-D CHUNCK_JS_COUNT={len(chunk_js_filenames)}', content)


    print(content)

    with open('platformio.ini', 'w') as pio_file:
        pio_file.write(content)

if __name__ == '__main__':
    main()