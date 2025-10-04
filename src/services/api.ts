import { 
  GenerateExamplesRequest, 
  GenerateExamplesResponse, 
  SaveComparisonRequest, 
  SaveComparisonResponse,
  Comparison,
  Studio
} from '../types';

// Backend API configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Studio-specific criteria (Acton-aligned)
const studioCriteria: Record<Studio, string[]> = {
  ES: [
    'Complete sentences with correct capitalization and punctuation',
    'Simple goal in my own words (starts with "My goal is…")',
    '3–5 step process written as "I…" statements',
    'At least one labeled piece of evidence attached [photo/scan/link]',
    'Name one source OR observation (book title, website, expert, or field note)',
    'Reflection includes one thing learned and one next step',
    'Kind, specific peer feedback mentioned (who and what changed)'
  ],
  MS: [
    'Clear goal + deliverable + due date stated up front',
    'Evidence attached with captions (artifact, data table, photos, links)',
    'At least two credible sources cited (title/author/link)',
    'Personal reflection explains how thinking changed',
    'Revision noted (how this is better than last time)',
    'Peer feedback loop documented (who reviewed, what changed)',
    'All listed criteria addressed (no missing sections)'
  ],
  LP: [
    'Professional tone and structure with clear headings',
    'Clear deliverable, constraints, and success metrics',
    'Three or more credible sources with in-line citations',
    'Original analysis supported by data/evidence (not summary)',
    'Comparison to a world-class example and gap analysis',
    'Real-world stakes shown (exhibition, contest, user test, stakeholder)',
    'Reflection on improvement vs. last iteration with next-step plan and date',
    'Attachments are well-formatted; all links verified'
  ]
};

export const generateExamples = async (request: GenerateExamplesRequest): Promise<GenerateExamplesResponse> => {
  const { studio, promptText } = request;
  
  console.log('Calling backend API:', {
    backendUrl: BACKEND_URL,
    studio,
    promptText: promptText.substring(0, 50) + '...'
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-examples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studio, promptText })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Backend API response:', { isMockData: data.isMockData, apiError: data.apiError });
    return data;

  } catch (error) {
    console.error('Error calling backend API:', error);
    
    // Fallback to mock data if backend is unavailable
    console.log('Backend unavailable, using mock data');
  return {
    worldClass: {
        text: generateMockWorldClass(studio, promptText),
        criteriaCovered: studioCriteria[studio].slice(0, 3)
    },
    notApproved: {
        text: generateMockNotApproved(studio, promptText),
        criteriaMissing: studioCriteria[studio].slice(3, 5)
      },
      criteriaAll: studioCriteria[studio],
      isMockData: true,
      apiError: `Backend unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Mock data generators as fallback
function generateMockWorldClass(studio: Studio, promptText: string): string {
  const t = promptText.length > 80 ? promptText.slice(0,80)+'...' : promptText;
  const ES = `Goal
My goal is to show I understand ${t}.

Process
I planned, tried, and fixed mistakes. I wrote notes each day.

Evidence
[Photo: my labeled work]
[Link: simple resource I used]

Reflection
I learned one clear idea and why it matters.
Next I will improve one part tomorrow.

Peer Feedback
A studio mate reviewed it. I changed two parts.

Next Step
I will add one more example and a clearer label.`;
  const MS = `Goal
Complete a clear deliverable on ${t} by Friday.

Process
Planned tasks, researched, built artifact, revised once after feedback.

Evidence
[Artifact link]
[Photo with caption]
[Data table]

Sources
Title, Author (link); Article (link).

Reflection
What changed in my thinking and why.

Peer Feedback
Reviewer: studio mate; Changes: clarified method and added caption.

Next Step
Specific improvement and due date; how this is better than last time.`;
  const LP = `Goal
Deliver a professional analysis of ${t} with defined success metrics.

Method
Brief method; constraints; risks.

Findings
Claims backed by evidence and concise interpretation.

Citations
3+ credible sources with in-line references.

World-Class Comparison
Gap vs. exemplar and plan to close it.

Stakeholder/Exhibition
Who saw it and what changed.

Reflection & Next Iteration
What improved vs last iteration; date for next test.`;
  return studio === 'ES' ? ES : studio === 'MS' ? MS : LP;
}

function generateMockNotApproved(studio: Studio, promptText: string): string {
  const t = promptText.length > 80 ? promptText.slice(0,80)+'...' : promptText;
  const ES = `Goal
I did a project about ${t}.

Process
I worked on it.

Evidence
(Nothing attached)

Reflection
I think it is good.`;
  const MS = `Goal
Research ${t}.

Process
Looked things up.

Evidence
Links not added; no captions.

Sources
Not listed.

Reflection
I learned a lot.`;
  const LP = `Overview
Project about ${t}.

Method
General search; not documented.

Findings
Summary without data.

Citations
Missing.

Reflection
Seems fine.`;
  return studio === 'ES' ? ES : studio === 'MS' ? MS : LP;
}

// Built-in guardrails for UI validation
export const validateResponse = (response: GenerateExamplesResponse, studio: Studio, criteriaAll: string[]) => {
  const warnings: string[] = [];
  
  // Ensure criteriaCovered ⊆ criteriaAll and criteriaMissing ⊆ criteriaAll
  const worldClassCriteria = response.worldClass.criteriaCovered || [];
  const notApprovedCriteria = response.notApproved.criteriaMissing || [];
  
  const invalidWorldClass = worldClassCriteria.filter(c => !criteriaAll.includes(c));
  const invalidNotApproved = notApprovedCriteria.filter(c => !criteriaAll.includes(c));
  
  if (invalidWorldClass.length > 0) {
    warnings.push(`World-Class example contains invalid criteria: ${invalidWorldClass.join(', ')}`);
  }
  
  if (invalidNotApproved.length > 0) {
    warnings.push(`Not Approved example contains invalid criteria: ${invalidNotApproved.join(', ')}`);
  }
  
  // Flag if ES length > ~200 words or LP < ~350 words
  const wordCount = (text: string) => text.split(/\s+/).length;
  const worldClassWords = wordCount(response.worldClass.text);
  const notApprovedWords = wordCount(response.notApproved.text);
  
  if (studio === 'ES' && (worldClassWords > 200 || notApprovedWords > 200)) {
    warnings.push(`ES examples may be too long (${worldClassWords}/${notApprovedWords} words)`);
  }
  
  if (studio === 'LP' && (worldClassWords < 350 || notApprovedWords < 350)) {
    warnings.push(`LP examples may be too short (${worldClassWords}/${notApprovedWords} words)`);
  }
  
  // Flag if evidence or sources appear in ❌ text when those are listed as missing
  const hasEvidence = (text: string) => /\[.*\]|link|photo|evidence|attachment/i.test(text);
  const hasSources = (text: string) => /source|citation|reference|author|title/i.test(text);
  
  if (response.notApproved.criteriaMissing?.some(c => c.toLowerCase().includes('evidence')) && 
      hasEvidence(response.notApproved.text)) {
    warnings.push('Not Approved example mentions evidence but lists evidence as missing');
  }
  
  if (response.notApproved.criteriaMissing?.some(c => c.toLowerCase().includes('source')) && 
      hasSources(response.notApproved.text)) {
    warnings.push('Not Approved example mentions sources but lists sources as missing');
  }
  
  // Soft-warn if banned terms slip through
  const bannedTerms = /\b(student|teacher|classroom|grade|homework)s?\b/gi;
  const worldClassBanned = response.worldClass.text.match(bannedTerms);
  const notApprovedBanned = response.notApproved.text.match(bannedTerms);
  
  if (worldClassBanned) {
    warnings.push(`World-Class example contains banned terms: ${worldClassBanned.join(', ')}`);
  }
  
  if (notApprovedBanned) {
    warnings.push(`Not Approved example contains banned terms: ${notApprovedBanned.join(', ')}`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};

export const saveComparison = async (request: SaveComparisonRequest): Promise<SaveComparisonResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real implementation, this would save to a database
  const id = Date.now().toString();
  
  return { id };
};

export const getSavedComparisons = async (studio?: Studio, search?: string): Promise<Comparison[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock saved comparisons - in production, fetch from database
  const mockSaved: Comparison[] = [
    {
      id: '1',
      title: 'Fractions Project - ES',
      studio: 'ES',
      promptText: 'Create a visual representation of equivalent fractions',
      worldClass: {
        text: generateMockWorldClass('ES', 'equivalent fractions'),
        criteriaCovered: studioCriteria.ES
      },
      notApproved: {
        text: generateMockNotApproved('ES', 'equivalent fractions'),
        criteriaMissing: studioCriteria.ES.slice(0, 2)
      },
      createdAt: '2024-01-15T10:30:00Z',
      createdByRole: 'Guide'
    },
    {
      id: '2',
      title: 'Renewable Energy Research - MS',
      studio: 'MS',
      promptText: 'Research and present findings on renewable energy impact',
      worldClass: {
        text: generateMockWorldClass('MS', 'renewable energy'),
        criteriaCovered: studioCriteria.MS
      },
      notApproved: {
        text: generateMockNotApproved('MS', 'renewable energy'),
        criteriaMissing: studioCriteria.MS.slice(0, 3)
      },
      createdAt: '2024-01-14T14:20:00Z',
      createdByRole: 'Learner'
    }
  ];

  let filtered = mockSaved;
  
  if (studio) {
    filtered = filtered.filter(comp => comp.studio === studio);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(comp => 
      comp.title.toLowerCase().includes(searchLower) ||
      comp.promptText.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

export const getComparison = async (id: string): Promise<Comparison> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock implementation - in real app, fetch from API
  const mockComparison: Comparison = {
    id,
    title: 'Sample Comparison',
    studio: 'MS',
    promptText: 'Sample prompt text',
    worldClass: {
      text: generateMockWorldClass('MS', 'sample topic'),
      criteriaCovered: studioCriteria.MS
    },
    notApproved: {
      text: generateMockNotApproved('MS', 'sample topic'),
      criteriaMissing: studioCriteria.MS.slice(0, 2)
    },
    createdAt: new Date().toISOString(),
    createdByRole: 'Learner'
  };

  return mockComparison;
};