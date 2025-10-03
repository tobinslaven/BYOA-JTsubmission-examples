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
                placeholder="Paste your project prompt here..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={appState.isLoading}
              />
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mt-2">
                Project Directions & Requirements
              </label>
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
