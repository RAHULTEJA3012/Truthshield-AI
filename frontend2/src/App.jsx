import React from 'react'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <>
      <div className="background-element"></div>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            TruthShield AI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Advanced neural networks and NLP algorithms to detect fake news and analyze content sentiment.
          </p>
        </header>

        <main style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Dashboard />
        </main>

        <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} TruthShield AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}

export default App
