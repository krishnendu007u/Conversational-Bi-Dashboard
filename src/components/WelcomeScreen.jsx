import React, { useState } from 'react';
import { KeyRound, Sparkles } from 'lucide-react';

export default function WelcomeScreen({ onSaveKey }) {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onSaveKey(inputKey.trim());
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div className="glass-card modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="logo-icon" style={{ width: '64px', height: '64px', borderRadius: '16px' }}>
            <Sparkles size={32} />
          </div>
        </div>

        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>krishnendu gpt</h1>
          <p>Conversational AI for Instant Dashboards</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Google Gemini API Key
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                className="input-field"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
            Start Analyzing Data
          </button>
        </form>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Your API key is stored locally in your browser and is never sent to our servers.
        </p>
      </div>
    </div>
  );
}
