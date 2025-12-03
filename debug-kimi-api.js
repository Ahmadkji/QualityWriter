const OpenAI = require("openai");
require('dotenv').config({ path: '.env.local' });

console.log("🔍 Starting Kimi API Debug Test...\n");

// 1. Check environment variables
console.log("1. Environment Variables Check:");
console.log("   MOONSHOT_API_KEY exists:", !!process.env.MOONSHOT_API_KEY);
console.log("   MOONSHOT_API_KEY format:", process.env.MOONSHOT_API_KEY ? 
  (process.env.MOONSHOT_API_KEY.startsWith('sk-') ? '✅ Valid format' : '❌ Invalid format') : '❌ Missing');
console.log("   MOONSHOT_API_KEY length:", process.env.MOONSHOT_API_KEY?.length || 0);
console.log("");

// 2. Initialize client with error handling
let client;
try {
  client = new OpenAI({
    apiKey: process.env.MOONSHOT_API_KEY,
    baseURL: "https://api.moonshot.ai/v1",
  });
  console.log("2. ✅ OpenAI Client initialized successfully");
} catch (error) {
  console.log("2. ❌ Failed to initialize OpenAI Client:", error.message);
  process.exit(1);
}

// 3. Test basic API connectivity
async function testBasicAPI() {
  console.log("\n3. Testing Basic API Connectivity...");
  
  try {
    console.log("   📤 Making request to Kimi API...");
    
    const completion = await client.chat.completions.create({
      model: "kimi-k2-turbo-preview",
      messages: [
        {
          "role": "system", 
          "content": "You are Kimi, an AI assistant provided by Moonshot AI. You are proficient in Chinese and English conversations. You provide users with safe, helpful, and accurate answers. You will reject any requests involving terrorism, racism, or explicit content. Moonshot AI is a proper noun and should not be translated."
        },
        {
          "role": "user", 
          "content": "Hello, my name is Li Lei. What is 1+1?"
        }
      ],
      temperature: 0.6,
    });

    console.log("   ✅ API Request Successful!");
    console.log("   📄 Response:", completion.choices[0].message.content);
    console.log("   📊 Usage:", {
      prompt_tokens: completion.usage?.prompt_tokens,
      completion_tokens: completion.usage?.completion_tokens,
      total_tokens: completion.usage?.total_tokens
    });
    
    return true;
  } catch (error) {
    console.log("   ❌ API Request Failed:");
    console.log("   Error:", error.message);
    
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ENOTFOUND') {
      console.log("   💡 Tip: Check your internet connection");
    }
    
    return false;
  }
}

// 4. Test with blog generation prompt
async function testBlogGeneration() {
  console.log("\n4. Testing Blog Generation Prompt...");
  
  try {
    console.log("   📤 Making blog generation request...");
    
    const completion = await client.chat.completions.create({
      model: "kimi-k2-turbo-preview",
      messages: [
        {
          "role": "system", 
          "content": "You are Kimi, an AI assistant provided by Moonshot AI. You are proficient in Chinese and English conversations. You provide users with safe, helpful, and accurate answers. You will reject any requests involving terrorism, racism, or explicit content. Moonshot AI is a proper noun and should not be translated."
        },
        {
          "role": "user", 
          "content": "Write a short blog post about the benefits of AI in education. Keep it under 200 words."
        }
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    console.log("   ✅ Blog Generation Successful!");
    console.log("   📄 Generated content:", completion.choices[0].message.content);
    console.log("   📊 Usage:", {
      prompt_tokens: completion.usage?.prompt_tokens,
      completion_tokens: completion.usage?.completion_tokens,
      total_tokens: completion.usage?.total_tokens
    });
    
    return true;
  } catch (error) {
    console.log("   ❌ Blog Generation Failed:");
    console.log("   Error:", error.message);
    
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

// 5. Test streaming
async function testStreaming() {
  console.log("\n5. Testing Streaming API...");
  
  try {
    console.log("   📤 Making streaming request...");
    
    const stream = await client.chat.completions.create({
      model: "kimi-k2-turbo-preview",
      messages: [
        {
          "role": "system", 
          "content": "You are Kimi, an AI assistant provided by Moonshot AI."
        },
        {
          "role": "user", 
          "content": "Count from 1 to 5"
        }
      ],
      stream: true,
    });

    console.log("   📄 Streaming response:");
    let fullResponse = "";
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
        fullResponse += content;
      }
    }
    
    console.log("\n   ✅ Streaming Successful!");
    return true;
  } catch (error) {
    console.log("   ❌ Streaming Failed:");
    console.log("   Error:", error.message);
    
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

// Main execution
async function runAllTests() {
  console.log("🚀 Running all diagnostic tests...\n");
  
  const basicSuccess = await testBasicAPI();
  if (!basicSuccess) {
    console.log("\n❌ Basic API test failed. Stopping further tests.");
    process.exit(1);
  }
  
  const blogSuccess = await testBlogGeneration();
  const streamingSuccess = await testStreaming();
  
  console.log("\n📋 Test Results Summary:");
  console.log("   Basic API Test:", basicSuccess ? "✅ PASS" : "❌ FAIL");
  console.log("   Blog Generation:", blogSuccess ? "✅ PASS" : "❌ FAIL");
  console.log("   Streaming:", streamingSuccess ? "✅ PASS" : "❌ FAIL");
  
  if (basicSuccess && blogSuccess && streamingSuccess) {
    console.log("\n🎉 All tests passed! Your Kimi API integration is working correctly.");
  } else {
    console.log("\n⚠️  Some tests failed. Check the error messages above for details.");
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error("💥 Unexpected error during testing:", error);
  process.exit(1);
});