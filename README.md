# 💡 LL - Idea Voting System

A modern full-stack idea voting application 4. **Access the application**
   - **Frontend**: http://localhost:8082
   - **Backend API**: http://localhost:3001
   - **Database Admin**: http://localhost:8083t with React, NestJS, Prisma, and PostgreSQL. Users can submit, view, and vote on ideas with a beautiful animated interface.

## ✨ Features

- **Interactive Voting**: Vote for ideas with smooth animations
- **Two-Column Layout**: Voted ideas separate from unvoted ones
- **Pagination**: Browse through ideas 5 at a time
- **Vote Limits**: Maximum 10 votes per IP address
- **Real-time Updates**: Immediate visual feedback
- **Responsive Design**: Works on desktop and mobile
- **Secure**: IP-based vote tracking with conflict handling

## 🏗️ Architecture

### Frontend (`llc`)
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Axios** for API communication
- **Sonner** for toast notifications

### Backend (`lls`)
- **NestJS** framework with Fastify
- **Prisma ORM** with PostgreSQL
- **TypeScript** for type safety
- **Caching** with built-in cache manager
- **Rate limiting** and security middleware

### Database
- **PostgreSQL** with pgvector extension
- **Prisma migrations** for schema management
- **Seed data** for development

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Docker** and **Docker Compose** (recommended)
- **Node.js 18+** and **pnpm (another package manager - npm | yarn)** (for local development)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ll
   ```

2. **Start with Docker Compose**
   ```bash
   # Start all services
   docker-compose up -d

   # View logs
   docker-compose logs -f

   # Stop all services
   docker-compose down
   ```

3. **Run database migrations**
   ```bash
   # Enter the server container
   docker exec -it ll_server sh

   # Run migrations
   pnpm prisma migrate deploy
   pnpm prisma db seed
   ```

4. **Access the application**
   - **Frontend**: http://localhost:8082
   - **Backend API**: http://localhost:3001
   - **Database Admin**: http://localhost:8083

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ll
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   pnpm install

   # Install client dependencies
   cd ll_client && pnpm install && cd ..

   # Install server dependencies
   cd ll_server && pnpm install && cd ..
   ```

3. **Start PostgreSQL**
   ```bash
   # Using Docker
   docker-compose up postgres -d

   # Or use your local PostgreSQL instance
   ```

4. **Setup database**
   ```bash
   cd ll_server

   # Create .env file with database URL
   echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres" > .env

   # Run migrations
   pnpm prisma migrate deploy
   pnpm prisma db seed
   ```

5. **Start development servers**
   ```bash
   # From root directory - starts both client and server
   pnpm start

   # Or start individually:
   # Server: pnpm run server
   # Client: pnpm run client
   ```

6. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001

## 📝 Scripts

### Root Directory
```bash
pnpm start              # Start both client and server
pnpm run client         # Start client only
pnpm run server         # Start server only
pnpm run client-install # Install client dependencies
pnpm run server-install # Install server dependencies
```

### Client (`ll_client`)
```bash
pnpm dev               # Start development server
pnpm build             # Build for production
pnpm preview           # Preview production build
pnpm lint              # Lint code
```

### Server (`ll_server`)
```bash
pnpm start:dev         # Start development server
pnpm build             # Build for production
pnpm start:prod        # Start production server
pnpm prisma:migrate    # Run database migrations
pnpm prisma:seed       # Seed database with sample data
pnpm prisma:studio     # Open Prisma Studio
pnpm prisma:generate   # Generate Prisma client
pnpm test              # Run tests
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build -d

# Start specific services
docker-compose up postgres ll_server -d

# View logs
docker-compose logs -f ll_server
docker-compose logs -f ll_client

# Execute commands in containers
docker exec -it ll_server pnpm prisma migrate deploy
docker exec -it ll_server pnpm prisma db seed

# Rebuild specific service
docker-compose up --build ll_server -d

# Stop and remove all containers
docker-compose down

# Remove volumes (warning: deletes data)
docker-compose down -v
```

## 🌐 API Endpoints

### Ideas
- `GET /ideas?limit=5&offset=0` - Get paginated ideas
- `GET /ideas/:id` - Get specific idea
- `POST /ideas/:id/vote` - Vote for an idea

### Voting
- `GET /votes/status` - Get user's voting status
- `DELETE /votes/reset` - Reset user's votes (development only)

## 🗂️ Project Structure

```
ll/
├── ll_client/                 # React frontend
│   ├── src/
│   │   ├── data/
│   │   │   └── stores/        # Zustand stores
│   │   ├── view/
│   │   │   └── components/    # React components
│   │   └── ...
│   ├── Dockerfile             # Client Docker configuration
│   └── package.json
├── ll_server/                 # NestJS backend
│   ├── src/
│   │   ├── api/              # API controllers & services
│   │   ├── database/         # Database service
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # Database migrations
│   │   └── seed.ts          # Seed data
│   ├── Dockerfile           # Server Docker configuration
│   └── package.json
├── docker-compose.yml       # Docker Compose configuration
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

#### Server (`ll_server/.env`)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
NODE_ENV=development
PORT=3000
```

#### Client
The client uses Vite's environment variables. Create `ll_client/.env` if needed:
```bash
VITE_API_URL=http://localhost:3000
```

## 🚀 Production Deployment

### Using Docker
The Docker setup is production-ready with:
- Multi-stage builds for optimization
- Non-root user for security
- Health checks
- Proper networking
- Volume persistence

### Manual Deployment
1. Build the client: `cd ll_client && pnpm build`
2. Build the server: `cd ll_server && pnpm build`
3. Deploy built files to your server
4. Run database migrations: `pnpm prisma migrate deploy`
5. Start with PM2 or similar process manager

## 🛠️ Development

### Adding New Features
1. **Backend**: Add controllers/services in `ll_server/src/api/`
2. **Frontend**: Add components in `ll_client/src/view/components/`
3. **Database**: Update `ll_server/prisma/schema.prisma` and run migrations

### Database Changes
```bash
# Create migration
cd ll_server
pnpm prisma migrate dev --name your_migration_name

# Reset database (development only)
pnpm prisma migrate reset
```

### Code Style
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

## 📊 Monitoring

- **Health Checks**: Built into Docker containers
- **Logs**: Use `docker-compose logs -f` to monitor
- **Database**: Access pgweb at http://localhost:8083

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change ports in docker-compose.yml or stop conflicting services
   sudo lsof -i :3000
   ```

2. **Database connection failed**
   ```bash
   # Ensure PostgreSQL is running
   docker-compose up postgres -d
   ```

3. **Prisma client not found**
   ```bash
   cd ll_server
   pnpm prisma generate
   ```

4. **Build fails**
   ```bash
   # Clear Docker cache
   docker system prune -a

   # Rebuild from scratch
   docker-compose up --build --force-recreate
   ```

### Getting Help

- Check the logs: `docker-compose logs -f`
- Verify services: `docker-compose ps`
- Test database: Connect to pgweb at http://localhost:8081

---

**Happy coding! 🎉**
