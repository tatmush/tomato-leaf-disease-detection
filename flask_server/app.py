from flask import Flask, request, g, render_template
import cv2
import numpy as np
from tensorflow import keras
from sklearn.preprocessing import LabelBinarizer
import label_list
import json
import sqlite3
import os
import os.path
import flask
import random
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        conn = sqlite3.connect(os.path.abspath('test_1.db'))
        cur = conn.cursor()
        # Total number of scans
        rows = cur.execute("SELECT * FROM stats;")
        total_number_of_scans = len(rows.fetchall())

        # Potential Disease Space
        rows = cur.execute("SELECT * FROM disease_description;")
        number_of_diseases = len(rows.fetchall())

        # Farmers registered
        rows = cur.execute("SELECT * FROM farmer_info;")
        number_of_farmers = len(rows.fetchall())

        # Number of districts present
        rows = cur.execute("SELECT DISTINCT location FROM farmer_info;")
        number_of_locations = len(rows.fetchall())

        # Disease Count

        # Bacterial spot
        rows = cur.execute("SELECT DISTINCT disease FROM stats where disease=? COLLATE NOCASE", ('tomato_bacterial_spot',))
        tomato_bacterial_spot_count = len(rows.fetchall())

        # Early blight
        rows = cur.execute("SELECT DISTINCT disease FROM stats where disease=? COLLATE NOCASE", ('Tomato_Early_blight',))
        Tomato_Early_blight_count = len(rows.fetchall())

        # Septoria leaf spot
        rows = cur.execute("SELECT DISTINCT disease FROM stats where disease=? COLLATE NOCASE", ('Tomato_Septoria_leaf_spot',))
        Tomato_Septoria_leaf_spot_count = len(rows.fetchall())

        # Tomato late blight
        rows = cur.execute("SELECT DISTINCT disease FROM stats where disease=? COLLATE NOCASE", ('Tomato_Late_blight',))
        Tomato_Late_blight_count = len(rows.fetchall())

        # Yellow leaf curl virus
        rows = cur.execute("SELECT DISTINCT disease FROM stats where disease=? COLLATE NOCASE", ('yellow_leaf_curl_virus',))
        yellow_leaf_curl_virus_count = len(rows.fetchall())

        # Healthy
        rows = cur.execute("SELECT DISTINCT disease FROM stats where disease=? COLLATE NOCASE", ('Tomato_healthy',))
        Tomato_healthy_count = len(rows.fetchall())

        # Scans in the last 30 days
        last_month = datetime.now() -   timedelta(30)
        month = datetime.now().strftime('%B')
        rows = cur.execute("SELECT * FROM stats where time>?",(last_month,))
        number_of_scans = len(rows.fetchall())

        # Scans per disease for last 30 days.
        # Bacterial spot
        rows = cur.execute("SELECT disease FROM stats where time>? and disease=? COLLATE NOCASE", (last_month, 'tomato_bacterial_spot',))
        tomato_bacterial_spot_count_month = len(rows.fetchall())

        # Early blight
        rows = cur.execute("SELECT disease FROM stats where time>? and disease=? COLLATE NOCASE", (last_month, 'Tomato_Early_blight',))
        Tomato_Early_blight_count_month = len(rows.fetchall())

        # Septoria leaf spot
        rows = cur.execute("SELECT disease FROM stats where time>? and disease=? COLLATE NOCASE", (last_month, 'Tomato_Septoria_leaf_spot',))
        Tomato_Septoria_leaf_spot_count_month = len(rows.fetchall())

        # Tomato late blight
        rows = cur.execute("SELECT disease FROM stats where time>? and disease=? COLLATE NOCASE", (last_month, 'Tomato_Late_blight',))
        Tomato_Late_blight_count_month = len(rows.fetchall())

        # Yellow leaf curl virus
        rows = cur.execute("SELECT disease FROM stats where time>? and disease=? COLLATE NOCASE", (last_month, 'yellow_leaf_curl_virus',))
        yellow_leaf_curl_virus_count_month = len(rows.fetchall())

        # Healthy
        rows = cur.execute("SELECT disease FROM stats where time>? and disease=? COLLATE NOCASE", (last_month, 'Tomato_healthy',))
        Tomato_healthy_count_month = len(rows.fetchall())
        
        
        return render_template('index.html', total_number_of_scans=total_number_of_scans,\
            number_of_diseases=number_of_diseases, number_of_farmers=number_of_farmers,\
            number_of_locations=number_of_locations,\
            tomato_bacterial_spot_count=tomato_bacterial_spot_count, Tomato_Early_blight_count=Tomato_Early_blight_count,\
            Tomato_Septoria_leaf_spot_count=Tomato_Septoria_leaf_spot_count, Tomato_Late_blight_count=Tomato_Late_blight_count,\
            yellow_leaf_curl_virus_count=yellow_leaf_curl_virus_count, Tomato_healthy_count=Tomato_healthy_count,\
            number_of_scans=number_of_scans, month=month,\
            tomato_bacterial_spot_count_month=tomato_bacterial_spot_count_month, Tomato_Early_blight_count_month=Tomato_Early_blight_count_month,\
            Tomato_Septoria_leaf_spot_count_month=Tomato_Septoria_leaf_spot_count_month, Tomato_Late_blight_count_month=Tomato_Late_blight_count_month,\
            yellow_leaf_curl_virus_count_month=yellow_leaf_curl_virus_count_month, Tomato_healthy_count_month=Tomato_healthy_count_month)
    except Exception as e:
        print(str(e))
        

    return render_template('index.html')

    

@app.route('/farmer_info', methods=['POST', 'GET'])
def farmer_info():
    if request.method == "POST":
        json_data = request.get_json()
        # print(json_data)
        farmer_name = json_data['farmer_name']
        farm_name = json_data['farm_name']
        location = json_data['location']

        try:
            conn = sqlite3.connect(os.path.abspath('test_1.db'))
            cur = conn.cursor()
            rows = cur.execute("SELECT * FROM farmer_info WHERE farmer_name=? and farm_name=?", (farmer_name, farm_name))
            row = rows.fetchone()
            print(row)
            print(type(row))
            if row != None:
                return {'response': 'already saved'}
            # print(farmer_name + " " + farm_name + " " + location)

        except Exception as e:
            print(str(e))
            return {'response': 'error'}

        try:
            conn = sqlite3.connect(os.path.abspath('test_1.db'))
            cur = conn.cursor()
            cur.execute("INSERT INTO farmer_info (farmer_name, farm_name, location)\
                VALUES (?, ?, ?)", (farmer_name, farm_name, location))
            print(cur.lastrowid)
            conn.commit()
            return {'response': 'saved', 'farmer_id': cur.lastrowid}

        except Exception as e:
            print('There was an error')
            print(e)
            return {'response': 'error'}
    
    return {'response': 'Not Data Saved, actually not Saved'}

def getDesc(disease):
    try:
        conn = sqlite3.connect(os.path.abspath('test_1.db'))
        cur = conn.cursor()
        rows = cur.execute('SELECT * FROM disease_description WHERE disease=?', (disease,))
        description = rows.fetchone()[1]
        conn.close()
    
    except Exception as e: # TODO: catch all possible excpetions
        print('There was an error')
        print(e)
        return 'error ' + str(e)

    return description

def get_latest_news():
    try:
        conn = sqlite3.connect(os.path.abspath('test_1.db'))
        cur = conn.cursor()
        rows = cur.execute('SELECT * FROM latest_news')
        news = rows.fetchall()

        news_array = []
        for row, item in enumerate(news):
            news_array.append({'id': str(item[0]), 'title': item[1], 'body': item[2]})

        return news_array

    except Exception as e: # TODO catch specific exceptions
        print('There was an error')
        return 'error ' + str(e)


@app.route('/latest_news', methods=['GET'])
def latest_news():
    latest_news={}
    latest_news['latest_news'] = get_latest_news()


    return json.dumps(latest_news)

def leaf_detection(img):
    model = keras.models.load_model('./leaf_detection.h5')
    img = img.reshape((1, 256, 256, 3))
    result = model.predict(img)
    return result
        
def saveResult(farmer_id, disease):
    try:
        conn = sqlite3.connect(os.path.abspath('test_1.db'), detect_types=sqlite3.PARSE_DECLTYPES)
        cur = conn.cursor()
        time = datetime.now()
        cur.execute("INSERT INTO stats (farmer_id, disease, time)\
                VALUES (?, ?, ?)", (farmer_id, disease, time))
        print(cur.lastrowid)
        conn.commit()

        return 'saved result'

    except Exception as e: # TODO catch specific exceptions
        print('Could not save in stats')
        print(str(e))
        return 'error ' + str(e)


@app.route('/detect_disease', methods=['POST'])
def detect_disease():

    farmer_id = request.form['farmer_id']
    # print(farmer_id)

    # process the image 
    image_str = request.files["image"].read()

    np_image = np.frombuffer(image_str, np.uint8)
    img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (256,256))
    
    detect_leaf = leaf_detection(img)
    if detect_leaf[0][0] == 1.0:
        return json.dumps({'disease': '-', 'description': 'no leaf detected'}) 

    img = img/255
    img = np.expand_dims(img, axis=0)
    # load the model 
    model = keras.models.load_model('./tomato_2.h5')
    # make prediction
    result = model.predict(img)
    # make results readable 
    label_binarizer = LabelBinarizer()
    label_binarizer.fit_transform(label_list.label_list)
    result = label_binarizer.inverse_transform(result)

    saveResult(farmer_id, result[0])

    description = getDesc(result[0])
    # convert output to json format
    print(result[0])
    response = json.dumps({'disease': result[0], 'description': description})
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
