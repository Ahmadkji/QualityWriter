'use client';

import React, { useState } from 'react';
import { Wand2, Copy, Download, RefreshCw, Sparkles, BookOpen, Zap, Bot } from 'lucide-react';

export default function BlogWritingApp() {
  const [activeTab, setActiveTab] = useState('landing');
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
    if (!blogData.topic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent('');
    setError(null);
    setDebugInfo(null);

    try {
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
        
        if (response.ok) {
          setGeneratedContent(data.content);
          setDebugInfo(data);
        } else {
          setError(data.error || 'Error generating content. Please try again.');
          setDebugInfo(data);
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Network error:', error);
    } finally {
      setIsGenerating(false);
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

  if (activeTab === 'editor') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">BlogCraft AI</span>
            </div>
            <button 
              onClick={() => setActiveTab('landing')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Blog Settings
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={blogData.topic}
                      onChange={(e) => setBlogData({...blogData, topic: e.target.value})}
                      placeholder="What's your blog about?"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* AI Model Selection */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-green-500" />
                      AI Model Selection
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="model"
                          value="kimi-k2"
                          checked={blogData.model === 'kimi-k2'}
                          onChange={(e) => setBlogData({...blogData, model: e.target.value as 'kimi-k2'})}
                          className="text-violet-600 focus:ring-violet-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Kimi K2 (Moonshot AI)</div>
                          <div className="text-sm text-gray-600">Advanced reasoning with 32k context window</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Blog Options */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Blog Options
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tone</label>
                        <select
                          value={blogData.tone}
                          onChange={(e) => setBlogData({...blogData, tone: e.target.value as any})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                        >
                          <option value="conversational">Conversational</option>
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Length</label>
                        <select
                          value={blogData.length}
                          onChange={(e) => setBlogData({...blogData, length: e.target.value as any})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                        >
                          <option value="short">Short (800-1200 words)</option>
                          <option value="medium">Medium (1500-2000 words)</option>
                          <option value="long">Long (2500-3000 words)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={blogData.enableStreaming}
                            onChange={(e) => setBlogData({...blogData, enableStreaming: e.target.checked})}
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          />
                          Enable streaming generation
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bold Formatting Settings */}
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      AI Bold Formatting
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={blogData.enableAutoEmphasis}
                            onChange={(e) => setBlogData({...blogData, enableAutoEmphasis: e.target.checked})}
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                          />
                          Enable AI-powered bold formatting
                        </label>
                      </div>
                      
                      {blogData.enableAutoEmphasis && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Bold Intensity</label>
                          <select
                            value={blogData.emphasisIntensity}
                            onChange={(e) => setBlogData({...blogData, emphasisIntensity: e.target.value as any})}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                          >
                            <option value="subtle">Subtle (minimal bold text)</option>
                            <option value="moderate">Moderate (balanced bold text)</option>
                            <option value="strong">Strong (prominent bold text)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">AI will apply professional bold formatting based on your intensity setting</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={generateBlog}
                    disabled={isGenerating || !blogData.topic.trim()}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Generate Blog
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Tips for Better Results
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Be specific about your topic</li>
                  <li>• Kimi K2 writes in second-person ("you" and "your")</li>
                  <li>• Generates comprehensive content (1500-2000 words)</li>
                  <li>• Creates conversational, human-like content</li>
                  <li>• AI applies professional bold formatting when enabled</li>
                  <li>• Advanced reasoning with 32k context window</li>
                </ul>
              </div>
            </div>

            {/* Editor Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Generated Content</h3>
                  {generatedContent && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setGeneratedContent('')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Clear"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 min-h-[600px]">
                  {!generatedContent && !isGenerating && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                      <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-500">No content yet</p>
                      <p className="text-sm mt-2">Fill in the details and click "Generate Blog"</p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
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
                        <button
                          onClick={generateBlog}
                          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                        >
                          Try Again
                        </button>
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
                    <div className="prose prose-lg max-w-none">
                      <div
                        className="text-gray-800 leading-relaxed space-y-4 [&_table]:overflow-x-auto [&_table_td]:border [&_table_th]:font-semibold [&_table_th]:text-left [&_table_th]:border-gray-300 [&_table_td]:border-gray-300 [&_table_td]:px-4 [&_table_td]:py-3 [&_table_th]:text-gray-900 [&_table_td]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-blue-50 [&_blockquote]:italic [&_blockquote]:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: generatedContent }}
                      />
                    </div>
                  )}

                  {generatedContent && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">How well did the AI follow your instructions?</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Prompt Adherence</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                onClick={() => submitFeedback('promptAdherence', num)}
                                className={`px-2 py-1 rounded text-xs ${
                                  feedback?.promptAdherence === num
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Second-Person Tone</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                onClick={() => submitFeedback('tone', num)}
                                className={`px-2 py-1 rounded text-xs ${
                                  feedback?.tone === num
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Conversational Style</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                onClick={() => submitFeedback('style', num)}
                                className={`px-2 py-1 rounded text-xs ${
                                  feedback?.style === num
                                    ? 'bg-violet-500 text-white'
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">BlogCraft AI</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </a>
            <a
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Pricing
            </a>
            <button
              onClick={() => setActiveTab('editor')}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Writing
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-6 px-4 py-2 bg-green-100 rounded-full">
          <span className="text-sm font-medium text-green-700">Kimi K2 Integration Available</span>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Blog Writing Platform<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            Powered by Kimi K2
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Advanced AI blog generation with Moonshot's Kimi K2 model. 
          Experience cutting-edge reasoning and 32k context window for comprehensive content creation.
        </p>

        <button
          onClick={() => setActiveTab('editor')}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-green-500/30 transition-all inline-flex items-center gap-2"
        >
          Start Writing with Kimi K2
          <BookOpen className="w-5 h-5" />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Bot className="w-8 h-8" />,
              title: 'Advanced AI Model',
              description: 'Kimi K2 with 32k context window and reasoning capabilities'
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: 'Smart Content Generation',
              description: 'Comprehensive blog posts with proper structure and formatting'
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: 'Real-time Processing',
              description: 'Streaming support for instant content generation'
            }
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Experience the Power of Kimi K2</h2>
          <p className="text-xl mb-8 text-gray-100">Start generating high-quality blog content with advanced AI reasoning</p>
          <button
            onClick={() => setActiveTab('editor')}
            className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
          >
            Try Kimi K2 Now
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
