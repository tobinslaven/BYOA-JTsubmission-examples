import React from 'react';
import { Studio } from '../types';

interface StudioToggleProps {
  activeStudio: Studio | null;
  onStudioChange: (studio: Studio) => void;
  onStudioSubmit: (studio: Studio) => void;
  disabled?: boolean;
  hasPrompt?: boolean;
}

const StudioToggle: React.FC<StudioToggleProps> = ({ 
  activeStudio, 
  onStudioChange, 
  onStudioSubmit,
  disabled = false,
  hasPrompt = false
}) => {
  const studios: Studio[] = ['ES', 'MS', 'LP'];

  const handleStudioClick = (studio: Studio) => {
    onStudioChange(studio);
    if (hasPrompt) {
      onStudioSubmit(studio);
    }
  };

  return (
    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
      {studios.map((studio) => (
        <button
          key={studio}
          onClick={() => handleStudioClick(studio)}
          disabled={disabled}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeStudio === studio
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {studio}
        </button>
      ))}
    </div>
  );
};

export default StudioToggle;

