import React from 'react';
import { Studio } from '../types';

interface StudioToggleProps {
  activeStudio: Studio;
  onStudioChange: (studio: Studio) => void;
  disabled?: boolean;
}

const StudioToggle: React.FC<StudioToggleProps> = ({ 
  activeStudio, 
  onStudioChange, 
  disabled = false 
}) => {
  const studios: Studio[] = ['ES', 'MS', 'LP'];

  return (
    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
      {studios.map((studio) => (
        <button
          key={studio}
          onClick={() => onStudioChange(studio)}
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

