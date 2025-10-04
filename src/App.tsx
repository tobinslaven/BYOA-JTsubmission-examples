import React, { useState, useEffect } from 'react';
import { AppState, Studio, Comparison } from './types';
import { generateExamples, saveComparison, getSavedComparisons } from './services/api';
import Home from './components/Home';
import SavedResults from './components/SavedResults';
import About from './components/About';
import Navigation from './components/Navigation';
import Toast from './components/Toast';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentComparison: null,
    savedComparisons: [],
    isLoading: false,
    error: null,
    activeStudio: 'MS',
    currentPrompt: ''
  });

  const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'about'>('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load saved comparisons on mount
  useEffect(() => {
    const loadSavedComparisons = async () => {
      try {
        const saved = await getSavedComparisons();
        setAppState(prev => ({ ...prev, savedComparisons: saved }));
      } catch (error) {
        console.error('Failed to load saved comparisons:', error);
      }
    };

    loadSavedComparisons();
  }, []);

  const handleGenerateExamples = async (promptText: string, studio: Studio) => {
    setAppState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      currentPrompt: promptText,
      activeStudio: studio 
    }));

    try {
      const response = await generateExamples({ promptText, studio });
      
      const newComparison: Comparison = {
        id: Date.now().toString(),
        title: `Generated Example - ${studio}`,
        studio,
        promptText,
        worldClass: response.worldClass,
        notApproved: response.notApproved,
        createdAt: new Date().toISOString(),
        createdByRole: 'Learner',
        isMockData: response.isMockData,
        apiError: response.apiError
      };

      setAppState(prev => ({ 
        ...prev, 
        currentComparison: newComparison, 
        isLoading: false 
      }));
    } catch (error) {
      setAppState(prev => ({ 
        ...prev, 
        error: 'Failed to generate examples. Please try again.', 
        isLoading: false 
      }));
    }
  };

  const handleSaveComparison = async (title?: string) => {
    if (!appState.currentComparison) return;

    try {
      const response = await saveComparison({
        title: title || appState.currentComparison.title,
        studio: appState.currentComparison.studio,
        promptText: appState.currentComparison.promptText,
        worldClass: appState.currentComparison.worldClass,
        notApproved: appState.currentComparison.notApproved
      });

      const savedComparison: Comparison = {
        ...appState.currentComparison,
        id: response.id,
        title: title || appState.currentComparison.title
      };

      setAppState(prev => ({
        ...prev,
        savedComparisons: [...prev.savedComparisons, savedComparison]
      }));
    } catch (error) {
      setAppState(prev => ({ 
        ...prev, 
        error: 'Failed to save comparison. Please try again.' 
      }));
    }
  };

  const handleLoadComparison = (comparison: Comparison) => {
    setAppState(prev => ({ 
      ...prev, 
      currentComparison: comparison,
      activeStudio: comparison.studio,
      currentPrompt: comparison.promptText
    }));
    setActiveTab('home');
  };

  const handleStudioChange = (studio: Studio) => {
    setAppState(prev => ({ ...prev, activeStudio: studio }));
  };

  const clearError = () => {
    setAppState(prev => ({ ...prev, error: null }));
  };

  const handleClearResults = () => {
    setAppState(prev => ({ 
      ...prev, 
      currentComparison: null,
      currentPrompt: '',
      error: null
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {appState.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{appState.error}</p>
              <button 
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <Home
            appState={appState}
            onGenerateExamples={handleGenerateExamples}
            onSaveComparison={handleSaveComparison}
            onLoadComparison={handleLoadComparison}
            onStudioChange={handleStudioChange}
            onClearResults={handleClearResults}
            onShowToast={(message, type) => setToast({ message, type })}
          />
        )}

        {activeTab === 'saved' && (
          <SavedResults
            savedComparisons={appState.savedComparisons}
            onLoadComparison={handleLoadComparison}
          />
        )}

        {activeTab === 'about' && <About />}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
