# BlogCraft AI - Powered by Moonshot AI Kimi K2

**Advanced AI Blog Generation** with cutting-edge reasoning and 32k context window.

## 🚨 IMPORTANT: API Key Required

**This application requires a valid Moonshot AI API key to function.**

📖 **See [API_KEY_SETUP.md](./API_KEY_SETUP.md) for detailed setup instructions**

### Quick Setup:
1. Get API key from https://platform.moonshot.ai
2. Edit `.env.local`: `MOONSHOT_API_KEY=sk-your-actual-key`
3. Restart server: `npm run dev`

**Current Status**: ✅ Integration Complete | ❌ API Key Needed

## ✨ Features

### 🚀 Kimi K2 Integration
- **Advanced Reasoning**: Industry-leading AI model with 1T total parameters and 32B active parameters
- **Ultra-Long Context**: 256K token context window for comprehensive content
- **High-Speed Generation**: 60-100 tokens per second for responsive content creation
- **Agent Capabilities**: Complex task decomposition and multi-tool workflows
- **Full Stack Support**: Entire development cycle from frontend to backend

### 🎯 Smart Blog Generation
- **Conversational Tone**: Second-person perspective ("you" and "your")
- **Content Structuring**: Proper headings, bullet points, and examples
- **Quality Control**: Automated validation and scoring
- **Streaming Support**: Real-time content generation
- **Text Emphasis**: Intelligent word and sentence highlighting

### 🛠️ Technical Features
- **Markdown to HTML**: Professional formatting with Tailwind CSS
- **Content Validation**: Quality scoring and issue detection
- **Error Handling**: Robust retry logic and fallback mechanisms
- **Cost Tracking**: Token usage monitoring and cost optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Moonshot AI API key

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd ai-blog-writer
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Moonshot AI API key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Environment Variables

```env
# Moonshot AI Configuration
MOONSHOT_API_KEY=your_moonshot_api_key_here
MOONSHOT_BASE_URL=https://api.moonshot.ai/v1
MOONSHOT_MODEL=kimi-k2-turbo-preview
MOONSHOT_MAX_TOKENS=4000
MOONSHOT_TEMPERATURE=0.6

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Available Models

| Model | Context Window | Speed | Best For |
|--------|--------------|------|----------|
| `kimi-k2-turbo-preview` | 256K | 60-100 tokens/s | General blog generation |
| `kimi-k2-0905-preview` | 256K | Standard | Complex topics |
| `kimi-k2-thinking` | 256K | Standard | Multi-step reasoning |
| `kimi-k2-thinking-turbo` | 256K | 60-100 tokens/s | Complex reasoning |

## 📁 Project Structure

```
ai-blog-writer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts    # Kimi K2 integration endpoint
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx           # Main application page
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── moonshotClient.ts    # Moonshot AI client wrapper
│   │   ├── blogGenerationService.ts # Blog generation service
│   │   ├── textEmphasis.ts    # Text processing utilities
│   │   ├── markdownConverter.ts # Markdown conversion utilities
│   │   └── contentValidation.ts # Content quality validation
│   └── types/
│       └── emphasis.ts        # TypeScript type definitions
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Usage Examples

### Basic Blog Generation

```typescript
import { blogGenerationService } from './lib/blogGenerationService';

const result = await blogGenerationService.generateBlog({
  topic: "The benefits of remote work",
  model: 'kimi-k2',
  options: {
    tone: 'conversational',
    length: 'medium',
    includeExamples: true
  },
  emphasisSettings: {
    enabled: true,
    intensity: 'moderate'
  }
});

console.log('Generated content:', result.content);
console.log('Tokens used:', result.metadata.tokensUsed);
```

### Streaming Generation

```typescript
const stream = await blogGenerationService.generateStreamingBlog({
  topic: "AI trends in 2024",
  model: 'kimi-k2',
  options: {
    tone: 'professional',
    length: 'long'
  }
});

for await (const chunk of stream) {
  console.log('Stream chunk:', chunk);
}
```

## 🎨 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check    # Run TypeScript type checking
```

## 🔍 API Integration

### Moonshot AI Client

The application uses the official OpenAI SDK for seamless integration with Moonshot AI:

```typescript
import { moonshotClient } from './lib/moonshotClient';

const response = await moonshotClient.createChatCompletion({
  model: 'kimi-k2-turbo-preview',
  messages: [
    {
      role: 'system',
      content: 'You are Kimi, an AI assistant provided by Moonshot AI...'
    },
    {
      role: 'user',
      content: 'Write a blog about...'
    }
  ],
  temperature: 0.6,
  max_tokens: 4000
});
```

### Error Handling

Built-in error handling for:
- API rate limiting
- Authentication failures
- Network errors
- Content validation
- Automatic retries with exponential backoff

## 🎨 Content Features

### Text Emphasis
- **Word-level**: Intelligent word selection for emphasis
- **Sentence-level**: Context-aware sentence highlighting
- **Configurable**: Subtle, moderate, or strong intensity
- **HTML-safe**: Preserves structure and formatting

### Quality Validation
- **Structure Analysis**: Heading hierarchy and paragraph length
- **Content Scoring**: Automated quality assessment (0-100)
- **Issue Detection**: AI patterns, repetition, forbidden phrases
- **Real-time Feedback**: User rating system

## 🚀 Performance

### Optimization Features
- **Streaming**: Real-time content generation
- **Caching**: Response caching for repeated requests
- **Batch Processing**: Efficient token usage
- **Connection Pooling**: Optimized API connections

### Monitoring
- **Token Usage**: Track input/output tokens
- **Cost Tracking**: Monitor API costs
- **Performance Metrics**: Generation time and success rates
- **Error Analytics**: Detailed error logging

## 🤝 Contributing

We welcome contributions to improve the Kimi K2 integration:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Test all API integrations
- Update documentation
- Maintain code quality standards

## 📄 License

MIT License - see LICENSE file for details.

---

**🚀 Experience the future of AI blog generation with Moonshot's Kimi K2!**

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check    # Run TypeScript type checking
```

## Contributing

While AI services are discontinued, contributions to improve the manual writing tools and text processing features are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Thank you** to all users who supported our AI blog generation service. We appreciate your business and hope the text processing tools continue to be useful for your writing needs.
