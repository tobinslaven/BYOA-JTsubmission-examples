const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Debug environment variables
console.log('Environment check:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasOpenAIKeyAlt: !!process.env.OPENAI_KEY,
  keyLength: (process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '').length,
  frontendUrl: process.env.FRONTEND_URL,
  nodeEnv: process.env.NODE_ENV
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://tobinslaven.github.io',
    'https://tobinslaven.github.io/BYOA-JTsubmission-examples'
  ],
  credentials: true
}));
app.use(express.json());

// Studio-specific criteria (Acton-aligned)
const studioCriteria = {
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Generate examples endpoint
app.post('/api/generate-examples', async (req, res) => {
  try {
    const { studio, promptText } = req.body;

    // Validate input
    if (!studio || !promptText) {
      return res.status(400).json({ 
        error: 'Missing required fields: studio and promptText' 
      });
    }

    if (!['ES', 'MS', 'LP'].includes(studio)) {
      return res.status(400).json({ 
        error: 'Invalid studio. Must be ES, MS, or LP' 
      });
    }

    const criteria = studioCriteria[studio];
    console.log('Generating examples for:', { studio, promptText: promptText.substring(0, 50) + '...' });

    // Create comprehensive prompts for GPT-4
    const systemPrompt = studio === 'ES' ? 
      `Create two examples for Elementary Studio.

Project: ${promptText}

Return this exact JSON format only:
{
  "worldClass": {
    "text": "Goal\\nMy goal is to learn about the project.\\n\\nProcess\\nI planned what to do.\\nI tried different ways.\\nI wrote notes each day.\\n\\nEvidence\\n[Photo: my labeled work]\\n\\nReflection\\nI learned something new.\\nNext I will try harder.\\n\\nPeer Feedback\\nA studio mate helped me.\\n\\nNext Step\\nI will add more details.",
    "criteriaCovered": ["Complete sentences with correct capitalization and punctuation", "Simple goal in my own words", "3–5 step process written as statements"]
  },
  "notApproved": {
    "text": "Goal\\nI did a project.\\n\\nProcess\\nI worked on it.\\n\\nEvidence\\n(Nothing attached)\\n\\nReflection\\nIt was good.",
    "criteriaMissing": ["At least one labeled piece of evidence attached", "Name one source OR observation"]
  }
}` :
      `You are a Guide at Acton Academy. Your job is to produce two contrasting JourneyTracker (JT) submissions from project directions: a WORLD-CLASS example and a NOT APPROVED example.

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
- Use Acton terminology and studio context throughout.`;

    const userPrompt = studio === 'ES' ? 
      `Create examples for: ${promptText}` :
      `Project Directions: "${promptText}"

Studio: ${studio}
Criteria: ${JSON.stringify(criteria)}

Create TWO JourneyTracker submissions about these directions for the specified studio:

1) WORLD-CLASS EXAMPLE: Meets ALL criteria. Clear sections: Goal, Process, Evidence, Reflection, Peer Feedback, Next Step.
2) NOT APPROVED EXAMPLE: Misses SEVERAL key criteria (e.g., no evidence, vague goal, no sources, no revision). Keep tone respectful and realistic.

FORMATTING
- Write like real learner work with natural paragraph breaks and headings.
- Use \\n for line breaks. Keep readability aligned to the studio.

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no extra text.

{
  "worldClass": {
    "text": "full JT text with line breaks",
    "criteriaCovered": ["criteria1", "criteria2", "criteria3"]
  },
  "notApproved": {
    "text": "full JT text with line breaks",
    "criteriaMissing": ["criteria4", "criteria5"]
  }
}

Rules:
- "criteriaCovered" and "criteriaMissing" must be subsets of the provided Criteria array for ${studio}.
- Use Acton terms (learners, guides, studio, badge, session, exhibition, tribe, audit committee, world-class, JT).
- Do not ask a guide to approve a badge; suggest peer feedback or audit processes if relevant.`;

    // Calculate max tokens based on studio level
    const maxTokensByStudio = {
      ES: 800,  // Increased from 450
      MS: 900,
      LP: 1400
    };

    console.log('Calling OpenAI API for', studio, 'with', maxTokensByStudio[studio], 'max tokens');
    console.log('System prompt length:', systemPrompt.length);
    console.log('User prompt length:', userPrompt.length);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,  // Reduced from 0.4 for more consistent output
      max_tokens: maxTokensByStudio[studio]
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean up the response text - sometimes OpenAI includes extra text
      let cleanResponse = responseText.trim();
      
      // Remove any markdown code blocks if present
      cleanResponse = cleanResponse.replace(/```json\s*|\s*```/g, '');
      
      // Try to find JSON object
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanResponse;
      
      console.log('Raw response length for', studio, ':', responseText.length);
      console.log('JSON string length for', studio, ':', jsonString.length);
      
      parsedResponse = JSON.parse(jsonString);
      
      console.log('Successfully parsed JSON for', studio);
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response for', studio);
      console.error('Response text length:', responseText.length);
      console.error('Response text preview:', responseText.substring(0, 500));
      console.error('Parse error:', parseError.message);
      
      // Try multiple alternative parsing approaches
      try {
        // Try 1: Maybe it's wrapped in backticks
        const altMatch1 = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (altMatch1) {
          console.log('Trying alternative parsing with backticks...');
          parsedResponse = JSON.parse(altMatch1[1]);
          console.log('Alternative parsing with backticks successful for', studio);
        } else {
          // Try 2: Maybe it has extra text before/after JSON
          const altMatch2 = responseText.match(/(\{[\s\S]*?\})/);
          if (altMatch2) {
            console.log('Trying alternative parsing with text extraction...');
            parsedResponse = JSON.parse(altMatch2[1]);
            console.log('Alternative parsing with text extraction successful for', studio);
          } else {
            throw new Error('No valid JSON found in any format');
          }
        }
      } catch (altError) {
        console.error('All parsing attempts failed for', studio);
        throw new Error('Invalid response format from AI');
      }
    }

    // Validate the response structure
    if (!parsedResponse.worldClass || !parsedResponse.notApproved) {
      throw new Error('Invalid response structure from AI');
    }

    // Lightweight terminology cleanup
    const cleanupTerminology = (text) => {
      return text
        .replace(/\bstudent(s)?\b/gi, 'learner$1')
        .replace(/\bteacher(s)?\b/gi, 'guide$1')
        .replace(/\bclassroom(s)?\b/gi, 'studio$1');
    };

    // Apply terminology cleanup to both examples
    parsedResponse.worldClass.text = cleanupTerminology(parsedResponse.worldClass.text);
    parsedResponse.notApproved.text = cleanupTerminology(parsedResponse.notApproved.text);

    // Return successful response
    res.json({
      worldClass: {
        text: parsedResponse.worldClass.text,
        criteriaCovered: parsedResponse.worldClass.criteriaCovered || criteria.slice(0, 3)
      },
      notApproved: {
        text: parsedResponse.notApproved.text,
        criteriaMissing: parsedResponse.notApproved.criteriaMissing || criteria.slice(3, 5)
      },
      criteriaAll: criteria,
      isMockData: false
    });

  } catch (error) {
    console.error('Error generating examples:', error);
    
    // Return mock data as fallback
    const criteria = studioCriteria[req.body.studio] || studioCriteria.ES;
    const mockWorldClass = generateMockWorldClass(req.body.studio, req.body.promptText);
    const mockNotApproved = generateMockNotApproved(req.body.studio, req.body.promptText);
    
    res.json({
      worldClass: {
        text: mockWorldClass,
        criteriaCovered: criteria.slice(0, 3)
      },
      notApproved: {
        text: mockNotApproved,
        criteriaMissing: criteria.slice(3, 5)
      },
      criteriaAll: criteria,
      isMockData: true,
      apiError: error.message
    });
  }
});

// Mock data generators as fallback
function generateMockWorldClass(studio, promptText) {
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

function generateMockNotApproved(studio, promptText) {
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔑 API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});
