import { NextRequest, NextResponse } from 'next/server';
import { moonshotClient } from '../../../lib/moonshotClient';

export async function POST(request: NextRequest) {
  console.log('🔍 API validation request received');
  
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    console.log('🔑 Testing API key validity...');
    
    // Create a temporary client with the provided API key
    const tempClient = new (await import('../../../lib/moonshotClient')).MoonshotClient(apiKey);
    
    // Test with a simple request
    const response = await tempClient.createChatCompletion({
      model: 'kimi-k2-turbo-preview',
      messages: [
        { role: 'system', content: 'You are Kimi, an AI assistant provided by Moonshot AI.' },
        { role: 'user', content: 'Say "API key is valid" if you can read this.' }
      ],
      max_tokens: 10,
    }, { retries: 0 });

    console.log('✅ API key validation successful');

    return NextResponse.json({
      valid: true,
      message: 'API key is valid',
      model: response.model,
      usage: response.usage
    });

  } catch (error) {
    console.error('❌ API key validation failed:', error);
    
    const errorObj = error as any;
    
    return NextResponse.json({
      valid: false,
      error: errorObj.message || 'Unknown error',
      status: errorObj.response?.status,
      details: errorObj.response?.data
    }, { status: 400 });
  }
}

export async function GET() {
  console.log('🔍 API health check');
  
  try {
    // Test with the configured API key
    const isValid = await moonshotClient.validateApiKey();
    
    return NextResponse.json({
      configured: !!process.env.MOONSHOT_API_KEY,
      valid: isValid,
      model: process.env.MOONSHOT_MODEL || 'kimi-k2-turbo-preview',
      baseURL: process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.ai/v1'
    });

  } catch (error) {
    console.error('❌ API health check failed:', error);
    
    return NextResponse.json({
      configured: !!process.env.MOONSHOT_API_KEY,
      valid: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}