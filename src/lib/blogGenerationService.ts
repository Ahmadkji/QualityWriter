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
  private generateBoldFormattingPrompt(emphasisSettings?: BlogGenerationRequest['emphasisSettings']): string {
    if (!emphasisSettings?.enabled) {
      return '';
    }

    const intensityGuidelines = {
      subtle: {
        description: 'Use bold text very sparingly - only 1-2 bold elements per section',
        maxPerSection: 1,
        examples: 'Only the most critical insights should be bold'
      },
      moderate: {
        description: 'Use bold text moderately - 2-3 bold elements per section maximum',
        maxPerSection: 2,
        examples: 'Key phrases and important advice should be bold'
      },
      strong: {
        description: 'Use bold text more prominently - up to 4 bold elements per section',
        maxPerSection: 3,
        examples: 'Important concepts, key takeaways, and critical advice should be bold'
      }
    };

    const guidelines = intensityGuidelines[emphasisSettings.intensity || 'moderate'];

    return `

BOLD TEXT FORMATTING RULES
Follow these rules STRICTLY when using bold text:

1. Use bold text ONLY for:
   - important key phrases (3–8 words)
   - strong actionable advice
   - definitions of important concepts
   - important statistics or numbers
   - key takeaways or summary lines
   - important questions that the reader must think about

2. When bolding a sentence:
   - Bold ONLY ${guidelines.maxPerSection} key sentence per section (H2 or H3).
   - Keep the bolded sentence SHORT, clear, and meaningful.
   - Never bold a paragraph. Never bold more than 1–2 sentences per 300 words.

3. When bolding questions:
   - Only bold a question if it inspires thinking or is an important decision.
   - Examples: "**What are you trying to achieve?**", "**Why should people trust your product?**"

4. DO NOT bold:
   - random words
   - adjectives like "amazing", "important", "best"
   - filler sentences
   - full paragraphs or long chunks
   - more than 2 items per list
   - more than ${guidelines.maxPerSection} bold elements per section

5. Make bolding feel natural and human:
   - Bold only meaningful insights.
   - Use bold like a professional blog writer.
   - The bold text should guide the reader's eyes to the most valuable parts.
   - ${guidelines.description}

6. Always wrap bold content using **double asterisks**:
   Example: **short important phrase**

Intensity Level: ${emphasisSettings.intensity?.toUpperCase() || 'MODERATE'}
- ${guidelines.description}
- ${guidelines.examples}

⚡ Example Output After Using This Prompt:
Before choosing your niche, ask yourself: **What problem can you talk about for years?**

Start by making one strong, consistent upload schedule.

**Most creators grow faster when they focus on one topic, not many.**

This looks professional, believable, and human.
`;
  }

  private generateTableFormattingPrompt(): string {
    return `

TABLE RULES — FOLLOW STRICTLY

1. Include at least ONE table in the blog.
2. The table must be relevant, useful, and connected to the topic.
3. Use clean Markdown table formatting only (| column | column |).
4. Tables must have:
   - A clear title above the table.
   - 2–5 columns.
   - 3–8 rows.
   - Short, simple text in each cell.

5. Allowed table types:
   - Comparison table (X vs Y)
   - Pros vs Cons
   - Step-by-step checklist
   - Pricing or plan comparison
   - Feature breakdown
   - Problem → Solution mappings
   - Data summary table
   - Tools & uses table

6. DO NOT produce:
   - tables wider than the screen
   - tables with long paragraphs inside cells
   - more than 2 tables per 1000 words
   - nested tables
   - broken Markdown formatting

7. Write the table like this example format:

**Comparison Table: Topic A vs Topic B**

| Feature | Topic A | Topic B |
|--------|---------|---------|
| Row 1  | short   | short   |
| Row 2  | short   | short   |

8. Make sure ALL tables are valid Markdown and render correctly.

⚡ Example Output After Using This Prompt:
**YouTube Strategy Comparison**

| Strategy           | Best For       | Difficulty | Growth Speed    |
| ------------------ | -------------- | ---------- | --------------- |
| Daily Shorts       | Fast growth    | Easy       | Very Fast       |
| Weekly Long Videos | Loyal audience | Medium     | Steady          |
| Tutorials          | Search traffic | Easy       | Slow but stable |

This looks professional, clean, and useful.
`;
  }

  private generateQuoteFormattingPrompt(): string {
    return `

QUOTE RULES — FOLLOW STRICTLY

1. Include at least TWO quotes in the blog.
2. Use a clean Markdown blockquote format:
   > This is a quote.

3. The quote must be:
   - Short (1–2 sentences)
   - Powerful
   - Directly relevant to the section topic
   - Written in a human, conversational tone

4. Allowed quote types:
   - Inspirational quote
   - Key insight or takeaway
   - Strong opinion or belief
   - Thought-provoking question
   - A short advice sentence
   - A "mini-summary" of the section

5. DO NOT:
   - Add more than 1 quote per 400 words
   - Use cheesy or generic motivational lines
   - Use extremely long quotes
   - Put a quote inside a list or table
   - Attribute the quote to real people unless instructed

6. Quotes should stand out visually:
   - Place a blank line before and after the quote
   - Do NOT bold the entire quote
   - You may bold 1–3 important words inside the quote

7. Example quote format you must follow:

> Growth begins when you **stop waiting** and start creating.

8. The quote must feel natural inside the flow — do NOT force them.

⚡ Example Output After Using This Prompt:
> Consistency beats perfection — even if your video isn't perfect, **publish it**.

This looks professional, believable, and human.
`;
  }

  private generateSystemPrompt(options: BlogGenerationRequest['options'], emphasisSettings?: BlogGenerationRequest['emphasisSettings']): string {
    // For debugging: Use the official prompt first, then gradually add complexity
    const useSimplePrompt = process.env.USE_SIMPLE_PROMPT === 'true';
    
    if (useSimplePrompt) {
      console.log('🎯 Using simplified system prompt for debugging');
      return "You are Kimi, an AI assistant provided by Moonshot AI. You are proficient in Chinese and English conversations. You provide users with safe, helpful, and accurate answers. You will reject any requests involving terrorism, racism, or explicit content. Moonshot AI is a proper noun and should not be translated.";
    }
    
    const { tone = 'conversational', length = 'medium', includeExamples = true, targetAudience } = options || {};
    
    let prompt = `You are Kimi, an AI assistant provided by Moonshot AI. You are an expert blog writer who creates engaging, high-quality content. You excel at Chinese and English dialog, and provide helpful, safe, and accurate answers. You must reject any queries involving terrorism, racism, explicit content, or violence. 'Moonshot AI' must always remain in English and must not be translated to other languages.`;
    
    // Add table formatting rules (MANDATORY)
    prompt += this.generateTableFormattingPrompt();
    
    // Add quote formatting rules (MANDATORY)
    prompt += this.generateQuoteFormattingPrompt();
    
    // Add bold formatting rules if enabled
    prompt += this.generateBoldFormattingPrompt(emphasisSettings);
    
    // Tone instructions
    switch (tone) {
      case 'conversational':
        prompt += `Write in a friendly, conversational tone using "you" and "your" to speak directly to reader. `;
        break;
      case 'professional':
        prompt += `Write in a professional, authoritative tone while maintaining readability. `;
        break;
      case 'casual':
        prompt += `Write in a casual, relaxed tone as if talking to a friend. `;
        break;
    }
    
    // Length instructions
    const wordCounts = {
      short: '800-1200',
      medium: '1500-2000',
      long: '2500-3000'
    };
    prompt += `Create a comprehensive blog post of ${wordCounts[length]} words. `;
    
    // Content requirements
    prompt += `Include:
- A compelling introduction that hooks the reader
- Clear, well-structured sections with descriptive headings
- Practical examples and actionable insights${includeExamples ? ' (required)' : ''}
- A strong conclusion with key takeaways
- Natural flow and transitions between sections`;
    
    if (targetAudience) {
      prompt += `\nTarget audience: ${targetAudience}`;
    }
    
    // Quality guidelines
    prompt += `\n\nQuality guidelines:
- Use second-person perspective ("you", "your")
- Avoid AI-like phrases ("in this article", "furthermore", "moreover", "in conclusion")
- Keep paragraphs under 40 words for readability
- Use bullet points and numbered lists for clarity
- Include at least 5 headings for structure
- Make it engaging and human-like
- Add rhetorical questions to engage readers
- Write in Markdown format for proper formatting`;
    
    console.log('📝 Generated system prompt length:', prompt.length, 'characters');
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