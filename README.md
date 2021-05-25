# Tomato Leaf Disease Detection

### Description

Tomato farming yields high economic returns. However tomatoes get attacked by diseases such as **early blight, late blight and bacterial spot**. It is important for farmers to diagnose these diseases and get remedy to increase their yield. 

This repo consists of a Flask server and a React-Native app that offers farmers an opportunity to diagnose diseases from tomato leaves.

## Screenshots

### Flask server
![Dashboard](screenshots/flask_dashboard.png?raw=true "Dashboard")

### Mobile App
![Disease Detection"](screenshots/disease_detection.PNG?raw=true "Disease Detection")

![News](screenshots/news.PNG?raw=true "News")

![Farmer](screenshots/farmer_info.PNG?raw=true "Farmer")

### AI Model

## System Architecture and System Components

The farmer captures/selects an image they want to scan. The leaf is sent in a POST request to the flask server. 

The server:
- preprocesses the image to a size accepted by 2 AI Models.
- converts the image into grayscale.

The first model detects wheather an image sent from the mobile phone contains a leaf. If the image does not contain a leaf an appropriate response is given.

The second model diagnoses the image of the leaf into 6 disease classes that the model was trained on:
- Bacterial Spot
- Early Blight
- Healthy
- Late Blight
- Septoria Leaf Spot
- Yellow Leaf Curl Virus

Each of the disease classes contained 1000 images. The model reached an accuracy of 82%.

The database has the following tables:

### Diseases Info
 Column | Description
------------ | -------------
Disease| name of the disease diagnosed
Description | short description about the disease
Remedy | Solutions to the disease


### Farmer Info
 Column | Description
------------ | -------------
farmer_name| name of the farmer using the app
farm_name | name of the farm
location | district location of the farm


### Stats
 Column | Description
------------ | -------------
farmer_id| name of the farmer using the app
disease | disease detected by the AI model
time | time at which diagnoses is made  


Statistics regarding the diagnoses are stored in a sqlite database and rendered in the dashboard view.  A diagnosis, description of the disease and remedy is sent back to the mobile phone.

## Running the project

1. Start mobile app and make sure you have the http requests pointing to your server in second step. Navigate to app folder and type:

`react-native run-android`

2. Navigate to flask server and activate the virtual environment. Run:


`python app.py`

# Authors
1. tatalmondmush@gmail.com
2. Loice Zimucha
