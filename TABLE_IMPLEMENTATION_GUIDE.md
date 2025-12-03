# Table Generation Implementation Guide

## Step-by-Step Implementation

### Step 1: Add Table Formatting Function to BlogGenerationService

Add this method to the `BlogGenerationService` class in [`blogGenerationService.ts`](ai-blog-writer/src/lib/blogGenerationService.ts:29):

```typescript
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
```

### Step 2: Integrate Table Rules into System Prompt

Modify the [`generateSystemPrompt`](ai-blog-writer/src/lib/blogGenerationService.ts:109) method to include table formatting rules:

```typescript
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
```

### Step 3: Add Table Validation Function

Add this method to validate table presence and formatting:

```typescript
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
  const titleMatches = [...content.matchAll(titleRegex)];
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
```

### Step 4: Update Quality Scoring

Modify the [`calculateQualityScore`](ai-blog-writer/src/lib/blogGenerationService.ts:284) method to include table validation:

```typescript
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
  
  return Math.max(0, score);
}
```

### Step 5: Update Blog Generation Response

Modify the response generation to include table validation information:

```typescript
// In the generateWithKimiK2 method, after content conversion:
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
```

## Testing the Implementation

### Test Case 1: Basic Table Generation
Request a blog about "Productivity Tips" and verify:
- At least one table is included
- Table has proper Markdown formatting
- Table has a title
- Table content is relevant to the topic

### Test Case 2: Table Quality
Request a blog about "Marketing Strategies" and verify:
- Table has 2-5 columns
- Table has 3-8 rows
- Cell content is short and simple
- Table renders correctly in HTML

### Test Case 3: Quality Score Impact
Generate blogs with and without tables to verify:
- Quality score penalty for missing tables
- Quality score bonus for proper table formatting
- Quality score penalty for excessive tables

## Benefits of This Implementation

1. **Mandatory Table Inclusion**: Every generated blog will include at least one relevant table
2. **Consistent Formatting**: Tables follow the same structure and style across all content
3. **Quality Control**: Table validation ensures proper Markdown formatting
4. **Enhanced Readability**: Tables improve content organization and user experience
5. **Leverages Existing Infrastructure**: Uses existing table styling in markdown converter

## Next Steps

1. Implement the code changes outlined above
2. Test with various blog topics
3. Monitor quality scores and table generation
4. Adjust rules as needed based on results