#!/bin/bash

set -e

echo "🚀 Setting up database for LL application..."

echo "⏳ Waiting for database to be ready..."
until docker exec ll_postgres pg_isready -U postgres -d postgres; do
  echo "Database is not ready yet, waiting..."
  sleep 2
done

echo "✅ Database is ready!"

if ! docker ps | grep -q lls; then
  echo "❌ Server container is not running. Please start it first with:"
  echo "   docker-compose up lls -d"
  exit 1
fi

echo "🔄 Running database migrations..."
docker exec lls pnpm prisma migrate deploy

echo "🌱 Seeding database with sample data..."
docker exec lls pnpm prisma db seed

echo "🎉 Database setup completed successfully!"
echo ""
echo "You can now access:"
echo "  🌐 Application: http://localhost"
echo "  📊 Database Admin: http://localhost:8081"
echo "  🔧 API: http://localhost:3001"
