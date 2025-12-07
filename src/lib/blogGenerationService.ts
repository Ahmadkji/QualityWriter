import { moonshotClient, MoonshotMessage } from './moonshotClient';
import { convertMarkdownToHTML } from './markdownConverter';

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

export class BlogGenerationService {

  private generateSystemPrompt(options: BlogGenerationRequest['options'], emphasisSettings?: BlogGenerationRequest['emphasisSettings']): string {
    // For debugging: Use the official prompt first, then gradually add complexity
    const useSimplePrompt = process.env.USE_SIMPLE_PROMPT === 'true';
    
    if (useSimplePrompt) {
      console.log('🎯 Using simplified system prompt for debugging');
      return "You are Kimi, an AI assistant provided by Moonshot AI. You are proficient in Chinese and English conversations. You provide users with safe, helpful, and accurate answers. You will reject any requests involving terrorism, racism, or explicit content. Moonshot AI is a proper noun and should not be translated.";
    }
    
    const { length = 'medium', targetAudience } = options || {};
    
    // OPTIMIZED: Use your specific optimized prompt template
    const prompt = `You are Kimi, an expert blog writer. Write in clean Markdown. Use a friendly and direct tone.
Never use phrases like "in this article," "furthermore," or "in conclusion."

WRITING STYLE
- Use short paragraphs (max 40 words).
- Use second-person ("you", "your").
- Write like a human expert: clear, calm, helpful.
- Mix long + short sentences for flow.
- Add rhetorical questions naturally.

STRUCTURE
- Strong intro
- 5–8 H2 sections
- H3s when needed
- 1–2 examples per major point
- Strong ending

FORMATTING RULES (VERY IMPORTANT)
1) **Bold**
   - Bold only meaningful insights (3–8 words).
   - ${emphasisSettings?.intensity || 'moderate'} level: ${
      emphasisSettings?.intensity === 'subtle'
        ? '1–2 bold uses per section.'
        : emphasisSettings?.intensity === 'strong'
        ? '3–4 bold uses per section.'
        : '2–3 bold uses per section.'
    }
   - Use **double asterisks** only.

2) **Tables**
   - Include exactly ONE helpful table.
   - 2–5 columns, 3–8 rows, short text only.
   - Always add a title before the table like: **Feature Comparison**
   - Valid Markdown only.

3) **Quotes**
   - Add TWO short blockquotes using Markdown:
     > short, powerful, 1–2 sentence insight.
   - Never put quotes inside lists or tables.

CONTENT STYLE
- Give practical, real-life advice.
- Use examples, checklists, comparisons.
- No generic motivation. No fluff.
- Avoid overexplaining.

OUTPUT
Write ~${length === 'short'
  ? '1000'
  : length === 'long'
  ? '2000'
  : '1500'} words.
Target audience: ${targetAudience || 'general readers'}.`;
    
    console.log('📝 Generated optimized system prompt length:', prompt.length, 'characters');
    return prompt;
  }


  private generateUserPrompt(topic: string): string {
    return `Write a comprehensive blog article about "${topic}" that provides real value to the reader. Focus on practical insights, actionable advice, and engaging content that keeps readers interested from start to finish.`;
  }

  async generateBlog(request: BlogGenerationRequest): Promise<BlogGenerationResponse> {
    const startTime = Date.now();
    
    try {
      if (request.model === 'kimi-k2') {
        return await this.generateWithKimiK2(request, startTime);
      } else {
        throw new Error('Other models not implemented yet');
      }
    } catch (error) {
      console.error('Blog generation failed:', error);
      throw error;
    }
  }

  private async generateWithKimiK2(
    request: BlogGenerationRequest,
    startTime: number
  ): Promise<BlogGenerationResponse> {
    const systemPrompt = this.generateSystemPrompt(request.options, request.emphasisSettings);
    const userPrompt = this.generateUserPrompt(request.topic);

    const messages: MoonshotMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await moonshotClient.createChatCompletion({
        model: process.env.MOONSHOT_MODEL || 'kimi-k2-turbo-preview',
        messages,
        temperature: parseFloat(process.env.MOONSHOT_TEMPERATURE || '0.6'),
        max_tokens: parseInt(process.env.MOONSHOT_MAX_TOKENS || '4000'),
      });

      const processingTime = Date.now() - startTime;
      let content = response.choices[0]?.message?.content || '';

      // Convert Markdown to HTML only (bold formatting is now handled by AI prompt)
      content = convertMarkdownToHTML(content);

      // Calculate quality score and validate tables
      const qualityScore = this.calculateQualityScore(content);
      const tableValidation = this.validateTableContent(content);

      return {
        content,
        metadata: {
          model: 'kimi-k2',
          tokensUsed: response.usage?.total_tokens || 0,
          processingTime,
          qualityScore,
          tableInfo: {
            hasTables: tableValidation.hasTables,
            tableCount: tableValidation.tableCount,
            isValidMarkdown: tableValidation.isValidMarkdown,
            tableTitles: tableValidation.tableTitles
          }
        }
      };
    } catch (error) {
      console.error('Kimi K2 generation failed:', error);
      throw new Error(`Failed to generate blog with Kimi K2: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        max_tokens: parseInt(process.env.MOONSHOT_MAX_TOKENS || '4000'),
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

  private validateTableContent(content: string): {
    hasTables: boolean;
    tableCount: number;
    isValidMarkdown: boolean;
    tableTitles: string[];
  } {
    // Check for Markdown tables
    const tableRegex = /\|.*\|[\r\n]+\|.*\|[\r\n]+\|.*\|/g;
    const tables = content.match(tableRegex) || [];
    
    // Check for table titles (bold text before tables)
    const titleRegex = /\*\*([^*]+)\*\*[\r\n]+\|.*\|[\r\n]+\|.*\|[\r\n]+\|.*\|/g;
    const titleMatches = [];
    let match;
    while ((match = titleRegex.exec(content)) !== null) {
      titleMatches.push(match);
    }
    const tableTitles = titleMatches.map(match => match[1].trim());
    
    // Basic validation of table structure
    let isValidMarkdown = true;
    tables.forEach(table => {
      const lines = table.trim().split('\n');
      if (lines.length < 3) {
        isValidMarkdown = false;
        return;
      }
      
      // Check if all rows have same number of columns
      const columnCounts = lines.map(line =>
        line.split('|').filter(cell => cell.trim() !== '').length
      );
      
      if (columnCounts.length > 0) {
        const firstCount = columnCounts[0];
        if (!columnCounts.every(count => count === firstCount)) {
          isValidMarkdown = false;
        }
      }
    });
    
    return {
      hasTables: tables.length > 0,
      tableCount: tables.length,
      isValidMarkdown,
      tableTitles
    };
  }

  private validateQuoteContent(content: string): {
    hasQuotes: boolean;
    quoteCount: number;
    isValidMarkdown: boolean;
    quoteDensity: number;
  } {
    // Check for Markdown blockquotes
    const quoteRegex = /^>\s+(.+)$/gm;
    const quotes = content.match(quoteRegex) || [];
    
    // Check for proper quote formatting (blank lines before and after)
    const properQuoteRegex = /(?:\n\s*\n|^)\s*>\s+(.+?)(?:\s*\n\s*\n|$)/gm;
    const properQuotes = content.match(properQuoteRegex) || [];
    
    // Check for quotes inside lists or tables (should not exist)
    const quotesInLists = content.match(/(?:[-*+]\s*|^\|\s*.*\|\s*)>\s+/gm) || [];
    const quotesInTables = content.match(/\|[^|]*>\s+[^|]*\|/g) || [];
    
    // Basic validation of quote structure
    let isValidMarkdown = true;
    if (quotesInLists.length > 0 || quotesInTables.length > 0) {
      isValidMarkdown = false;
    }
    
    // Check for quote length (should be 1-2 sentences)
    quotes.forEach(quote => {
      const quoteText = quote.replace(/^>\s+/, '').trim();
      const sentenceCount = quoteText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      if (sentenceCount > 2) {
        isValidMarkdown = false;
      }
    });
    
    // Calculate quote density (quotes per 400 words)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const quoteDensity = wordCount > 0 ? (quotes.length / wordCount) * 400 : 0;
    
    return {
      hasQuotes: quotes.length > 0,
      quoteCount: quotes.length,
      isValidMarkdown,
      quoteDensity
    };
  }

  private calculateQualityScore(content: string): number {
    let score = 100;
    
    // Check for minimum content length
    if (content.length < 1000) score -= 20;
    
    // Check for heading structure
    const headingCount = (content.match(/<h[1-6]/g) || []).length;
    if (headingCount < 5) score -= 15;
    
    // Check for paragraph length
    const paragraphs = content.split(/<\/p>/);
    const longParagraphs = paragraphs.filter(p =>
      p.replace(/<[^>]*>/g, '').split(/\s+/).length > 40
    );
    if (longParagraphs.length > 0) score -= 10;
    
    // Check for bullet points
    const bulletCount = (content.match(/<li>/g) || []).length;
    if (bulletCount < 2) score -= 10;
    
    // NEW: Check for table presence and quality
    const tableValidation = this.validateTableContent(content);
    if (!tableValidation.hasTables) {
      score -= 25; // Significant penalty for missing tables
    } else {
      // Bonus for proper table formatting
      if (tableValidation.isValidMarkdown) score += 5;
      
      // Bonus for table titles
      if (tableValidation.tableTitles.length > 0) score += 5;
      
      // Small penalty for too many tables
      const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const tablesPer1000Words = (tableValidation.tableCount / wordCount) * 1000;
      if (tablesPer1000Words > 2) score -= 5;
    }
    
    // NEW: Check for quote presence and quality
    const quoteValidation = this.validateQuoteContent(content);
    if (quoteValidation.quoteCount < 2) {
      score -= 20; // Significant penalty for insufficient quotes
    } else {
      // Bonus for proper quote formatting
      if (quoteValidation.isValidMarkdown) score += 5;
      
      // Bonus for proper quote density (not too many, not too few)
      if (quoteValidation.quoteDensity >= 0.8 && quoteValidation.quoteDensity <= 1.2) score += 5;
      
      // Penalty for too many quotes
      if (quoteValidation.quoteDensity > 1.5) score -= 10;
    }
    
    return Math.max(0, score);
  }
}

export const blogGenerationService = new BlogGenerationService();