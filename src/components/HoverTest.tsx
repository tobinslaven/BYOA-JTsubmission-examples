import React from 'react';

const HoverTest: React.FC = () => {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Hover Test</h2>
      
      {/* Test 1: Basic hover */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Test 1: Basic Hover</h3>
        <div className="group bg-blue-100 p-4 rounded">
          <p>Hover over this box</p>
          <button className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-2 py-1 rounded">
            Should appear on hover
          </button>
        </div>
      </div>

      {/* Test 2: Edit button simulation */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Test 2: Edit Button Simulation</h3>
        <div className="group bg-green-100 p-4 rounded">
          <div className="flex items-center justify-between">
            <span>Example Card</span>
            <button 
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
              title="Edit example"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Test 3: Delete button simulation */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Test 3: Delete Button Simulation</h3>
        <div className="group bg-yellow-100 p-4 rounded">
          <div className="flex items-center justify-between">
            <span>Saved Comparison</span>
            <button 
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
              title="Delete comparison"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverTest;
