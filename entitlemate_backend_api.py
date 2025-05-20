from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

# Allow Render to bind to 0.0.0.0 for production hosting
PORT = int(os.environ.get("PORT", 5000))
DATA_FILE = "entitlements.json"

@app.route("/upload", methods=["POST"])
def upload_json():
    try:
        data = request.get_json()

        if not isinstance(data, list):
            return jsonify({"error": "Expected a JSON array"}), 400

        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=2)

        return jsonify({"status": "success", "records": len(data)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/data", methods=["GET"])
def serve_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE) as f:
            return f.read(), 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({"error": "Data not found"}), 404

@app.route("/")
def index():
    return "EntitleMate backend is running. Use /upload to post data and /data to fetch it."

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)