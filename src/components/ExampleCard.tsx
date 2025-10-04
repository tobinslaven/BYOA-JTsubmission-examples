import React from 'react';
import { Example, Studio } from '../types';

interface ExampleCardProps {
  example: Example;
  isWorldClass: boolean;
  studio: Studio;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  example,
  isWorldClass,
  studio
}) => {
  const title = isWorldClass ? 'World-Class Example' : 'Not Approved Example';
  const bgColor = isWorldClass ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200';
  const textColor = isWorldClass ? 'text-success-800' : 'text-error-800';
  const iconBg = isWorldClass ? 'bg-success-500' : 'bg-error-500';

  const criteria = isWorldClass ? example.criteriaCovered : example.criteriaMissing;

  return (
    <div className={`rounded-lg border-2 p-4 ${bgColor}`}>
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
        
      </div>

      <div className="mb-3">
        <div className={`p-3 rounded-md bg-white border ${textColor.includes('success') ? 'border-success-200' : 'border-error-200'}`}>
          <p className="text-sm leading-snug whitespace-pre-wrap">
            {example.text.split('\\n').join('\n')}
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

