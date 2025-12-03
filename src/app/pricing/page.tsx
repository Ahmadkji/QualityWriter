import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Check, Star } from 'lucide-react';

export default function PricingPage() {
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

      {/* Pricing Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-violet-300 hover:shadow-lg transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for trying out BlogCraft AI</p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "3 blog posts per month",
                "Basic tones",
                "Up to 500 words",
                "Copy to clipboard",
                "Community support"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/"
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-8 text-white relative transform scale-105 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Most Popular
              </div>
            </div>
            
            <div className="mb-8 mt-4">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-violet-100 mb-6">For serious content creators</p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold">$19</span>
                <span className="text-violet-100 ml-2">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited blog posts",
                "All premium tones",
                "Up to 2000 words",
                "Advanced customization",
                "Priority support",
                "Export to multiple formats",
                "AI-powered suggestions"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                  <span className="text-violet-50">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/"
              className="w-full py-3 bg-white text-violet-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center block"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-violet-300 hover:shadow-lg transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For teams and organizations</p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Everything in Pro",
                "Team collaboration",
                "Custom AI models",
                "API access",
                "Dedicated support",
                "Custom integrations",
                "Advanced analytics",
                "SLA guarantee"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/"
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center block"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes, we offer a 14-day free trial for all paid plans with full access to features."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise plans."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use industry-standard encryption and never share your content with third parties."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied writers</p>
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all inline-block"
          >
            Start Writing Now
          </Link>
        </div>
      </section>
    </div>
  );
}