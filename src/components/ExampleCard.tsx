import React from 'react';
import { Example, Studio } from '../types';

interface ExampleCardProps {
  example: Example;
  isWorldClass: boolean;
  studio: Studio;
  onEdit?: () => void;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  example,
  isWorldClass,
  studio,
  onEdit
}) => {
  const title = isWorldClass ? 'World-Class Example' : 'Not Approved Example';
  const bgColor = isWorldClass ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200';
  const textColor = isWorldClass ? 'text-success-800' : 'text-error-800';
  const iconBg = isWorldClass ? 'bg-success-500' : 'bg-error-500';

  const criteria = isWorldClass ? example.criteriaCovered : example.criteriaMissing;

  return (
    <div className={`group rounded-lg border-2 p-4 ${bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full ${iconBg}`}>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${textColor}`}>
              {title}
            </h3>
            <span className="text-xs text-gray-600">
              {studio} Level
            </span>
          </div>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
            title="Edit example"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-3">
        <div className={`p-3 rounded-md bg-white border ${textColor.includes('success') ? 'border-success-200' : 'border-error-200'}`}>
          <p className="text-sm leading-snug whitespace-pre-wrap">
            {example.text.replace(/\\n/g, '\n')}
          </p>
        </div>
      </div>

      {criteria && criteria.length > 0 && (
        <div className="space-y-2">
          <h4 className={`text-xs font-medium ${textColor}`}>
            {isWorldClass ? 'Criteria Met:' : 'Criteria Missing:'}
          </h4>
          <ul className={`space-y-1 text-xs ${textColor}`}>
            {criteria.map((criterion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
                  isWorldClass ? 'bg-success-500' : 'bg-error-500'
                }`}></span>
                <span className={isWorldClass ? '' : 'line-through'}>
                  {criterion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExampleCard;

