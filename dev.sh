#!/bin/bash

# Development script for StayWell
# Runs database, Redis, Prisma Studio, backend dev, and frontend dev

set -e  # Exit on any error

echo "🚀 Starting StayWell development environment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "❌ .env file not found. Please create it from .env.development"
    exit 1
fi

# Start database, Redis and run seeding
echo "🐳 Starting database, Redis and running database seeding..."
docker-compose up -d db redis db-seeder

# Wait for seeding to complete
echo "⏳ Waiting for database seeding to complete..."
sleep 10

# Start Prisma Studio in background
echo "🗃️  Starting Prisma Studio..."
docker-compose --profile studio up -d prisma-studio

# Start backend in development mode
echo "🔧 Starting backend in development mode..."
pnpm --filter backend dev &
BACKEND_PID=$!

# Start frontend in development mode
echo "🎨 Starting frontend in development mode..."
pnpm --filter frontend dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo ""
echo "📋 Services:"
echo "  - Database: localhost:5433 (with seeded data)"
echo "  - Redis: localhost:6379"
echo "  - Prisma Studio: http://localhost:5555"
echo "  - Backend API: http://localhost:3001 (dev mode)"
echo "  - Frontend: http://localhost:3000 (dev mode)"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for Ctrl+C to stop all processes
trap "echo '🛑 Stopping all services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker-compose down; exit 0" INT

# Keep script running
wait