import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileType, CheckCircle, Database } from 'lucide-react';
import alasql from 'alasql'; // We'll set up AlaSQL DB here right after upload

export default function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processFile = (file) => {
    if (!file || file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file.");
      return;
    }

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true, // Converts "123" to 123
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Initialize AlaSQL database table
          const rawData = results.data;
          
          if (rawData.length === 0) {
            setError("The CSV file is empty");
            setLoading(false);
            return;
          }

          // Create an in-memory database table 'data'
          alasql('DROP TABLE IF EXISTS data');
          alasql('CREATE TABLE data');
          alasql.tables.data.data = rawData; // Direct assignment for performance

          console.log(`Loaded ${rawData.length} rows into AlaSQL table 'data'`);
          
          // Generate simple schema info for the AI prompt context
          const columns = Object.keys(rawData[0]);
          const sample = rawData.slice(0, 3);
          
          const schemaInfo = columns.map(col => {
            const firstValidValue = rawData.find(row => row[col] !== null && row[col] !== undefined)?.[col];
            return `${col} (${typeof firstValidValue})`;
          }).join(', ');

          onDataLoaded({
            fileName: file.name,
            rowCount: rawData.length,
            columns,
            schemaInfo,
            sample
          });
          
        } catch (err) {
          console.error("Database setup error", err);
          setError("Failed to load data into local memory.");
        }
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setError("Error parsing CSV file.");
        setLoading(false);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Upload Data Source</h2>
        <p>Upload a CSV file to instantly generate AI-powered dashboards and ask questions about your data.</p>
      </div>

      <div 
        className={`glass-card ${isDragging ? 'dragging' : ''}`}
        style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderColor: isDragging || loading ? 'var(--accent-primary)' : 'var(--border-color)',
          cursor: loading ? 'wait' : 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'var(--surface-primary)'
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('csv-file-input').click()}
      >
        <input 
          id="csv-file-input"
          type="file" 
          accept=".csv" 
          style={{ display: 'none' }} 
          onChange={(e) => processFile(e.target.files[0])}
        />
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="logo-icon" style={{ borderRadius: '50%', animation: 'pulse 2s infinite' }}>
              <UploadCloud size={32} />
            </div>
            <h3 style={{ margin: 0 }}>Processing & Indexing Data...</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', padding: '1rem', marginBottom: '1rem' }}>
              <UploadCloud size={48} color="var(--accent-primary)" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Click or drag a CSV file to this area</h3>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Your data never leaves your browser. It is processed locally.</p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)' }}>
          {error}
        </div>
      )}

      <div style={{ alignSelf: 'center', marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>How it works</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
          <div>
             <FileType size={32} color="var(--accent-secondary)" style={{ marginBottom: '0.5rem' }} />
             <p style={{ fontSize: '0.875rem' }}><strong>1. Upload</strong><br/>Drop your raw CSV data</p>
          </div>
          <div>
             <Database size={32} color="var(--accent-secondary)" style={{ marginBottom: '0.5rem' }} />
             <p style={{ fontSize: '0.875rem' }}><strong>2. Process</strong><br/>We build a local SQL database</p>
          </div>
          <div>
             <CheckCircle size={32} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
             <p style={{ fontSize: '0.875rem' }}><strong>3. Ask</strong><br/>Use plain english to get insights</p>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
