import { moonshotClient, MoonshotMessage } from './moonshotClient';
import { convertMarkdownToHTML } from './markdownConverter';
import sanitizeHtml from 'sanitize-html';

export interface BlogGenerationRequest {
  topic: string;
  model: 'kimi-k2' | 'other';
  emphasisSettings?: {
    enabled: boolean;
    intensity: 'subtle' | 'moderate' | 'strong';
  };
  options?: {
    tone?: 'conversational' | 'professional' | 'casual';
    length?: 'short' | 'medium' | 'long';
    includeExamples?: boolean;
    targetAudience?: string;
  };
}

export interface BlogGenerationResponse {
  content: string;
  metadata: {
    model: string;
    tokensUsed: number;
    processingTime: number;
    qualityScore: number;
    tableInfo?: {
      hasTables: boolean;
      tableCount: number;
      isValidMarkdown: boolean;
      tableTitles: string[];
    };
  };
}

export class BlogGenerationServiceFixed {

  private generateSystemPrompt(options: BlogGenerationRequest['options'], emphasisSettings?: BlogGenerationRequest['emphasisSettings']): string {
    const { length = 'medium', targetAudience, tone = 'conversational' } = options || {};
    const boldIntensity = emphasisSettings?.enabled ? emphasisSettings.intensity : 'moderate';
    
    const boldInstructions = {
      subtle: 'Use bold sparingly: 1-2 bold phrases per section maximum.',
      moderate: 'Use bold moderately: 2-3 bold phrases per section.',
      strong: 'Use bold prominently: 3-4 bold phrases per section for emphasis.'
    };

    const toneInstructions = {
      conversational: 'Write like you\'re talking to a friend over coffee. Friendly, approachable, and engaging.',
      professional: 'Write like an industry expert sharing insights. Authoritative but accessible.',
      casual: 'Write like a relaxed conversation. Very informal, light, and easy to read.'
    };
    
    const prompt = `You are Kimi, an expert blog writer specializing in creating content that perfectly matches the given title. Write in clean Markdown with a ${tone} tone.

TITLE-FOCUSED WRITING (CRITICAL)
- The blog content MUST directly address and expand upon the given title
- Every section should relate back to the main title topic
- Use the exact title or variations of it naturally throughout the content
- Ensure the blog delivers on the promise made by the title

WRITING STYLE
- Use short paragraphs (max 40 words)
- Use second-person ("you", "your") consistently
- Write like a human expert: clear, helpful, authentic
- Mix long and short sentences for natural flow
- Add rhetorical questions to engage readers

STRUCTURE REQUIREMENTS
- Compelling title (H1) - ${length === 'short' ? '3-5' : length === 'long' ? '7-9' : '5-7'} main sections (H2)
- H3 subheadings when appropriate
- 1-2 practical examples per major point
- Strong, actionable conclusion

FORMATTING RULES (VERY IMPORTANT)
1) **Bold Text** - ${boldInstructions[boldIntensity]}
   - Bold only meaningful insights and key takeaways
   - Bold phrases should be 3-8 words maximum
   - Use **double asterisks** only for bold formatting

2) **Tables** - Include exactly ONE helpful comparison table
   - 2-5 columns, 3-8 rows maximum
   - Short, scannable text only
   - Add a descriptive title before the table like: **Key Differences**
   - Use proper Markdown table syntax

3) **Blockquotes** - Add TWO short, impactful quotes
   - Use Markdown: > short, powerful insight
   - Quotes should be 1-2 sentences maximum
   - Never place quotes inside lists or tables

CONTENT QUALITY STANDARDS
- Provide practical, actionable advice
- Use real-world examples and comparisons
- Include checklists and step-by-step guidance
- Avoid generic motivation and fluff
- Be specific and detailed without overexplaining

TONE AND VOICE
${toneInstructions[tone]}

TECHNICAL REQUIREMENTS
- Write approximately ${length === 'short' ? '800-1200' : length === 'long' ? '2000-2500' : '1500-2000'} words
- Target audience: ${targetAudience || 'general readers'}
- Focus on clarity and readability
- Ensure all content directly supports the title promise`;
    
    return prompt;
  }

  private generateUserPrompt(topic: string): string {
    return `Create a comprehensive, engaging blog article that fully delivers on the title "${topic}". 

Requirements:
- The content must directly address the title's promise
- Provide real, actionable value that readers can apply immediately
- Structure the article to flow logically from introduction to conclusion
- Include specific examples, practical tips, and clear takeaways
- Ensure every section relates to and supports the main title topic
- Write content that makes readers feel they've gained valuable insights

Focus on creating content that readers will find genuinely useful and worth sharing.`;
  }

  async generateBlog(request: BlogGenerationRequest): Promise<BlogGenerationResponse> {
    const startTime = Date.now();
    
    try {
      const systemPrompt = this.generateSystemPrompt(request.options, request.emphasisSettings);
      const userPrompt = this.generateUserPrompt(request.topic);

      const messages: MoonshotMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      console.log('🚀 Making simplified AI request...');
      const response = await moonshotClient.createChatCompletion({
        model: process.env.MOONSHOT_MODEL || 'kimi-k2-turbo-preview',
        messages,
        temperature: parseFloat(process.env.MOONSHOT_TEMPERATURE || '0.6'),
        max_tokens: parseInt(process.env.MOONSHOT_MAX_TOKENS || '2000'), // Reduced tokens for faster response
      });

      const processingTime = Date.now() - startTime;
      let content = response.choices[0]?.message?.content || '';

      // Convert Markdown to HTML
      content = convertMarkdownToHTML(content);
      
      // Simple sanitization
      const sanitizedContent = sanitizeHtml(content, {
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

      console.log('✅ Simplified blog generation completed');

      return {
        content: sanitizedContent,
        metadata: {
          model: request.model,
          tokensUsed: response.usage?.total_tokens || 0,
          processingTime,
          qualityScore: 100 // Simple score for now
        }
      };
    } catch (error) {
      console.error('Simplified blog generation failed:', error);
      throw new Error(`Failed to generate blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStreamingBlog(
    request: BlogGenerationRequest
  ): Promise<ReadableStream<string>> {
    const systemPrompt = this.generateSystemPrompt(request.options, request.emphasisSettings);
    const userPrompt = this.generateUserPrompt(request.topic);

    const messages: MoonshotMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    if (request.model === 'kimi-k2') {
      const stream = await moonshotClient.createStreamingChatCompletion({
        model: process.env.MOONSHOT_MODEL || 'kimi-k2-turbo-preview',
        messages,
        temperature: parseFloat(process.env.MOONSHOT_TEMPERATURE || '0.6'),
        max_tokens: parseInt(process.env.MOONSHOT_MAX_TOKENS || '2000'),
      });

      return this.processStream(stream);
    } else {
      throw new Error('Streaming not supported for other models yet');
    }
  }

  private async processStream(
    stream: AsyncIterable<any>
  ): Promise<ReadableStream<string>> {
    const encoder = new TextEncoder();
    let accumulatedContent = '';

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              accumulatedContent += content;
              controller.enqueue(content);
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }
}

export const blogGenerationServiceFixed = new BlogGenerationServiceFixed();
