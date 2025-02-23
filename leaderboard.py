from flask import Flask, request, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

db_password = os.getenv('DB_PASSWORD')


client = MongoClient("mongodb+srv://rgh9883:" +  db_password + "@scores.rk25j.mongodb.net/?retryWrites=true&w=majority&appName=Scores")

collection = client['Leaderboard']['Scores']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    collection.insert_one(data)
    scores = collection.find().sort("score", -1).limit(10)
    return dumps(scores)

if __name__ == '__main__':
    app.run(debug=True)