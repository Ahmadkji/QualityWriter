import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    console.log('🔍 Test API called with prompt:', prompt);

    // Return a simple response immediately
    const responseData = {
      content: `<h1>Test Blog Post</h1><p class="mb-4">This is a test blog post about: ${prompt}</p><p class="mb-4">If you can see this content, the API is working correctly.</p>`,
      metadata: {
        model: 'test',
        tokensUsed: 0,
        processingTime: 100,
        qualityScore: 100,
      },
      qualityIssues: [],
      processingTime: 100,
    };

    console.log('🔍 Returning test response');
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test API failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
