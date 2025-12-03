#!/bin/bash

# Moonshot AI Kimi K2 Integration Setup Script
# This script helps you set up the environment and install dependencies

echo "🚀 Setting up BlogCraft AI with Moonshot AI Kimi K2 integration..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d' ' -f2 | cut -d. -f1)
echo "✅ Node.js version: $NODE_VERSION"

# Check Node.js version
if [[ $(echo "$NODE_VERSION" | cut -d. -f1 | cut -d. -f2) -lt 18 ]]; then
    echo "⚠️  Warning: Node.js version should be 18+ for best compatibility"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example file not found"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
else
    echo "📝 .env.local already exists"
fi

# Prompt for API key
echo ""
echo "🔑 Next step: Configure your Moonshot AI API key"
echo ""
echo "1. Open .env.local in your editor:"
echo "   nano .env.local"
echo ""
echo "2. Replace 'your_moonshot_api_key_here' with your actual API key"
echo ""
echo "3. Save the file and exit the editor"
echo ""
echo "4. Run the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Your application will be available at: http://localhost:3000"
echo ""
echo "📚 For more information, visit: https://platform.moonshot.ai/docs"
echo ""

# Check if API key is configured
API_KEY=$(grep "MOONSHOT_API_KEY=your_moonshot_api_key_here" .env.local)
if [[ "$API_KEY" == "MOONSHOT_API_KEY=your_moonshot_api_key_here" ]]; then
    echo "⚠️  Warning: API key not configured in .env.local"
    echo "Please edit .env.local and add your Moonshot AI API key"
else
    echo "✅ API key is configured"
fi

echo ""
echo "🎉 Setup complete! You can now start using Kimi K2 for blog generation."