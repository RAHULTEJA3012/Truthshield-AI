from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import cloudscraper
from model_utils import predict_news
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Attempt MongoDB connection, gracefully disable if unavailable
mongo_client = None
db = None
logs_collection = None
try:
    mongo_client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    db = mongo_client["truthshield"]
    logs_collection = db["predictions_log"]
    # Test connection
    mongo_client.server_info()
except Exception as e:
    print("MongoDB not running, prediction logs will not be stored in DB.")
    logs_collection = None

def save_log(input_data, type_str, result):
    if logs_collection is not None:
        try:
            logs_collection.insert_one({
                "timestamp": datetime.utcnow(),
                "type": type_str,
                "input": input_data,
                "prediction": result["prediction"],
                "confidence": result["confidence"]
            })
        except Exception:
            pass

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")
    
    if not text.strip():
        return jsonify({"error": "No text provided"}), 400
        
    result = predict_news(text)
    save_log(text, "text", result)
    return jsonify(result)

@app.route("/url-check", methods=["POST"])
def url_check():
    data = request.json
    url = data.get("url", "")
    print(f"\n[DEBUG] ----------------- START URL CHECK -----------------")
    print(f"[DEBUG] Attempting to process URL: {url}")
    
    if not url.strip():
        print("[DEBUG] No URL provided.")
        return jsonify({"error": "No URL provided"}), 400
        
    try:
        # Use cloudscraper to bypass anti-bot and Cloudflare protections
        scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True})
        response = scraper.get(url, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Extract text from paragraphs
        paragraphs = soup.find_all("p")
        text_content = " ".join([p.get_text() for p in paragraphs])
        
        print(f"[DEBUG] Extracted {len(paragraphs)} paragraphs, total {len(text_content)} characters.")
        
        if len(text_content) < 50:
            print(f"[DEBUG] Failed: Could not extract enough text. Content snippet: {text_content[:200]}")
            return jsonify({"error": "Could not extract enough text from the URL."}), 400
            
        result = predict_news(text_content)
        # Include original text snippet
        result["snippet"] = text_content[:200] + "..."
        save_log(url, "url", result)
        
        return jsonify(result)
        
    except requests.exceptions.RequestException as e:
        print(f"[DEBUG] Request failed for {url}. Error: {e}")
        # Return 400 status instead of 500 for URL fetching errors (likely a bad URL or bot protection)
        return jsonify({"error": f"Failed to fetch URL. The site might be blocking us or the URL is invalid."}), 400
    except Exception as e:
        print(f"[DEBUG] Generic Exception for {url}. Error: {e}")
        return jsonify({"error": f"Error processing URL: {str(e)}"}), 500

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "success",
        "message": "TruthShield API is running. Use /predict or /url-check endpoints via POST requests."
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
