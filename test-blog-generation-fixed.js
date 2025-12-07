// Test script to verify blog generation works with different titles
const testTitles = [
  "10 Essential Tips for Remote Work Success",
  "How to Learn Programming in 2025",
  "The Ultimate Guide to Healthy Eating",
  "Mastering Time Management for Productivity",
  "Building a Successful Startup from Scratch"
];

async function testBlogGeneration() {
  console.log('🧪 Testing blog generation with different titles...\n');
  
  for (let i = 0; i < testTitles.length; i++) {
    const title = testTitles[i];
    console.log(`\n📝 Test ${i + 1}: "${title}"`);
    console.log('━'.repeat(50));
    
    try {
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: title,
          model: 'kimi-k2',
          options: {
            tone: 'conversational',
            length: 'short',
            includeExamples: true
          },
          emphasisSettings: {
            enabled: true,
            intensity: 'moderate'
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Success!');
        console.log(`📊 Content length: ${data.content.length} characters`);
        console.log(`⏱️ Processing time: ${data.processingTime}ms`);
        console.log(`🎯 Quality score: ${data.metadata?.qualityScore || 'N/A'}`);
        
        // Check if content actually addresses the title
        const contentLower = data.content.toLowerCase();
        const titleWords = title.toLowerCase().split(' ');
        const titleMentions = titleWords.filter(word => 
          word.length > 3 && contentLower.includes(word)
        ).length;
        
        console.log(`🔍 Title relevance: ${titleMentions}/${titleWords.length} key terms found`);
        
        // Show content preview
        const preview = data.content.replace(/<[^>]*>/g, '').substring(0, 200);
        console.log(`📄 Content preview: "${preview}..."`);
        
        // Check for required elements
        const hasHeadings = /<h[1-6]/i.test(data.content);
        const hasBold = /<strong|<b/i.test(data.content);
        const hasTable = /<table/i.test(data.content);
        const hasQuote = /<blockquote/i.test(data.content);
        
        console.log(`📋 Structure check:`);
        console.log(`   • Headings: ${hasHeadings ? '✅' : '❌'}`);
        console.log(`   • Bold text: ${hasBold ? '✅' : '❌'}`);
        console.log(`   • Tables: ${hasTable ? '✅' : '❌'}`);
        console.log(`   • Quotes: ${hasQuote ? '✅' : '❌'}`);
        
      } else {
        console.log('❌ Failed!');
        console.log(`🚨 Error: ${data.error}`);
        console.log(`📝 Details: ${data.details || 'No details available'}`);
      }
      
    } catch (error) {
      console.log('❌ Network error!');
      console.log(`🚨 Error: ${error.message}`);
    }
    
    // Add delay between tests to avoid rate limiting
    if (i < testTitles.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🏁 Testing completed!');
}

// Run the test
testBlogGeneration().catch(console.error);
