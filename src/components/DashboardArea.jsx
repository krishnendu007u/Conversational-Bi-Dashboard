import React from 'react';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity } from 'lucide-react';
// We will import recharts components later when we build the dynamic renderer
import ChartRenderer from './ChartRenderer';

export default function DashboardArea({ config, isLoading }) {
  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <div className="logo-icon pulse" style={{ width: '80px', height: '80px', borderRadius: '24px' }}>
          <Activity size={40} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 className="gradient-text">Analyzing Data</h2>
          <p>Generating SQL, running queries, and building your layout...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .pulse { animation: pulse 2s infinite; }
          @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
        `}} />
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <BarChart3 size={64} color="var(--accent-secondary)" />
        </div>
        <h2>Data Ready for Analysis</h2>
        <p style={{ maxWidth: '400px', margin: '0 auto' }}>
          Your data has been successfully loaded into the local database. 
          Use the chat box below to ask any questions in plain English.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <div className="glass-card" style={{ padding: '1rem', flex: 1, textAlign: 'left' }}>
            <TrendingUp size={20} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem' }}>"Show me sales trend over the last 12 months"</p>
          </div>
          <div className="glass-card" style={{ padding: '1rem', flex: 1, textAlign: 'left' }}>
            <PieChartIcon size={20} color="var(--accent-tertiary)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem' }}>"What is the revenue breakdown by region?"</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Generated Insights</h2>
      </div>
      
      {/* KPI Cards section */}
      {config.kpis && config.kpis.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {config.kpis.map((kpi, index) => (
            <div key={index} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{kpi.title}</span>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{kpi.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Charts grid */}
      {config.charts && config.charts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {config.charts.map((chart, index) => (
            <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{chart.title}</h3>
              <div style={{ flex: 1, minHeight: '300px' }}>
                <ChartRenderer config={chart} data={chart.data} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
