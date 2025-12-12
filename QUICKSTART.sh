#!/bin/bash

# Asymmetric Cryptography Demo - Quick Start Script
# This script sets up and runs both backend and frontend

echo "=================================================="
echo "🔐 Asymmetric Cryptography Demo - Quick Start"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend || exit
echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

echo ""
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!
echo "Backend running with PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Frontend Setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend || exit
echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo "🚀 Starting frontend server..."
npm run dev

# Cleanup on exit
trap "echo 'Shutting down servers...'; kill $BACKEND_PID 2>/dev/null" EXIT
