import os
import random
import base64
import json

from flask import Flask
from flask import request
from flask_cors import CORS
from flask import render_template


app = Flask(__name__, static_folder='image-classification/build/static', template_folder='image-classification/build')

CORS(app)

FOLDERS = ('cats',)
IMG_EXTENSIONS = ('.png', '.jpg', '.bmp')
LABEL_SUFFIX = '_label.txt'


@app.route("/")
def hello():
    return render_template('index.html')


@app.route('/get_image')
def get_image():
    """
    Returns an unclassified image
    :return: dict
    """

    folder = random.choice(FOLDERS)
    files = [os.path.join(folder, f) for f in os.listdir(folder) if f.endswith(IMG_EXTENSIONS)]
    unclassified_files = []
    for f in files:
        if not os.path.isfile(f + LABEL_SUFFIX):
            unclassified_files.append(f)
    if len(unclassified_files) == 0:
        unclassified_files = files
    file = random.choice(unclassified_files)
    with open(file, 'rb') as f:
        img = f.read()
    img = base64.b64encode(img).decode('ascii')
    options = get_options(folder)
    resp = {'folder': folder,
            'file': file,
            'options': options,
            'image': img}

    return resp


@app.route('/classify')
def get_classification():
    """
    Adds labels to an image
    :return: str and HTML status code
    """

    folder = request.args.get('folder', '')
    file = request.args.get('file', '')
    label = request.args.get('label', '')
    if folder not in FOLDERS:
        return 'invalid folder: {}'.format(folder), 400
    fname = os.path.join(folder, file)
    if not os.path.isfile(fname) or not file.endswith(IMG_EXTENSIONS):
        return 'invalid file "{}"'.format(fname), 400
    options = get_options(folder)
    labels = label.split(',')
    for label in labels:
        if label not in options['labels']:
            return 'invalid label "{}"'.format(label), 400
    with open(fname + LABEL_SUFFIX, 'a') as f:
        f.write(','.join(labels))
        f.write('\n')
    return 'OK', 200


def get_options(folder):
    with open(os.path.join(folder, 'options.json'), 'r') as f:
        return json.load(f)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
