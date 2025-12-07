import OpenAI from 'openai';

export interface MoonshotMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MoonshotCompletionRequest {
  model: string;
  messages: MoonshotMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface MoonshotCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MoonshotClient {
  private client: OpenAI;

  constructor(apiKey: string, baseURL: string = 'https://api.moonshot.ai/v1') {
    console.log('🔧 MoonshotClient initialization:', {
      baseURL,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPrefix: apiKey?.substring(0, 7) + '...',
      isPlaceholder: apiKey === 'your_moonshot_api_key_here'
    });
    
    if (!apiKey || apiKey === 'your_moonshot_api_key_here' || apiKey.trim() === '') {
      const error = new Error('Valid Moonshot API key is required. Please set MOONSHOT_API_KEY in your environment variables.');
      console.error('❌ MoonshotClient initialization failed:', error.message);
      throw error;
    }
    
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });
    
    console.log('✅ MoonshotClient initialized successfully');
  }

  async createChatCompletion(
    request: MoonshotCompletionRequest,
    options: { retries?: number; retryDelay?: number; timeout?: number } = {}
  ): Promise<MoonshotCompletionResponse> {
    const { retries = 2, retryDelay = 1000, timeout = 45000 } = options; // Reduced retries, added timeout
    let lastError: Error;

    console.log('📤 Moonshot API request:', {
      model: request.model,
      messageCount: request.messages.length,
      temperature: request.temperature,
      maxTokens: request.max_tokens,
      timeout: timeout,
      maxRetries: retries + 1
    });

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`🚀 Making API request (attempt ${attempt + 1}/${retries + 1})...`);
        
        // Create timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout);
        });

        // Create API request promise
        const apiPromise = this.client.chat.completions.create({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          max_tokens: request.max_tokens,
          stream: false,
        });

        // Race between API request and timeout
        const response = await Promise.race([apiPromise, timeoutPromise]);

        console.log('✅ Moonshot API response received:', {
          id: response.id,
          model: response.model,
          choices: response.choices?.length || 0,
          usage: response.usage ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens
          } : 'No usage data'
        });

        return response as MoonshotCompletionResponse;
      } catch (error) {
        lastError = error as Error;
        
        const errorObj = error as any;
        const errorMessage = errorObj.message || 'Unknown error';
        const isTimeout = errorMessage.includes('timeout');
        const isRateLimit = errorObj.response?.status === 429;
        
        console.error(`❌ Moonshot API error (attempt ${attempt + 1}):`, {
          message: errorMessage,
          status: errorObj.response?.status,
          statusText: errorObj.response?.statusText,
          code: errorObj.code,
          isTimeout,
          isRateLimit
        });
        
        if (errorObj.response?.data) {
          console.error('API Error Details:', errorObj.response.data);
        }
        
        // Don't retry on certain errors
        const shouldNotRetry = 
          errorObj.response?.status === 401 || // Unauthorized
          errorObj.response?.status === 403 || // Forbidden
          errorObj.response?.status === 404 || // Not found
          errorMessage.includes('Invalid API key') ||
          errorMessage.includes('quota');
        
        if (shouldNotRetry || attempt >= retries) {
          break;
        }
        
        // Calculate retry delay with exponential backoff
        let delayTime = retryDelay * Math.pow(2, attempt);
        
        // Add jitter for rate limiting
        if (isRateLimit) {
          delayTime = delayTime + Math.random() * 1000;
        }
        
        console.warn(`⏳ Retrying in ${Math.round(delayTime)}ms...`);
        await this.delay(delayTime);
      }
    }

    // Enhance error message for better debugging
    const enhancedError = new Error(
      `Moonshot API failed after ${retries + 1} attempts: ${lastError!.message}`
    );
    enhancedError.stack = lastError!.stack;
    throw enhancedError;
  }

  async createStreamingChatCompletion(
    request: MoonshotCompletionRequest
  ): Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      const stream = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
        stream: true,
      });

      return stream;
    } catch (error) {
      console.error('Moonshot streaming error:', error);
      throw new Error(`Failed to create streaming completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility method to estimate tokens (rough approximation)
  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  // Method to validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      await this.createChatCompletion({
        model: 'kimi-k2-turbo-preview',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      }, { retries: 0 });
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const moonshotClient = new MoonshotClient(
  process.env.MOONSHOT_API_KEY || '',
  process.env.MOONSHOT_BASE_URL
);
