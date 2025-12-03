# Moonshot AI API Key Setup Guide

## 🚨 Important: API Key Required

The application is fully integrated with Moonshot AI's Kimi K2 model, but requires a valid API key to function.

## 📋 Step-by-Step Setup

### 1. Get Your Moonshot AI API Key

1. **Visit Moonshot AI Platform**: https://platform.moonshot.ai
2. **Sign up or Log in** to your account
3. **Navigate to API Keys** section in your dashboard
4. **Create a new API key** or copy an existing one
5. **Save the key securely** (it starts with `sk-`)

### 2. Configure API Key in Your Application

Edit the `.env.local` file in your project root:

```bash
# Open the environment file
nano ai-blog-writer/.env.local

# Replace the placeholder with your actual API key
MOONSHOT_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
cd ai-blog-writer
export PATH="/Users/macbookpro/HolaWriter/node-v18.19.0-darwin-x64/bin:$PATH"
npm run dev
```

## 🔍 Verify Your Setup

### Test via API

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a short blog about AI", "model": "kimi-k2"}'
```

### Test via Web Interface

1. Open http://localhost:3000 in your browser
2. Enter a blog topic
3. Select "Kimi K2" model
4. Click "Generate Blog"

## 🛠️ Troubleshooting

### Error: "401 Invalid Authentication"
- **Cause**: Invalid or missing API key
- **Solution**: Verify your API key is correct and properly set in `.env.local`

### Error: "Valid Moonshot API key is required"
- **Cause**: API key is placeholder or empty
- **Solution**: Set a real API key from Moonshot AI platform

### Error: "Failed to generate blog with Kimi K2"
- **Cause**: Network issues or API problems
- **Solution**: Check internet connection and try again

## 📚 Additional Resources

- **Moonshot AI Documentation**: https://platform.moonshot.ai/docs
- **Kimi K2 Model Info**: https://platform.moonshot.ai/docs/models
- **API Reference**: https://platform.moonshot.ai/docs/api-reference

## 🔐 Security Best Practices

- Never commit API keys to version control
- Use environment variables for API key storage
- Rotate API keys regularly
- Monitor API usage and costs

## ✅ Expected Results

With a valid API key, you should see:
- Fast blog generation (60-100 tokens/second)
- High-quality content with proper structure
- Real-time streaming support
- Token usage tracking
- Quality scoring and validation

## 🎯 Next Steps

Once your API key is configured:
1. Test basic blog generation
2. Explore different tone and length options
3. Try streaming mode for real-time generation
4. Monitor token usage and costs
5. Customize prompts for your specific use case

---

**Need Help?** Check the [README.md](./README.md) for additional configuration options.