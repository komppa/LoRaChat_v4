import os
import re

def main():

    css_path = '../web/build/static/css'
    js_path = '../web/build/static/js'

    css_files = os.listdir(css_path)
    js_files = os.listdir(js_path)

    print(js_files)


    main_css_filename = ''
    main_js_filename = ''
    chunk_js_filename = ''


    for file in css_files:
        if file.endswith('.css'):
            main_css_filename = file

    for file in js_files:
        if file.endswith('.chunk.js'):
            chunk_js_filename = file
        if file.endswith('.js') and 'chunk' not in file:
            main_js_filename = file

    if not main_css_filename:
        print("CSS file not found!")

    if not chunk_js_filename:
        print("Chunk JS file not found!")
        
    if not main_js_filename:
        print("Main JS file not found!")

    print(f'CSS: {main_css_filename}')
    print(f'JS: {main_js_filename}')
    print(f'Chunk JS: {chunk_js_filename}')

    with open('platformio.ini', 'r') as pio_file:
        content = pio_file.read()

    # MAIN_CSS
    content = re.sub(r'(-D MAIN_CSS=.+?)', f'-D MAIN_CSS="\\\"/static/css/{main_css_filename}\\\"', content)

    # MAIN_JS
    content = re.sub(r'(-D MAIN_JS=.+?)', f'-D MAIN_JS="\\\"/static/js/{main_js_filename}\\\"', content)

    # CHUNK_JS
    content = re.sub(r'(-D CHUNK_JS=.+?)', f'-D CHUNK_JS="\\\"/static/js/{chunk_js_filename}\\\"', content)


    with open('platformio.ini', 'w') as pio_file:
        pio_file.write(content)

if __name__ == '__main__':
    main()