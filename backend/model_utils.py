import re
import joblib
import os
from textblob import TextBlob

# Attempt to load model, if it fails, instruct to run train script
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")
pipeline = None

try:
    if os.path.exists(MODEL_PATH):
        pipeline = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Failed to load model: {e}")

def preprocess_text(text):
    # Basic textual cleaning
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

def extract_keywords(text, num=5):
    # We use TF-IDF features if model loaded; else simple word counts
    text = preprocess_text(text)
    words = text.split()
    # Simple frequent words proxy for keywords
    from collections import Counter
    counts = Counter(words)
    stop_words = set(["the", "and", "is", "in", "to", "of", "a", "it", "that", "this", "for", "with", "as"])
    keywords = [w for w, c in counts.most_common() if w not in stop_words][:num]
    return keywords

def get_explanation(text, prediction_label):
    keywords = extract_keywords(text, 5)
    if prediction_label == "Fake":
        return f"The text contains patterns often found in sensationalized content or misleading narratives. Words like {', '.join(keywords)} triggered the fake flag."
    else:
        return f"The text aligns with neutral, objective reporting styles. Key subjects detected: {', '.join(keywords)}."

def predict_news(text):
    if not pipeline:
        return {
            "prediction": "Unknown",
            "confidence": 0,
            "explanation": "Model is not loaded. Please run train_mock_model.py",
            "sentiment": "Neutral",
            "keywords": []
        }

    clean_text = preprocess_text(text)
    
    # Predict probabilities
    prob = pipeline.predict_proba([clean_text])[0]
    
    # 1 is Fake, 0 is Real implicitly in our synthetic model 
    fake_prob = prob[1]
    real_prob = prob[0]
    
    is_fake = fake_prob > 0.5
    confidence = max(fake_prob, real_prob) * 100
    label = "Fake" if is_fake else "Real"
    
    # Sentiment
    blob = TextBlob(text)
    sentiment_polarity = blob.sentiment.polarity
    if sentiment_polarity > 0.1:
        sentiment = "Positive"
    elif sentiment_polarity < -0.1:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {
        "prediction": label,
        "confidence": round(confidence, 2),
        "explanation": get_explanation(text, label),
        "sentiment": sentiment,
        "keywords": extract_keywords(text)
    }
