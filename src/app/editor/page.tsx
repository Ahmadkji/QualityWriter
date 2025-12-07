'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wand2, Copy, Download, RefreshCw, Sparkles, BookOpen, Zap, Bot } from 'lucide-react';
import { Card, Button, Input, Toggle } from '@/components/ui';

export default function EditorPage() {
  const [blogData, setBlogData] = useState({
    topic: '',
    model: 'kimi-k2' as 'kimi-k2' | 'other',
    emphasisIntensity: 'moderate' as 'subtle' | 'moderate' | 'strong',
    enableAutoEmphasis: true,
    tone: 'conversational' as 'conversational' | 'professional' | 'casual',
    length: 'medium' as 'short' | 'medium' | 'long',
    enableStreaming: false
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<{promptAdherence: number, tone: number, style: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const generateBlog = async () => {
    console.log('🔍 generateBlog called with topic:', blogData.topic);
    
    if (!blogData.topic.trim()) {
      console.log('❌ Empty topic, returning');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedContent('');
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log('📤 Making API request with streaming:', blogData.enableStreaming);
      
      if (blogData.enableStreaming) {
        // Handle streaming response
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: blogData.topic,
            model: blogData.model,
            emphasisSettings: {
              enabled: blogData.enableAutoEmphasis,
              intensity: blogData.emphasisIntensity
            },
            options: {
              tone: blogData.tone,
              length: blogData.length,
              includeExamples: true
            },
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error('Streaming request failed');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            accumulatedContent += chunk;
            setGeneratedContent(accumulatedContent);
          }
        }
      } else {
        // Handle non-streaming response
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: blogData.topic,
            model: blogData.model,
            emphasisSettings: {
              enabled: blogData.enableAutoEmphasis,
              intensity: blogData.emphasisIntensity
            },
            options: {
              tone: blogData.tone,
              length: blogData.length,
              includeExamples: true
            }
          })
        });

        const data = await response.json();
        console.log('📥 API Response received:', data);
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        console.log('📥 Data content type:', typeof data.content);
        console.log('📥 Data content length:', data.content?.length || 0);
        console.log('📥 Data content preview:', data.content?.substring(0, 200) || 'NO CONTENT');
        
        if (response.ok) {
          console.log('✅ Setting generated content...');
          console.log('✅ Content before setGeneratedContent:', data.content?.substring(0, 100) + '...');
          setGeneratedContent(data.content);
          setDebugInfo(data);
          console.log('✅ Generated content set successfully');
        } else {
          console.log('❌ API error:', data.error);
          setError(data.error || 'Error generating content. Please try again.');
          setDebugInfo(data);
        }
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
      console.log('🏁 generateBlog completed');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const submitFeedback = (type: 'promptAdherence' | 'tone' | 'style', value: number) => {
    setFeedback(prev => ({
      promptAdherence: type === 'promptAdherence' ? value : prev?.promptAdherence || 0,
      tone: type === 'tone' ? value : prev?.tone || 0,
      style: type === 'style' ? value : prev?.style || 0
    }));
    
    // Here you could send feedback to an analytics service
    console.log('Feedback submitted:', { [type]: value, topic: blogData.topic });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BlogCraft AI</span>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Topic Input Card */}
            <Card variant="gradient" hover animated>
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                Blog Topic
              </h2>
              <Input
                label="What's your blog about?"
                value={blogData.topic}
                onChange={(e) => setBlogData({...blogData, topic: e.target.value})}
                placeholder="Enter your blog topic..."
                animated
                gradient
                helperText="Be specific about what you want to write about"
              />
            </Card>

            {/* AI Model Selection Card */}
            <Card variant="interactive" hover>
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-500" />
                AI Model Selection
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="model"
                    value="kimi-k2"
                    checked={blogData.model === 'kimi-k2'}
                    onChange={(e) => setBlogData({...blogData, model: e.target.value as 'kimi-k2'})}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Kimi K2 (Moonshot AI)</div>
                    <div className="text-sm text-gray-600">Advanced reasoning with 32k context window</div>
                  </div>
                </label>
              </div>
            </Card>

            {/* Blog Options Card */}
            <Card variant="default" hover>
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                Blog Options
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Tone</label>
                  <select
                    value={blogData.tone}
                    onChange={(e) => setBlogData({...blogData, tone: e.target.value as any})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="conversational">Conversational</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Length</label>
                  <select
                    value={blogData.length}
                    onChange={(e) => setBlogData({...blogData, length: e.target.value as any})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="short">Short (800-1200 words)</option>
                    <option value="medium">Medium (1500-2000 words)</option>
                    <option value="long">Long (2500-3000 words)</option>
                  </select>
                </div>
                
                <div>
                  <Toggle
                    checked={blogData.enableStreaming}
                    onChange={(checked) => setBlogData({...blogData, enableStreaming: checked})}
                    label="Enable streaming generation"
                    description="See content appear as it's being generated"
                    animated
                  />
                </div>
              </div>
            </Card>

            {/* Formatting Settings Card */}
            <Card variant="default" hover>
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                AI Bold Formatting
              </h3>
              <div className="space-y-4">
                <Toggle
                  checked={blogData.enableAutoEmphasis}
                  onChange={(checked) => setBlogData({...blogData, enableAutoEmphasis: checked})}
                  label="Enable AI-powered bold formatting"
                  description="AI will automatically apply bold formatting for emphasis"
                  animated
                />
                
                {blogData.enableAutoEmphasis && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Bold Intensity</label>
                    <select
                      value={blogData.emphasisIntensity}
                      onChange={(e) => setBlogData({...blogData, emphasisIntensity: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    >
                      <option value="subtle">Subtle (minimal bold text)</option>
                      <option value="moderate">Moderate (balanced bold text)</option>
                      <option value="strong">Strong (prominent bold text)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">AI will apply professional bold formatting based on your intensity setting</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Generate Button Card */}
            <Card variant="gradient" className="p-0">
              <Button
                onClick={generateBlog}
                disabled={isGenerating || !blogData.topic.trim()}
                loading={isGenerating}
                loadingText="Generating your blog..."
                variant="primary"
                size="lg"
                fullWidth
                animated
                leftIcon={<Wand2 className="w-5 h-5" />}
              >
                Generate Blog
              </Button>
            </Card>
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Display Card */}
            <Card variant="default" className="min-h-[600px]">
              <div className="border-b border-gray-200/50 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="font-semibold text-gray-900">Generated Content</h3>
                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="ghost"
                      size="sm"
                      title="Copy to clipboard"
                      leftIcon={<Copy className="w-4 h-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      onClick={() => setGeneratedContent('')}
                      variant="ghost"
                      size="sm"
                      title="Clear"
                      leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {!generatedContent && !isGenerating && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No content yet</p>
                    <p className="text-sm mt-2">Fill in the details and click "Generate Blog"</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Creating your blog post...</p>
                    </div>
                  </div>
                )}

                {error && !isGenerating && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Generation Failed</h3>
                      <p className="text-gray-600 mb-4">{error}</p>
                      <Button
                        onClick={generateBlog}
                        variant="primary"
                        size="md"
                      >
                        Try Again
                      </Button>
                      {debugInfo && process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                          <summary className="text-sm text-gray-500 cursor-pointer">Debug Info</summary>
                          <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(debugInfo, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                {generatedContent && (
                  <div className="prose prose-lg max-w-none animate-slide-up">
                    <div
                      className="text-gray-800 leading-relaxed space-y-4 [&_table]:overflow-x-auto [&_table_td]:border [&_table_th]:font-semibold [&_table_th]:text-left [&_table_th]:border-gray-300 [&_table_td]:border-gray-300 [&_table_td]:px-4 [&_table_td]:py-3 [&_table_th]:text-gray-900 [&_table_td]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-blue-50 [&_blockquote]:italic [&_blockquote]:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: generatedContent }}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Feedback Card */}
            {generatedContent && (
              <Card variant="interactive" animated>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">How well did the AI follow your instructions?</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Prompt Adherence</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          onClick={() => submitFeedback('promptAdherence', num)}
                          className={`px-2 py-1 rounded text-xs transition-all ${
                            feedback?.promptAdherence === num
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Second-Person Tone</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          onClick={() => submitFeedback('tone', num)}
                          className={`px-2 py-1 rounded text-xs transition-all ${
                            feedback?.tone === num
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Conversational Style</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          onClick={() => submitFeedback('style', num)}
                          className={`px-2 py-1 rounded text-xs transition-all ${
                            feedback?.style === num
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">1=Poor, 5=Excellent</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
