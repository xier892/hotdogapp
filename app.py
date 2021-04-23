from flask import Flask, render_template, request, send_from_directory
import matplotlib.pyplot as plt
import numpy as np
import os

from flask import flash, redirect, url_for
from werkzeug.utils import secure_filename
from keras.preprocessing import image

import keras
from keras.models import load_model
from tensorflow.python.keras.applications.resnet import ResNet50
from keras.applications.resnet50 import preprocess_input

import json

class_idx = json.load(open('model_data/imagenet_class_index.json'))
idx_to_label = [class_idx[str(i)][1] for i in range(len(class_idx))]

model = ResNet50(weights='imagenet')

#where our images will go
upload_folder = 'image_uploads'
#what filetypes are allowed
allowed_extensions = {'png', 'jpg', 'jpeg'}

#create our app
app = Flask(__name__)
#load files to our upload folder
app.config['upload_folder'] = upload_folder

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/', methods = ["POST", "GET"])
def home():
    if request.method == "POST":

        file = request.files['file']

        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['upload_folder'], filename))
            filepath = os.path.join(app.config['upload_folder'], filename)
            img = image.load_img(filepath, target_size=(224, 224))
            os.remove(filepath)
            im_array = image.img_to_array(img)
            x = preprocess_input(np.expand_dims(im_array, axis = 0))
            pred = np.argmax(model.predict(x), axis = 1)
            return render_template('result.html', is_hotdog = bool(idx_to_label[int(pred)] == 'hotdog'), filename = filename)
    return render_template('home.html')

@app.route('/image_uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['upload_folder'], filename)

if __name__ == '__main__':
    app.run(debug=True)
