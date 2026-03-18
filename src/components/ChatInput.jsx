import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ChatInput({ onSend, isGenerating }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      onSend(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
      <input
        type="text"
        className="glass-panel"
        style={{
          width: '100%',
          padding: '1.25rem 4rem 1.25rem 1.5rem',
          fontSize: '1rem',
          border: '1px solid var(--accent-primary)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: 'var(--text-primary)',
          fontFamily: 'inherit',
          outline: 'none',
          borderRadius: '24px'
        }}
        placeholder="E.g., Show me monthly revenue for Q3 broken down by region..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isGenerating}
      />
      <button 
        type="submit" 
        style={{ 
          position: 'absolute', 
          right: '8px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: query.trim() && !isGenerating ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.1)',
          border: 'none',
          color: query.trim() && !isGenerating ? 'white' : 'var(--text-secondary)',
          cursor: query.trim() && !isGenerating ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease'
        }}
        disabled={!query.trim() || isGenerating}
      >
        {isGenerating ? <Loader2 size={18} className="spin" /> : <Send size={18} style={{ marginLeft: '3px' }} />}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}} />
    </form>
  );
}
