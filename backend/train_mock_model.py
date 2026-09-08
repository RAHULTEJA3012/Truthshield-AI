import os
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

def create_mock_dataset():
    """Create a synthetic dataset to train our fake news model"""
    data = {
        "text": [
            "Aliens have landed in New York and are eating pizza.",
            "Scientists discover a new cure for all diseases overnight using just water.",
            "Earth is completely flat according to new government leaks.",
            "Global warming is a hoax created by pandas.",
            "Drinking bleach cures all viruses, experts say.",
            "The Federal Reserve increases interest rates by 0.25% to combat inflation.",
            "New Mars rover sends back spectacular images of the Jezero Crater.",
            "Local high school basketball team wins the state championship.",
            "Apple announces its new iPhone with an upgraded camera system.",
            "Study shows that regular exercise can improve cardiovascular health."
        ],
        "label": [
            1, 1, 1, 1, 1,  # 1 means FAKE
            0, 0, 0, 0, 0   # 0 means REAL
        ]
    }
    return pd.DataFrame(data)

def train_and_save():
    model_path = "model.joblib"
    print("Creating synthetic dataset...")
    df = create_mock_dataset()
    
    pipeline = make_pipeline(
        TfidfVectorizer(stop_words="english", max_features=5000),
        MultinomialNB(alpha=0.1)
    )
    
    print("Training the TF-IDF and Naive Bayes model...")
    pipeline.fit(df['text'], df['label'])
    
    print(f"Saving model to {model_path}...")
    joblib.dump(pipeline, model_path)
    print("Training complete!")

if __name__ == "__main__":
    train_and_save()
