import React, { useState } from 'react';
import { Comparison } from '../types';

interface SavedResultsProps {
  savedComparisons: Comparison[];
  onLoadComparison: (comparison: Comparison) => void;
}

const SavedResults: React.FC<SavedResultsProps> = ({ savedComparisons, onLoadComparison }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudio, setSelectedStudio] = useState<'ALL' | 'ES' | 'MS' | 'LP'>('ALL');

  const filteredComparisons = savedComparisons.filter(comparison => {
    const matchesSearch = comparison.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comparison.promptText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStudio = selectedStudio === 'ALL' || comparison.studio === selectedStudio;
    return matchesSearch && matchesStudio;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStudioColor = (studio: string) => {
    switch (studio) {
      case 'ES': return 'bg-blue-100 text-blue-800';
      case 'MS': return 'bg-green-100 text-green-800';
      case 'LP': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Saved Results
        </h1>
        <p className="text-gray-600">
          Browse and reuse your saved comparison examples
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or prompt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="sm:w-48">
            <label htmlFor="studio-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Studio
            </label>
            <select
              id="studio-filter"
              value={selectedStudio}
              onChange={(e) => setSelectedStudio(e.target.value as 'ALL' | 'ES' | 'MS' | 'LP')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">All Studios</option>
              <option value="ES">Elementary Studio</option>
              <option value="MS">Middle Studio</option>
              <option value="LP">Launchpad Studio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredComparisons.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {savedComparisons.length === 0 ? 'No saved comparisons yet' : 'No matches found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {savedComparisons.length === 0 
              ? 'Generate your first comparison to see it saved here.'
              : 'Try adjusting your search terms or filters.'
            }
          </p>
          {savedComparisons.length === 0 && (
            <button
              onClick={() => {/* Navigate to home tab */}}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create First Comparison
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComparisons.map((comparison) => (
            <div
              key={comparison.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onLoadComparison(comparison)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  {comparison.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStudioColor(comparison.studio)}`}>
                  {comparison.studio}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {comparison.promptText}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(comparison.createdAt)}</span>
                <span>{comparison.createdByRole}</span>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Load Comparison →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {savedComparisons.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredComparisons.length} of {savedComparisons.length} comparisons
            </span>
            <div className="flex space-x-4">
              <span>ES: {savedComparisons.filter(c => c.studio === 'ES').length}</span>
              <span>MS: {savedComparisons.filter(c => c.studio === 'MS').length}</span>
              <span>LP: {savedComparisons.filter(c => c.studio === 'LP').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedResults;

