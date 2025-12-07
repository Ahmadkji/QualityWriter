'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Zap, Bot } from 'lucide-react';

export default function BlogWritingApp() {

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
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/editor"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Writing
            </Link>
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

        <Link
          href="/editor"
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-green-500/30 transition-all inline-flex items-center gap-2"
        >
          Start Writing with Kimi K2
          <BookOpen className="w-5 h-5" />
        </Link>
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
          <Link
            href="/editor"
            className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Try Kimi K2 Now
            <Zap className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
