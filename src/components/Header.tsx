'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
 showStartButton?: boolean;
}

export default function Header({ showStartButton = true }: HeaderProps) {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">BlogCraft AI</span>
        </Link>
        
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
          {showStartButton && (
            <Link
              href="/editor"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Writing
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}