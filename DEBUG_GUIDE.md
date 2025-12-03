# Kimi K2 API Debugging Guide

## 🚨 Current Status: IDENTIFIED ISSLES

**Primary Issue**: Invalid API Key Configuration
- Your `.env.local` still contains placeholder: `your_moonshot_api_key_here`
- This is causing the application to fail before making any API calls

## 🔧 Step-by-Step Debugging Process

### Step 1: Get a Valid API Key
1. Visit https://platform.moonshot.ai
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key (it will start with `sk-`)
5. Copy the key securely

### Step 2: Configure API Key
Edit your `.env.local` file:

```bash
# Replace this line:
MOONSHOT_API_KEY=your_moonshot_api_key_here

# With your actual key:
MOONSHOT_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Test Basic Connectivity

#### Option A: Using the Debug Script
```bash
cd ai-blog-writer
node debug-kimi-api.js
```

#### Option B: Using the Validation API
```bash
curl -X GET http://localhost:3000/api/validate
```

#### Option C: Test with Custom API Key
```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-your-actual-api-key-here"}'
```

### Step 4: Test Blog Generation

#### Simple Test (with simplified prompt)
1. Add this to `.env.local`:
   ```
   USE_SIMPLE_PROMPT=true
   ```
2. Restart the server:
   ```bash
   npm run dev
   ```
3. Test via API:
   ```bash
   curl -X POST http://localhost:3000/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Write about AI benefits", "model": "kimi-k2"}'
   ```

#### Full Test (with complex prompt)
1. Remove or set `USE_SIMPLE_PROMPT=false`
2. Restart the server
3. Test via web interface at http://localhost:3000

## 🔍 What to Look For

### Successful Response
You should see logs like:
```
🔧 MoonshotClient initialized with: {
  baseURL: "https://api.moonshot.ai/v1",
  hasApiKey: true,
  apiKeyLength: 48,
  apiKeyPrefix: "sk-xxxxx...",
  isPlaceholder: false
}
✅ MoonshotClient initialized successfully
📤 Moonshot API request: {
  model: "kimi-k2-turbo-preview",
  messageCount: 2,
  temperature: 0.6,
  maxTokens: 4000
}
🚀 Making API request (attempt 1/4)...
✅ Moonshot API response received: {
  id: "chatcmpl-xxxxx",
  model: "kimi-k2-turbo-preview",
  choices: 1,
  usage: { promptTokens: 150, completionTokens: 300, totalTokens: 450 }
}
```

### Error Responses
Look for these specific errors:

#### API Key Issues
```
❌ MoonshotClient initialization failed: Valid Moonshot API key is required
```

#### Authentication Errors
```
❌ Moonshot API error (attempt 1): {
  message: "Invalid authentication",
  status: 401,
  statusText: "Unauthorized"
}
```

#### Network Issues
```
❌ Moonshot API error (attempt 1): {
  message: "ENOTFOUND api.moonshot.ai",
  code: "ENOTFOUND"
}
```

## 🛠️ Troubleshooting Checklist

### ✅ Before Testing
- [ ] Valid API key obtained from Moonshot AI platform
- [ ] API key configured in `.env.local`
- [ ] Development server restarted after changes
- [ ] Internet connection is working

### ✅ During Testing
- [ ] Check browser console for errors
- [ ] Check terminal output for logs
- [ ] Monitor network requests in browser dev tools
- [ ] Verify API key format (starts with `sk-`)

### ✅ Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Invalid API Key | 401 Unauthorized | Get valid key from platform |
| Network Error | ENOTFOUND | Check internet connection |
| Model Not Found | 404 Not Found | Verify model name spelling |
| Token Limit | 429 Too Many Requests | Wait and retry |
| CORS Error | Browser console error | Check API endpoint |

## 🧪 Advanced Debugging

### Enable Detailed Logging
Add to `.env.local`:
```
DEBUG=true
USE_SIMPLE_PROMPT=true
```

### Test Different Models
Try alternative model names:
- `kimi-k2-turbo-preview` (default)
- `kimi-k2-0905-preview`
- `kimi-k2-thinking`
- `kimi-k2-thinking-turbo`

### Monitor Token Usage
Check the response logs for:
```
usage: {
  promptTokens: 150,
  completionTokens: 300,
  totalTokens: 450
}
```

## 📊 Expected Performance

With a valid API key, you should see:
- **Response Time**: 2-5 seconds for short requests
- **Generation Speed**: 60-100 tokens/second
- **Success Rate**: >95% for valid requests
- **Token Usage**: Reasonable based on content length

## 🚀 Next Steps After Fix

1. **Remove Debug Logging**: Set `DEBUG=false` and `USE_SIMPLE_PROMPT=false`
2. **Monitor Usage**: Track token usage and costs
3. **Optimize Prompts**: Fine-tune system and user prompts
4. **Add Error Handling**: Implement user-friendly error messages
5. **Test Edge Cases**: Try very long/short requests

---

**Remember**: The issue is most likely the API key configuration. Once you replace the placeholder with a valid key, everything should work correctly.