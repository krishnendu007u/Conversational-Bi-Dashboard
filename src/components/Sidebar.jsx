import React from 'react';
import { LayoutDashboard, Database, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, hasData }) {
  return (
    <aside className="sidebar">
      <div className="logo-wrapper">
        <div className="logo-icon">
          <Sparkles size={20} />
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }} className="gradient-text">AskBI</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => hasData && setActiveTab('dashboard')}
          style={{ opacity: !hasData && activeTab !== 'dashboard' ? 0.5 : 1, cursor: !hasData ? 'not-allowed' : 'pointer' }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <Database size={18} />
          <span>Data Source</span>
        </div>
      </nav>
      
      <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <p>Hackathon Prototype</p>
        <p>Powered by Gemini & AlaSQL</p>
      </div>
    </aside>
  );
}
