import React, { useState } from 'react';
import { AppState, Studio, Comparison } from '../types';
import StudioToggle from './StudioToggle';
import ExampleCard from './ExampleCard';
import SaveModal from './SaveModal';

interface HomeProps {
  appState: AppState;
  onGenerateExamples: (promptText: string, studio: Studio) => void;
  onSaveComparison: (title?: string) => void;
  onLoadComparison: (comparison: Comparison) => void;
  onStudioChange: (studio: Studio) => void;
  onClearResults: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Home: React.FC<HomeProps> = ({
  appState,
  onGenerateExamples,
  onSaveComparison,
  onLoadComparison,
  onStudioChange,
  onClearResults,
  onShowToast
}) => {
  const [promptText, setPromptText] = useState(appState.currentPrompt);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim()) {
      onGenerateExamples(promptText.trim(), appState.activeStudio);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={appState.isLoading}
            />

            <button
              type="submit"
              disabled={!promptText.trim() || appState.isLoading}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {appState.isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{appState.isLoading ? 'AI is Working...' : 'Get Examples'}</span>
            </button>
          </form>

        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          {appState.isLoading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
                {/* Simple Elegant Animation */}
                <div className="mb-8">
                  <div className="w-12 h-12 mx-auto mb-4">
                    <div className="w-full h-full border-4 border-primary-200 rounded-full">
                      <div className="w-full h-full border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Clean Message */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Generating Examples
                  </h3>
                  <p className="text-gray-600">
                    Creating world-class and not-approved examples for {appState.activeStudio} level
                  </p>
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
                />

                <ExampleCard
                  example={appState.currentComparison.notApproved}
                  isWorldClass={false}
                  studio={appState.currentComparison.studio}
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
    </div>
  );
};

export default Home;
