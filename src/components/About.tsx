import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About BYOA JT Submission Examples
        </h1>

        <div className="prose prose-gray max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                What is this tool?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                BYOA JT Submission Examples helps learners improve their JourneyTracker submissions 
                by providing clear contrast examples. By seeing what makes work "World-Class" versus 
                "Not Approved," learners can better understand expectations and self-correct before 
                posting to JourneyTracker.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Learner-Driven Excellence
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At Acton, we believe in learner-driven education where students take ownership of 
                their learning journey. This tool supports that philosophy by giving learners the 
                tools to evaluate and improve their own work independently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Studio Levels
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Elementary Studio (ES)</h3>
                  <p className="text-sm text-blue-800">
                    Focus on complete sentences, clear goals, evidence, and basic source citation. 
                    Examples use simple vocabulary and 2-4 sentence blocks.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Middle Studio (MS)</h3>
                  <p className="text-sm text-green-800">
                    Includes reflection, quality work standards, and moderate complexity. 
                    Examples demonstrate deeper thinking and analysis.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Launchpad Studio (LP)</h3>
                  <p className="text-sm text-purple-800">
                    Professional tone, detailed analysis, and comprehensive coverage. 
                    Examples reflect college-level expectations and rigor.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                How to Use This Tool
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Paste your project directions</strong> into the text area</li>
                  <li><strong>Choose your studio level</strong> (ES, MS, or LP)</li>
                  <li><strong>Click "Get Examples"</strong> to generate contrast examples</li>
                  <li><strong>Review the criteria</strong> met and missing in each example</li>
                  <li><strong>Use the examples</strong> to improve your own JT submission</li>
                  <li><strong>Save useful comparisons</strong> for future reference</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Success Criteria
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Target Outcomes</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 40% reduction in rejected submissions</li>
                    <li>• 30% increase in complete criteria coverage</li>
                    <li>• 3+ reuses per week per studio</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Quality Tips</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Use complete sentences</li>
                    <li>• Cite at least 2 sources</li>
                    <li>• Attach evidence (photos, links)</li>
                    <li>• Include personal reflection</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                For Guides
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This tool helps reduce low-quality JourneyTracker posts by giving learners clear 
                examples upfront. Use saved comparisons during launches and checkpoints to quickly 
                show level-appropriate exemplars. The contrast format makes it easy to discuss 
                what makes work excellent versus what needs improvement.
              </p>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Remember
              </h2>
              <p className="text-blue-800 leading-relaxed">
                These examples are meant to guide your thinking, not to be copied verbatim. 
                Make the work your own while following the quality standards demonstrated. 
                The goal is to help you understand what excellence looks like in your studio level.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

