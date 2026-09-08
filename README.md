# TruthShield AI - Fake News Detector

TruthShield AI is a full-stack, AI-powered web application designed to detect fake news and misinformation from user-provided text or URLs.

## Features
- **Modern UI**: React.js with glassmorphism, gradient animations, and modern typography.
- **Backend API**: Flask-based REST API serving predictions.
- **Machine Learning**: Naive Bayes with TF-IDF vectorization. Includes explainability (XAI) and sentiment analysis via TextBlob.
- **Modes**: Text-based prediction OR URL-based document extraction.

## Project Structure
```markdown
truthshield-ai/
├── backend/
│   ├── app.py                  (Flask application & API endpoints)
│   ├── model_utils.py          (ML prediction and Text processing functions)
│   ├── train_mock_model.py     (A script to create & save a synthetic model)
│   └── requirements.txt        (Python dependencies)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Dashboard.jsx   (Main React component for logic and layout)
    │   ├── App.jsx             (Root component wrapper)
    │   ├── index.css           (Premium glassmorphism and animation CSS)
    │   └── main.jsx            (React DOM entry)
    ├── index.html              (Main HTML skeleton)
    ├── package.json            (Node dependencies)
    └── vite.config.js          (Vite compiler config)
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory:
   `cd backend`
2. Create a virtual environment (optional but recommended):
   `python -m venv venv`
   `source venv/bin/activate` (On Windows: `venv\Scripts\activate`)
3. Install Python dependencies:
   `pip install -r requirements.txt`
4. Train the ML model:
   Run the mock training script to generate the TF-IDF / Naive Bayes model.
   `python train_mock_model.py`
5. Start the backend server:
   `python app.py`
   (The API starts on http://localhost:5000)

*(Optional) MongoDB:* If MongoDB is running on `localhost:27017`, the app will automatically log predictions to the `truthshield` database. If not, it disables this feature gracefully.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   `cd frontend`
2. Install Node dependencies:
   `npm install`
3. Start the Vite React development server:
   `npm run dev`
4. Open the displayed local URL (usually http://localhost:5173).

## Testing the app
- **Text Input**: Type "Aliens have landed in New York and are eating pizza." It will flag as **Fake**.
- **URL Input**: Paste a valid news article URL. The system will scrape the paragraphs and analyze the overall sentiment and authenticity.

## Deployment Guide
- **Frontend (Vercel/Netlify)**:
  - Push the `frontend` directory to GitHub.
  - Connect your repository to Vercel/Netlify and set the build command to `npm run build` and publish directory to `dist`.
- **Backend (Render/Heroku)**:
  - Add a `Procfile` if using Heroku, or define the start command in Render as `gunicorn app:app`.
  - Ensure you commit all backend files, including `requirements.txt` and `model.joblib`.
