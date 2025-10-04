import React, { useState, useEffect } from 'react';
import { AppState, Studio, Comparison, Example } from '../types';
import StudioToggle from './StudioToggle';
import ExampleCard from './ExampleCard';
import SaveModal from './SaveModal';
import EditModal from './EditModal';

// AI Loading Stage Component
const AILoadingStage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  
  const stages = [
    "Analyzing project directions...",
    "Applying studio criteria...",
    "Channeling Acton Academy wisdom...",
    "Crafting world-class example...",
    "Creating not-approved version...",
    "Adding just the right amount of Acton flair...",
    "Consulting with peer reviewers...",
    "Fine-tuning the details...",
    "Double-checking criteria coverage...",
    "Adding that special Acton touch..."
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const scheduleNextStage = () => {
      // Random time between 2-3 seconds (2000-3000ms)
      const randomTime = Math.random() * 1000 + 2000;
      
      timeoutId = setTimeout(() => {
        // Randomly select next stage (avoiding immediate repeat)
        let nextStage;
        do {
          nextStage = Math.floor(Math.random() * stages.length);
        } while (nextStage === currentStage && stages.length > 1);
        
        setCurrentStage(nextStage);
        scheduleNextStage(); // Schedule the next one
      }, randomTime);
    };

    scheduleNextStage();

    return () => clearTimeout(timeoutId);
  }, [currentStage, stages.length]);

  return <span>{stages[currentStage]}</span>;
};

interface HomeProps {
  appState: AppState;
  onGenerateExamples: (promptText: string, studio: Studio) => void;
  onSaveComparison: (title?: string) => void;
  onLoadComparison: (comparison: Comparison) => void;
  onStudioChange: (studio: Studio) => void;
  onClearResults: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onUpdateComparison: (updatedComparison: Comparison) => void;
}

const Home: React.FC<HomeProps> = ({
  appState,
  onGenerateExamples,
  onSaveComparison,
  onLoadComparison,
  onStudioChange,
  onClearResults,
  onShowToast,
  onUpdateComparison
}) => {
  const [promptText, setPromptText] = useState(appState.currentPrompt);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExample, setEditingExample] = useState<{ example: Example; isWorldClass: boolean } | null>(null);

  const handleStudioSubmit = (studio: Studio) => {
    if (promptText.trim()) {
      onGenerateExamples(promptText.trim(), studio);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (promptText.trim() && appState.activeStudio) {
        onGenerateExamples(promptText.trim(), appState.activeStudio);
      }
    }
  };

  const handleSaveClick = () => {
    if (appState.currentComparison) {
      setShowSaveModal(true);
    }
  };

  const handleSaveConfirm = (title: string) => {
    onSaveComparison(title);
    setShowSaveModal(false);
    onShowToast('Comparison saved successfully!', 'success');
  };

  const handleNewChallenge = () => {
    onClearResults();
    setPromptText(''); // Clear the form text as well
  };

  const handleEditExample = (example: Example, isWorldClass: boolean) => {
    setEditingExample({ example, isWorldClass });
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedExample: Example) => {
    if (!appState.currentComparison || !editingExample) return;

    const updatedComparison: Comparison = {
      ...appState.currentComparison,
      [editingExample.isWorldClass ? 'worldClass' : 'notApproved']: updatedExample
    };

    onUpdateComparison(updatedComparison);
    setShowEditModal(false);
    setEditingExample(null);
    onShowToast('Example updated successfully!', 'success');
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingExample(null);
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          What Does A World-Class Example Look Like?
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          Submit your challenge to compare examples.
        </p>
      </div>

      <div className="space-y-8">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <textarea
                id="prompt"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your project directions & requirements here"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={appState.isLoading}
              />
            </div>

            <StudioToggle
              activeStudio={appState.activeStudio}
              onStudioChange={onStudioChange}
              onStudioSubmit={handleStudioSubmit}
              disabled={appState.isLoading}
              hasPrompt={promptText.trim().length > 0}
            />
          </div>

        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          {appState.isLoading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                {/* AI Brain Animation */}
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    {/* Brain outline */}
                    <div className="w-full h-full border-4 border-primary-200 rounded-full relative overflow-hidden">
                      <div className="w-full h-full border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    {/* Thinking dots */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic AI Stages */}
                <div className="space-y-4">
                  <div className="h-16 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse mx-auto mb-2"></div>
                      <div className="text-sm text-gray-600 animate-fade-in">
                        <AILoadingStage />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 italic">
                    The AI is probably overthinking this way more than necessary
                  </div>
                </div>
              </div>
            </div>
          )}

          {!appState.isLoading && !appState.currentComparison && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to generate examples?
              </h3>
              <p className="text-gray-600">
                Paste your project directions and choose your studio level to get started.
              </p>
            </div>
          )}

          {appState.currentComparison && !appState.isLoading && (
            <div className="space-y-6">
              {/* API Status Alert */}
              {appState.currentComparison.isMockData && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Demo Mode - Mock Data
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          The GPT-4 API is currently unavailable. You're seeing sample examples instead of AI-generated content.
                          {appState.currentComparison.apiError && (
                            <span className="block mt-1 font-mono text-xs">
                              Error: {appState.currentComparison.apiError}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Comparison Results
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleNewChallenge}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    New Challenge
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors"
                  >
                    Save Comparison
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExampleCard
                  example={appState.currentComparison.worldClass}
                  isWorldClass={true}
                  studio={appState.currentComparison.studio}
                  onEdit={() => handleEditExample(appState.currentComparison!.worldClass, true)}
                />

                <ExampleCard
                  example={appState.currentComparison.notApproved}
                  isWorldClass={false}
                  studio={appState.currentComparison.studio}
                  onEdit={() => handleEditExample(appState.currentComparison!.notApproved, false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <SaveModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveConfirm}
          defaultTitle={appState.currentComparison?.title || ''}
        />
      )}

      {showEditModal && editingExample && (
        <EditModal
          isOpen={showEditModal}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
          example={editingExample.example}
          title={editingExample.isWorldClass ? 'World-Class Example' : 'Not Approved Example'}
        />
      )}
    </div>
  );
};

export default Home;
