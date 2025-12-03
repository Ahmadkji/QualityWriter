import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Users, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">BlogCraft AI</span>
            </Link>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* About Content */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About BlogCraft AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing content creation with AI-powered writing assistance that helps you create professional blog posts in minutes, not hours.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To democratize content creation by providing powerful AI tools that help writers, marketers, and businesses create high-quality blog content efficiently. We believe everyone has valuable ideas to share, and our AI assistant helps bring those ideas to life.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Innovation",
                description: "Constantly pushing the boundaries of AI to deliver cutting-edge writing assistance."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "User-Centric",
                description: "Every feature is designed with our users' needs and workflows in mind."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Efficiency",
                description: "Helping you save time and focus on what matters most - your ideas and creativity."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality",
                description: "Maintaining high standards for content generation and user experience."
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 text-violet-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-12 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-xl mb-8 text-violet-100">
            Leveraging OpenAI's GPT models to understand context, tone, and generate human-like content
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Natural Language</h3>
              <p className="text-violet-100 text-sm">Understands context and nuance</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Adaptive Tone</h3>
              <p className="text-violet-100 text-sm">Matches your desired writing style</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Fast Generation</h3>
              <p className="text-violet-100 text-sm">Quality content in seconds</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Writing?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of content creators using AI</p>
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}