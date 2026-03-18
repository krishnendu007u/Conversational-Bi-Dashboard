import React, { useState, useEffect } from 'react';
import { Database, LineChart, MessageSquare, Settings, Upload } from 'lucide-react';
import './App.css';

// We'll create these components next
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import DashboardArea from './components/DashboardArea';
import FileUpload from './components/FileUpload';

function App() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [dataContext, setDataContext] = useState(null); // Will hold schema Info and raw data
  const [dashboardConfig, setDashboardConfig] = useState(null); // The generated charts layout
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'data'
  const [chatHistory, setChatHistory] = useState([]);

  // Check local storage for API key on load
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSetApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
  };

  if (!apiKey) {
    return <WelcomeScreen onSaveKey={handleSetApiKey} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasData={!!dataContext}
      />

      <main className="main-content">
        <Header onClearKey={clearApiKey} />

        <div className="dashboard-area">
          {activeTab === 'data' || !dataContext ? (
            <FileUpload onDataLoaded={(data) => {
              setDataContext(data);
              setActiveTab('dashboard');
              setDashboardConfig(null);
              setChatHistory([]);
            }} />
          ) : (
            <DashboardArea config={dashboardConfig} isLoading={isGenerating} />
          )}
        </div>

        {dataContext && activeTab === 'dashboard' && (
          <div className="chat-input-container">
            <ChatInput
              onSend={async (message) => {
                if (!apiKey || !dataContext) return;
                setIsGenerating(true);

                try {
                  const newConfig = await import('./services/ai.js').then(m =>
                    m.generateDashboardConfig(apiKey, dataContext.schemaInfo, dataContext.sample, message)
                  );

                  // Wrap the single chart config in the format DashboardArea expects
                  setDashboardConfig({
                    kpis: newConfig.kpis || [],
                    charts: [newConfig]
                  });

                  setChatHistory(prev => [...prev, { query: message, config: newConfig }]);
                } catch (err) {
                  console.error(err);
                  alert("Failed to generate dashboard. Check console or API key.");
                } finally {
                  setIsGenerating(false);
                }
              }}
              isGenerating={isGenerating}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
