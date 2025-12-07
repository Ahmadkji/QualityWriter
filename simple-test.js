const OpenAI = require("openai");
require('dotenv').config({ path: '.env.local' });

async function testBlogGenerationFlow() {
  console.log("🔍 Testing complete blog generation flow...\n");
  
  const client = new OpenAI({
    apiKey: process.env.MOONSHOT_API_KEY,
    baseURL: "https://api.moonshot.ai/v1",
  });

  try {
    console.log("1. 📤 Making API request...");
    
    const response = await client.chat.completions.create({
      model: "kimi-k2-0905-preview",
      messages: [
        { 
          role: 'system', 
          content: `You are Kimi, an expert blog writer. Write in clean Markdown. Use a friendly and direct tone.
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
   - moderate level: 2–3 bold uses per section.
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
Write ~1500 words.
Target audience: general readers.` 
        },
        { 
          role: 'user', 
          content: 'Write a comprehensive blog article about "benefits of meditation" that provides real value to the reader. Focus on practical insights, actionable advice, and engaging content that keeps readers interested from start to finish.' 
        }
      ],
      temperature: 0.6,
      max_tokens: 4000,
    });

    console.log("2. ✅ API Response received");
    let content = response.choices[0]?.message?.content || '';
    console.log("3. 📄 Raw content length:", content.length);
    console.log("4. 📄 Raw content preview:", content.substring(0, 200));
    
    // Test the markdown converter
    console.log("5. 🔄 Converting Markdown to HTML...");
    const { convertMarkdownToHTML } = require('./src/lib/markdownConverter.ts');
    const htmlContent = convertMarkdownToHTML(content);
    console.log("6. ✅ HTML content length:", htmlContent.length);
    console.log("7. 📄 HTML content preview:", htmlContent.substring(0, 200));
    
    // Test sanitization
    console.log("8. 🧹 Testing HTML sanitization...");
    const sanitizeHtml = require('sanitize-html');
    const sanitizedContent = sanitizeHtml(htmlContent, {
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
    
    console.log("9. ✅ Sanitized content length:", sanitizedContent.length);
    console.log("10. 📄 Sanitized content preview:", sanitizedContent.substring(0, 200));
    
    // Test content validation
    console.log("11. 🔍 Testing content validation...");
    const { validateContentQuality, calculateQualityScore } = require('./src/lib/contentValidation');
    const qualityIssues = validateContentQuality(sanitizedContent);
    const qualityScore = calculateQualityScore(sanitizedContent);
    
    console.log("12. 📊 Quality score:", qualityScore);
    console.log("13. 📋 Quality issues:", qualityIssues.length);
    
    // Return the final response structure
    const responseData = {
      content: sanitizedContent,
      metadata: {
        model: 'kimi-k2-0905-preview',
        tokensUsed: response.usage?.total_tokens || 0,
        processingTime: Date.now() - Date.now(),
        qualityScore: qualityScore,
      }
    };
    
    console.log("14. ✅ Complete flow successful!");
    console.log("15. 📦 Final response structure:");
    console.log(JSON.stringify(responseData, null, 2));
    
    return true;
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    return false;
  }
}

testBlogGenerationFlow().then(success => {
  if (success) {
    console.log("\n🎉 Complete blog generation flow test passed!");
  } else {
    console.log("\n❌ Blog generation flow test failed!");
  }
}).catch(error => {
  console.error("💥 Unexpected error:", error);
});
