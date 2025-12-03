# AI-Powered Bold Formatting Guide

## Overview

This document explains the new prompt-based bold formatting system that replaces the previous post-processing approach.

## How It Works

### Previous System (Post-Processing)
- AI generated plain text content
- `textEmphasis.ts` analyzed and applied bold formatting after generation
- Complex regex-based processing with scoring algorithms
- Limited context awareness

### New System (Prompt-Based)
- AI applies bold formatting during content generation
- Uses your specific formatting rules in the system prompt
- Better context awareness and natural bold placement
- Simplified codebase and more predictable results

## Bold Formatting Rules

The AI follows these strict rules when applying bold formatting:

### 1. When to Use Bold
- Important key phrases (3–8 words)
- Strong actionable advice
- Definitions of important concepts
- Important statistics or numbers
- Key takeaways or summary lines
- Important questions that inspire thinking

### 2. Sentence-Level Rules
- Bold ONLY 1-2 key sentences per section (H2 or H3)
- Keep bolded sentences SHORT, clear, and meaningful
- Never bold full paragraphs
- Maximum 1-2 bold sentences per 300 words

### 3. Question Formatting
- Only bold questions that inspire thinking or important decisions
- Examples: "**What are you trying to achieve?**", "**Why should people trust your product?**"

### 4. What NOT to Bold
- Random words
- Adjectives like "amazing", "important", "best"
- Filler sentences
- Full paragraphs or long chunks
- More than 2 items per list
- More than 1-2 bold elements per section

### 5. Natural Formatting
- Bold only meaningful insights
- Use bold like a professional blog writer
- Guide reader's eyes to most valuable parts
- Make it feel human and natural

### 6. Technical Implementation
- Always wrap bold content using **double asterisks**
- Example: `**short important phrase**`

## Intensity Levels

### Subtle
- Use bold text very sparingly (1-2 bold elements per section)
- Only the most critical insights should be bold
- Maximum 1 bold sentence per section

### Moderate (Default)
- Use bold text moderately (2-3 bold elements per section)
- Key phrases and important advice should be bold
- Maximum 2 bold sentences per section

### Strong
- Use bold text more prominently (up to 4 bold elements per section)
- Important concepts, key takeaways, and critical advice should be bold
- Maximum 3 bold sentences per section

## Example Output

```
Before choosing your niche, ask yourself: **What problem can you talk about for years?**

Start by making one strong, consistent upload schedule.

**Most creators grow faster when they focus on one topic, not many.**

This looks professional, believable, and human.
```

## Implementation Details

### Files Modified
- `src/lib/blogGenerationService.ts` - Added `generateBoldFormattingPrompt()` method
- `src/app/api/generate/route.ts` - Removed post-processing emphasis calls
- `src/app/page.tsx` - Updated UI labels and descriptions

### Files Removed
- `src/lib/textEmphasis.ts` - No longer needed
- `src/types/emphasis.ts` - No longer needed

### Benefits
- More natural bold text placement
- Better context awareness
- Simplified codebase (removed ~500 lines of complex processing)
- Predictable results based on clear rules
- Reduced processing overhead

## Usage

Users can control bold formatting through the UI:
1. Toggle "Enable AI-powered bold formatting"
2. Select intensity level (Subtle/Moderate/Strong)
3. Generate blog content

The AI will automatically apply professional bold formatting according to the rules above.