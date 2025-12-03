import { NextRequest, NextResponse } from 'next/server';
import { blogGenerationService, BlogGenerationRequest } from '../../../lib/blogGenerationService';
import { validateContentQuality, calculateQualityScore } from '../../../lib/contentValidation';
import { convertMarkdownToHTML, validateHTMLHeadings } from '../../../lib/markdownConverter';
import sanitizeHtml from 'sanitize-html';

function validateAndRefineContent(content: string): string {
  // Step 1: Convert Markdown to HTML (bold formatting is now handled by AI prompt)
  content = convertMarkdownToHTML(content);
  
  // Step 2: Post-processing for perspective and forbidden phrases
  // Ensure second-person perspective with improved conversion logic
  content = content.replace(/\b(I am|I'm|I have|I will|I can|I think|I believe|I feel|I know|I want|I need|I should|I must|I've|I'd|I'll|my|mine|myself|me)\b/gi, (match, offset, string) => {
    const secondPersonMap: { [key: string]: string } = {
      'i am': 'you are',
      "i'm": 'you are',
      'i have': 'you have',
      'i will': 'you will',
      'i can': 'you can',
      'i think': 'you might think',
      'i believe': 'you might believe',
      'i feel': 'you might feel',
      'i know': 'you know',
      'i want': 'you want',
      'i need': 'you need',
      'i should': 'you should',
      'i must': 'you must',
      "i've": 'you have',
      "i'd": 'you would',
      "i'll": 'you will',
      'my': 'your',
      'mine': 'yours',
      'myself': 'yourself',
      'me': 'you'
    };
    
    const lowerMatch = match.toLowerCase();
    const replacement = secondPersonMap[lowerMatch];
    
    if (!replacement) return match;
    
    // Handle capitalization - preserve original case pattern
    if (match[0] === match[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    
    return replacement;
  });
  
  // Additional pass for more complex grammatical patterns
  content = content.replace(/\b(I)\s+([a-z]+)/gi, (match, pronoun, followingWord) => {
    // Special handling for "I" followed by verbs
    const verbMap: { [key: string]: string } = {
      'am': 'are',
      'was': 'were',
      'have': 'have',
      'had': 'had',
      'do': 'do',
      'did': 'did',
      'will': 'will',
      'can': 'can',
      'could': 'could',
      'would': 'would',
      'should': 'should',
      'must': 'must',
      'might': 'might',
      'may': 'may'
    };
    
    const verb = followingWord.toLowerCase();
    if (verbMap[verb]) {
      return `you ${verbMap[verb]}`;
    }
    
    return match;
  });

  // Remove forbidden AI phrases
  const forbiddenPhrases = [
    'in this article',
    'this blog will discuss',
    'let\'s dive in',
    'furthermore',
    'moreover',
    'additionally',
    'thus',
    'in conclusion'
  ];

  forbiddenPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    content = content.replace(regex, '');
  });

  // Add conversational elements more context-awarely
  const hasQuestions = /\?/.test(content);
  const hasConversationalElements = /\b(honestly|you know what|take a moment|let me tell you|here's the thing|believe me|trust me|the thing is)\b/i.test(content);
  
  // Only add conversational elements if the content is formal or dry
  const isFormalContent = /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence|accordingly)\b/i.test(content) ||
                        /\b(the research indicates|studies show|it is important to note|it should be mentioned)\b/i.test(content);
  
  if (!hasQuestions && isFormalContent) {
    // Add a contextual rhetorical question in the first paragraph
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph.length > 100) {
      content = content.replace(/^([^?]*?\.)/, '$1 Have you ever wondered about this?');
    }
  }

  if (!hasConversationalElements && isFormalContent) {
    // Add conversational element only if content is very formal
    const sentences = content.split(/[.!?]+/);
    if (sentences.length > 3) {
      // Add after the first sentence, not at the very beginning
      content = content.replace(/^([^.!?]*[.!?])([^.!?]*[.!?])/, '$1 You know what?$2');
    }
  }

  // Ensure short sentences (break up long sentences)
  content = content.replace(/([^.!?]{60,}[.!?])/g, (match) => {
    return match.replace(/,/g, '. You\'ll find that');
  });

  // Clean up any empty paragraphs
  content = content.replace(/<p class="mb-4"><\/p>/g, '');
  content = content.replace(/<p class="mb-4">\s*<\/p>/g, '');

  return content.trim();
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { prompt, model = 'kimi-k2', emphasisSettings, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Prepare generation request
    const generationRequest: BlogGenerationRequest = {
      topic: prompt,
      model,
      emphasisSettings,
      options
    };

    // Check if streaming is requested
    const isStreaming = body.stream === true;

    if (isStreaming) {
      try {
        const stream = await blogGenerationService.generateStreamingBlog(generationRequest);
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error) {
        console.error('Streaming generation failed:', error);
        return NextResponse.json(
          { error: 'Streaming generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    } else {
      // Non-streaming generation
      const result = await blogGenerationService.generateBlog(generationRequest);

      // Sanitize HTML
      const sanitizedContent = sanitizeHtml(result.content, {
        allowedTags: [
          'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'strong', 'em', 'b', 'i',
          'ul', 'ol', 'li',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'blockquote',
          'br', 'hr'
        ],
        allowedAttributes: {
          'th': ['class'],
          'td': ['class'],
          'table': ['class']
        },
        allowedClasses: {
          'th': ['border', 'border-gray-300', 'px-4', 'py-3', 'text-left', 'font-semibold', 'text-gray-900'],
          'td': ['border', 'border-gray-300', 'px-4', 'py-3', 'text-gray-700'],
          'table': ['w-full', 'border-collapse', 'border', 'border-gray-300'],
          'blockquote': ['border-l-4', 'border-blue-500', 'pl-4', 'py-2', 'my-4', 'bg-blue-50', 'italic', 'text-gray-700'],
          'p': ['mb-4'],
          'h1': ['text-2xl', 'font-bold', 'mb-4', 'mt-6'],
          'h2': ['text-xl', 'font-semibold', 'mb-3', 'mt-5'],
          'h3': ['text-lg', 'font-medium', 'mb-2', 'mt-4'],
          'h4': ['text-base', 'font-medium', 'mb-2', 'mt-3'],
          'ul': ['list-disc', 'mb-4', 'ml-6'],
          'ol': ['list-decimal', 'mb-4', 'ml-6'],
          'li': ['ml-4', 'mb-1']
        },
        disallowedTagsMode: 'discard',
        allowVulnerableTags: false,
        enforceHtmlBoundary: true
      });

      // Validate content quality
      const qualityIssues = validateContentQuality(sanitizedContent);
      const finalQualityScore = calculateQualityScore(sanitizedContent);

      return NextResponse.json({
        content: sanitizedContent,
        metadata: result.metadata,
        qualityScore: finalQualityScore,
        qualityIssues,
        processingTime: Date.now() - startTime,
      });
    }
  } catch (error) {
    console.error('Blog generation error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate blog content',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}
