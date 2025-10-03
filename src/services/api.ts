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

// Studio-specific criteria
const studioCriteria = {
  ES: [
    'Complete sentences with proper grammar',
    'Clear goal or objective stated',
    'Evidence attached (photos, documents, links)',
    'At least 2 sources cited with specific details'
  ],
  MS: [
    'Complete sentences with proper grammar',
    'Clear goal or objective stated',
    'Evidence attached (photos, documents, links)',
    'At least 2 sources cited with specific details',
    'Personal reflection on learning included',
    'Demonstrates quality work and effort'
  ],
  LP: [
    'Complete sentences with proper grammar',
    'Clear goal or objective stated',
    'Evidence attached (photos, documents, links)',
    'At least 2 sources cited with specific details',
    'Personal reflection on learning included',
    'Demonstrates quality work and effort',
    'Professional tone and presentation',
    'Detailed analysis and critical thinking'
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
      criteriaAll: studioCriteria[studio]
    };
  }

  try {
    const criteria = studioCriteria[studio];
    
    // Create a comprehensive prompt for GPT-4
    const systemPrompt = `You are an expert educator helping students understand what makes a high-quality project submission. You will analyze project directions and create two contrasting examples: one that meets all criteria (world-class) and one that falls short (not approved).

For ${studio} level students, focus on these specific criteria:
${criteria.map((criterion, index) => `${index + 1}. ${criterion}`).join('\n')}

Create realistic, educational examples that clearly demonstrate the difference between meeting and missing these criteria. 

FORMATTING REQUIREMENTS:
- Write submissions as if they were actual student work with natural paragraph breaks
- Use proper line breaks and spacing to make text readable
- Structure submissions with clear sections (goal, process, evidence, reflection, etc.)
- Avoid walls of text - break content into digestible paragraphs`;

    const userPrompt = `Project Directions: "${promptText}"

Please create two examples for ${studio} level:

1. WORLD-CLASS EXAMPLE: A submission that meets ALL criteria and demonstrates excellence
2. NOT APPROVED EXAMPLE: A submission that misses several key criteria

IMPORTANT FORMATTING INSTRUCTIONS:
- Format the text like a real student submission with proper paragraph breaks
- Use line breaks (\\n) to separate different sections and ideas
- Make it look natural and readable, not like a wall of text
- Include proper spacing between different parts of the submission

For each example, also identify which specific criteria are met or missing.

Respond in this exact JSON format:
{
  "worldClass": {
    "text": "The complete world-class submission text here with proper line breaks and formatting...",
    "criteriaCovered": ["criterion 1", "criterion 2", "etc..."]
  },
  "notApproved": {
    "text": "The complete not-approved submission text here with proper line breaks and formatting...",
    "criteriaMissing": ["criterion 1", "criterion 2", "etc..."]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
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

    return {
      worldClass: {
        text: parsedResponse.worldClass.text,
        criteriaCovered: parsedResponse.worldClass.criteriaCovered || criteria
      },
      notApproved: {
        text: parsedResponse.notApproved.text,
        criteriaMissing: parsedResponse.notApproved.criteriaMissing || criteria.slice(0, 3)
      },
      criteriaAll: criteria
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
      criteriaAll: mockCriteria
    };
  }
};

// Mock data generators as fallback
function generateMockWorldClass(studio: Studio, promptText: string): string {
  const baseResponses = {
    ES: `I successfully completed my project about ${promptText.substring(0, 50)}... 

My goal was to understand the main concepts and demonstrate my learning clearly. I achieved this by following a structured approach and documenting my process.

I used two reliable sources: my textbook chapter on this topic and an educational website recommended by my teacher. These sources provided detailed information that helped me understand the material better.

I have attached photos of my work showing my step-by-step process, including my notes, sketches, and final project. I also included a summary document explaining what I learned.`,
    
    MS: `This project focused on ${promptText.substring(0, 50)}... and required comprehensive research and analysis.

My objective was to investigate the topic thoroughly and present my findings in a clear, organized manner. Through this project, I gained valuable insights into the subject matter.

Research Process:
I consulted multiple sources including peer-reviewed articles from our school database, interviews with experts in the field, and primary source documents. I took detailed notes and cross-referenced information to ensure accuracy.

Key Findings:
- [Finding 1 with specific evidence]
- [Finding 2 with supporting data]
- [Finding 3 with analysis]

Reflection: This project challenged me to think critically about the topic and develop my research skills. I learned the importance of verifying sources and presenting balanced perspectives.`,
    
    LP: `This comprehensive analysis examines ${promptText.substring(0, 50)}... through a rigorous academic approach that demonstrates advanced critical thinking and research methodology.

Research Objective: To conduct an in-depth investigation that contributes meaningful insights to the field of study while demonstrating mastery of advanced research techniques and analytical frameworks.

Methodology: I employed a mixed-methods approach combining quantitative data analysis, qualitative interviews with 8 subject matter experts, and comprehensive literature review of 15+ peer-reviewed sources from academic databases. I also conducted primary research through surveys and case study analysis.

Detailed Analysis: [Comprehensive analysis with specific examples, data points, and critical evaluation]

Professional Presentation: All findings are presented with proper academic formatting, citations, and professional language appropriate for advanced academic work.

Critical Reflection: This research project has significantly advanced my understanding of [topic] and has prepared me for advanced academic and professional work in this field.`
  };
  
  return baseResponses[studio];
}

function generateMockNotApproved(studio: Studio, promptText: string): string {
  const baseResponses = {
    ES: `I did my project about ${promptText.substring(0, 30)}... 

It was okay. I learned some stuff. My teacher helped me understand it better. I found some information online and in my book.

I think I did good work on this project.`,
    
    MS: `For this project I researched ${promptText.substring(0, 30)}... 

It was an interesting topic. I found some information about it and learned new things. I think the project went well overall.

I learned a lot from doing this research.`,
    
    LP: `This project was about ${promptText.substring(0, 30)}... 

I researched the topic and found some relevant information. The project helped me learn more about the subject matter.

I think my analysis was pretty good.`
  };
  
  return baseResponses[studio];
}

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