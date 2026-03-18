import React from 'react';
import { LogOut, User } from 'lucide-react';

export default function Header({ onClearKey }) {
  return (
    <header className="header">
      <div style={{ flex: 1 }}>
        {/* Placeholder for Breadcrumbs or Status Data */}
        <h3 style={{ margin: 0, fontWeight: 500 }}>Dashboard</h3>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={onClearKey} title="Update API Key" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
          <LogOut size={16} />
          Key
        </button>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={18} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
}
