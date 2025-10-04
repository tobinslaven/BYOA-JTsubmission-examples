import OpenAI from 'openai';
import { 
  GenerateExamplesRequest, 
  GenerateExamplesResponse, 
  SaveComparisonRequest, 
  SaveComparisonResponse,
  Comparison,
  Studio
} from '../types';

// Initialize OpenAI client (only if API key is available)
let openai: OpenAI | null = null;

if (process.env.REACT_APP_OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Only for demo purposes - in production, use a backend
  });
}

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
  
  console.log('Environment check:', {
    hasKey: !!process.env.REACT_APP_OPENAI_API_KEY,
    keyLength: process.env.REACT_APP_OPENAI_API_KEY?.length || 0,
    keyPrefix: process.env.REACT_APP_OPENAI_API_KEY?.substring(0, 10) || 'none'
  });

  if (!openai || !process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY === 'your_api_key_here') {
    console.log('API Key not available, using mock data:', {
      hasKey: !!process.env.REACT_APP_OPENAI_API_KEY,
      keyValue: process.env.REACT_APP_OPENAI_API_KEY ? 'Present' : 'Missing'
    });
    
    // Return mock data instead of throwing an error
    return {
      worldClass: {
        text: generateMockWorldClass(studio, promptText),
        criteriaCovered: studioCriteria[studio].slice(0, 3) // Use first 3 criteria
      },
      notApproved: {
        text: generateMockNotApproved(studio, promptText),
        criteriaMissing: studioCriteria[studio].slice(3, 5) // Use last 2 criteria
      },
      criteriaAll: studioCriteria[studio],
      isMockData: true,
      apiError: 'API key not available or disabled'
    };
  }

  try {
    const criteria = studioCriteria[studio];
    console.log('Making GPT-4 API call with:', {
      studio,
      promptText: promptText.substring(0, 50) + '...',
      criteriaCount: criteria.length
    });
    
    // Create comprehensive prompts for GPT-4
    const systemPrompt = (studio: Studio, criteria: string[]) => `
You are a Guide at Acton Academy. Your job is to produce two contrasting JourneyTracker (JT) submissions from project directions: a WORLD-CLASS example and a NOT APPROVED example.

ACTON ETHOS & TERMS (MUST FOLLOW)
- Use: learners, guides, studio, badge, session, exhibition, tribe, audit committee, world-class, JourneyTracker (JT).
- Avoid: students, teacher(s), classroom, assignment(s), grade(s)/report card(s), homework. Use these only if quoted from the prompt.
- Guides never judge quality or approve badges; peers do. Encourage peer review, not guide approval.

EXCELLENCE ORIENTATION
- Standards focus on doing hard things with freedom and responsibility.
- For repeated attempts: flag improvement ("better than last time").
- In upper studios, note world-class comparison and public exhibition/contest when appropriate.

VOICE & READABILITY BY STUDIO
- ES (7–11): Grade 2–4 readability; short sentences (≤12 words); 2–4 sentence paragraphs; first-person "I… because… I noticed… Next I will…".
- MS (12–15): Grade 6–8 readability; short headings and bullets allowed; concrete evidence and simple citations.
- LP (16–18): Professional, concise, plain English; clear claims → evidence → citation; analytical tone.

STRUCTURE (use section labels in the text)
Goal • Process • Evidence • Reflection • Peer Feedback • Next Step

CRITERIA TO TARGET FOR ${studio}
${criteria.map((c,i)=>`${i+1}. ${c}`).join('\n')}

OUTPUT CONTRACT
- Return STRICT JSON only (no prose, no markdown, no code fences).
- Use natural paragraphing and \\n line breaks inside the JSON strings.
- WORLD-CLASS must explicitly satisfy the listed criteria for ${studio}.
- NOT APPROVED must clearly miss several key criteria in a realistic way (respectful tone, no sarcasm).
- Use Acton terminology and studio context throughout.
`;

    const userPrompt = (studio: Studio, promptText: string, criteria: string[]) => `
Project Directions: "${promptText}"

Studio: ${studio}
Criteria: ${JSON.stringify(criteria)}

Create TWO JourneyTracker submissions about these directions for the specified studio:

1) WORLD-CLASS EXAMPLE: Meets ALL criteria. Clear sections: Goal, Process, Evidence, Reflection, Peer Feedback, Next Step.
2) NOT APPROVED EXAMPLE: Misses SEVERAL key criteria (e.g., no evidence, vague goal, no sources, no revision). Keep tone respectful and realistic.

FORMATTING
- Write like real learner work with natural paragraph breaks and headings.
- Use \\n for line breaks. Keep readability aligned to the studio.

RETURN EXACT JSON (no extra text):
{
  "worldClass": {
    "text": "full JT text with line breaks",
    "criteriaCovered": ["...only from Criteria list..."]
  },
  "notApproved": {
    "text": "full JT text with line breaks",
    "criteriaMissing": ["...only from Criteria list..."]
  }
}

Rules:
- "criteriaCovered" and "criteriaMissing" must be subsets of the provided Criteria array for ${studio}.
- Use Acton terms (learners, guides, studio, badge, session, exhibition, tribe, audit committee, world-class, JT).
- Do not ask a guide to approve a badge; suggest peer feedback or audit processes if relevant.
`;

    // Calculate max tokens based on studio level
    const maxTokensByStudio = {
      ES: 450,
      MS: 900, 
      LP: 1400
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt(studio, criteria) },
        { role: "user", content: userPrompt(studio, promptText, criteria) }
      ],
      temperature: 0.4,
      max_tokens: maxTokensByStudio[studio]
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid response format from AI');
    }

    // Validate the response structure
    if (!parsedResponse.worldClass || !parsedResponse.notApproved) {
      throw new Error('Invalid response structure from AI');
    }

    // Lightweight terminology cleanup
    const cleanupTerminology = (text: string) => {
      return text
        .replace(/\bstudent(s)?\b/gi, 'learner$1')
        .replace(/\bteacher(s)?\b/gi, 'guide$1')
        .replace(/\bclassroom(s)?\b/gi, 'studio$1');
    };

    // Apply terminology cleanup to both examples
    parsedResponse.worldClass.text = cleanupTerminology(parsedResponse.worldClass.text);
    parsedResponse.notApproved.text = cleanupTerminology(parsedResponse.notApproved.text);

           return {
             worldClass: {
               text: parsedResponse.worldClass.text,
               criteriaCovered: parsedResponse.worldClass.criteriaCovered || criteria
             },
             notApproved: {
               text: parsedResponse.notApproved.text,
               criteriaMissing: parsedResponse.notApproved.criteriaMissing || criteria.slice(0, 3)
             },
             criteriaAll: criteria,
             isMockData: false
           };

  } catch (error) {
    console.error('Error calling GPT-4 API:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Fallback to mock data if API fails
    console.log('Falling back to mock data due to API error');
    
    const mockCriteria = studioCriteria[studio];
    const mockWorldClass = generateMockWorldClass(studio, promptText);
    const mockNotApproved = generateMockNotApproved(studio, promptText);
  
  return {
    worldClass: {
        text: mockWorldClass,
        criteriaCovered: mockCriteria
    },
    notApproved: {
        text: mockNotApproved,
        criteriaMissing: mockCriteria.slice(0, 3)
      },
      criteriaAll: mockCriteria,
      isMockData: true,
      apiError: error instanceof Error ? error.message : 'API call failed'
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