from flask import Flask, request, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

db_password = os.getenv('DB_PASSWORD')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if not db_password:
    logger.error("DB_PASSWORD environment variable not set")
    raise ValueError("DB_PASSWORD environment variable not set")


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
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)