const fetch = require('node-fetch');

async function testBlogGeneration() {
  console.log('🔍 Testing Blog Generation API...\n');

  const requestBody = {
    prompt: "The benefits of AI in education",
    model: "kimi-k2",
    emphasisSettings: {
      enabled: true,
      intensity: "moderate"
    },
    options: {
      tone: "conversational",
      length: "medium",
      includeExamples: true
    }
  };

  console.log('📤 Sending request to http://localhost:3001/api/generate');
  console.log('Request body:', JSON.stringify(requestBody, null, 2));
  console.log('');

  try {
    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', response.headers.raw());
    console.log('');

    const responseText = await response.text();
    console.log('📥 Raw response text length:', responseText.length);
    console.log('📥 Raw response preview:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
    console.log('');

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('📥 Parsed response data:');
      console.log('   - content exists:', !!responseData.content);
      console.log('   - content type:', typeof responseData.content);
      console.log('   - content length:', responseData.content?.length || 0);
      console.log('   - content preview:', responseData.content?.substring(0, 200) + (responseData.content?.length > 200 ? '...' : ''));
      console.log('   - metadata exists:', !!responseData.metadata);
      console.log('   - qualityScore:', responseData.qualityScore);
      console.log('   - qualityIssues:', responseData.qualityIssues);
      console.log('   - processingTime:', responseData.processingTime);
    } catch (parseError) {
      console.log('❌ Failed to parse response as JSON:', parseError.message);
      console.log('Raw response:', responseText);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Is the development server running on http://localhost:3001?');
    }
  }
}

testBlogGeneration();
