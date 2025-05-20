from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import logging
import requests
import csv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # This allows your Next.js app to make requests to this API

# For development, we'll store data in a JSON file
DATA_FILE = 'entitlements.json'

GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9CvPr-8TlRsbmDhyye1QWjLCPEq5fy9LK95FLWIAb-Fp-ExtNU9zZpPIcT3M4hkFlKody3HV-CE1-/pub?output=csv"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def fetch_entitlements():
    response = requests.get(GOOGLE_SHEET_CSV_URL)
    response.raise_for_status()
    lines = response.text.splitlines()
    reader = csv.DictReader(lines)
    return list(reader)

@app.route('/api/entitlements', methods=['GET'])
def get_entitlements():
    data = fetch_entitlements()
    return jsonify(data)

@app.route('/api/entitlements', methods=['POST'])
def update_entitlements():
    try:
        logger.info("Received webhook request")
        logger.info(f"Request headers: {dict(request.headers)}")
        logger.info(f"Request data: {request.get_data()}")
        
        data = request.json
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data received"}), 400
            
        # If data is a single record from Zapier, convert it to a list
        if isinstance(data, dict):
            data = [data]
            
        logger.info(f"Processed data: {data}")
        save_data(data)
        return jsonify({"message": "Data updated successfully"})
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add a test endpoint
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "API is working"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050)
