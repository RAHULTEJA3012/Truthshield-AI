import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Link as LinkIcon, FileText, Activity } from 'lucide-react';

const Dashboard = () => {
  const [inputType, setInputType] = useState('text'); // 'text' or 'url'
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError(`Please enter a valid ${inputType}`);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const endpoint = inputType === 'text' ? '/api/predict' : '/api/url-check';
    const payload = inputType === 'text' ? { text: content } : { url: content };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Input Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: inputType === 'text' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: inputType === 'text' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onClick={() => setInputType('text')}
          >
            <FileText size={20} /> Text Input
          </button>
          <button 
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: inputType === 'url' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: inputType === 'url' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onClick={() => setInputType('url')}
          >
            <LinkIcon size={20} /> URL Check
          </button>
        </div>

        {inputType === 'text' ? (
          <textarea 
            className="input-field" 
            placeholder="Paste news article or text here for analysis..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <input 
            type="url"
            className="input-field" 
            placeholder="https://example.com/news-article"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ padding: '16px' }}
          />
        )}

        {error && (
          <div className="animate-fade-in" style={{ color: 'var(--danger)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn-primary" 
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : <Activity size={20} />}
            {loading ? 'Analyzing Neural Pathways...' : 'Check Authenticity'}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Prediction Result</h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: result.prediction === 'Real' ? 'var(--success)' : 'var(--danger)'
              }}>
                {result.prediction === 'Real' ? <ShieldCheck size={40} /> : <AlertTriangle size={40} />}
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{result.prediction}</span>
              </div>
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Confidence Score</span>
                <span style={{ fontWeight: 'bold' }}>{result.confidence}%</span>
              </div>
              <div className="confidence-bar-container">
                <div 
                  className="confidence-bar" 
                  style={{ 
                    width: `${result.confidence}%`,
                    background: result.prediction === 'Real' ? 'var(--success)' : 'var(--danger)'
                  }}
                ></div>
              </div>
            </div>
            
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: '#e2e8f0' }}>AI Explanation (XAI)</h3>
            <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>{result.explanation}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '12px' }}>
              <span style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Sentiment Analysis</span>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{result.sentiment}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '12px' }}>
              <span style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Key Indicators</span>
              <div>
                {result.keywords.length > 0 ? result.keywords.map((kw, i) => (
                  <span key={i} className="tag">{kw}</span>
                )) : <span style={{ color: 'var(--text-muted)' }}>None found</span>}
              </div>
            </div>
          </div>

          {result.snippet && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Extracted Snippet:</h4>
              <p style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.9rem' }}>"{result.snippet}"</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Dashboard;
