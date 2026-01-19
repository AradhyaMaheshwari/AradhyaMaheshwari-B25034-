# RoyalChess ♔ - Docker Challenge

## 🎯 Challenge Overview

Welcome to the RoyalChess Docker Challenge! Your task is to **containerize this full-stack chess application** using Docker and Docker Compose. This challenge will test your understanding of:

- Multi-stage Docker builds
- Container orchestration
- Environment configuration
- Database persistence
- Network configuration between containers

## 📋 About the Application

RoyalChess is a premium online chess platform featuring:

- ♟️ **Real-time multiplayer** - Play against other users with live updates
- 👥 **Spectator mode** - Watch and chat in ongoing games
- 📊 **User accounts** - Track stats and game history
- 📱 **Responsive design** - Mobile-friendly interface
- 🎨 **Modern UI** - Built with royal blue theme

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS + daisyUI** - Styling
- **react-chessboard** - Chess board component
- **Socket.io Client** - Real-time communication

### Backend
- **Express.js** - REST API server
- **Socket.io** - WebSocket server for real-time features
- **PostgreSQL** - Relational database
- **node-postgres** - Database client
- **TypeScript** - Type safety

### Chess Logic
- **chess.js** - Chess game rules and validation

## 📁 Project Architecture

```
royalchess/
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components (auth, game, home)
│   │   ├── context/       # React Context (session management)
│   │   ├── lib/           # API utilities (auth, game, user)
│   │   └── styles/        # Global CSS and Tailwind config
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── next.config.js     # Next.js configuration
│   └── tsconfig.json      # TypeScript config
│
├── server/                # Express.js Backend Application
│   ├── src/
│   │   ├── controllers/   # Request handlers (auth, games, users)
│   │   ├── routes/        # API route definitions
│   │   ├── socket/        # Socket.io event handlers
│   │   ├── db/            # Database models and schema
│   │   ├── middleware/    # Express middleware (sessions)
│   │   └── server.ts      # Main server entry point
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript config
│
├── types/                 # Shared TypeScript type definitions
│   └── index.d.ts         # Common types used by frontend & backend
│
├── package.json           # Root workspace configuration
├── pnpm-workspace.yaml    # PNPM monorepo workspace config
└── pnpm-lock.yaml         # Dependency lock file
```

## 🚀 Local Development Setup (Without Docker)

### Prerequisites
- Node.js 20+ (LTS recommended)
- PNPM package manager
- PostgreSQL 15+ database

### Installation Steps

1. **Install PNPM**
   ```bash
   npm install -g pnpm
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Setup PostgreSQL Database**
   - Create a new database named `royalchess`
   - Note down your database credentials

4. **Configure Environment Variables**
   
   Create `.env` file in the **server** directory:
   ```env
   PGHOST=localhost
   PGPORT=5432
   PGUSER=your_postgres_user
   PGPASSWORD=your_postgres_password
   PGDATABASE=royalchess
   NODE_ENV=development
   PORT=3001
   ```

5. **Run Development Servers**
   ```bash
   # Run both frontend and backend
   pnpm dev
   
   # Or run separately:
   pnpm dev:client    # Frontend at http://localhost:3000
   pnpm dev:server    # Backend at http://localhost:3001
   ```

6. **Build for Production**
   ```bash
   pnpm build:client  # Build Next.js frontend
   pnpm build:server  # Build Express.js backend
   ```

## 🎓 Docker Challenge Requirements

Your task is to containerize this application for **production-grade deployment**.

### What You Need to Create:

1. **Dockerfile** - Multi-stage build that creates an optimized production image
2. **docker-compose.yml** - Orchestrates the application and database services
3. **Startup script** - Runs both frontend and backend servers

### Requirements:

**Application Container:**
- Use Node.js Alpine as base image
- Install PNPM and all monorepo dependencies
- Build both client and server applications
- Run both servers simultaneously
- Expose necessary ports for web access

**Database Setup:**
- PostgreSQL service with persistent storage
- Proper network configuration between services
- Health checks to ensure startup order

**Production Considerations:**
- Optimized image size (multi-stage builds)
- Data persistence across container restarts
- Services accessible from host machine
- Proper environment configuration

### Environment Variables

Configure these environment variables in your setup:

**Database Connection:**
```
PGHOST       - Database hostname (use service name from compose)
PGPORT       - PostgreSQL port (default: 5432)
PGDATABASE   - Database name
PGUSER       - Database username
PGPASSWORD   - Database password
```

**Application Configuration:**
```
NODE_ENV        - Set to 'development' or 'production'
SESSION_SECRET  - Secret key for session management
CORS_ORIGIN     - CORS configuration for API
HOSTNAME        - Set to '0.0.0.0' for network accessibility
PORT            - Backend server port (default: 3001)
```

## 🎯 Success Criteria

Your Docker setup is successful when:

- ✅ Application builds without errors
- ✅ Both frontend and backend start successfully
- ✅ Database connections work properly
- ✅ You can create accounts and games
- ✅ Real-time features (Socket.io) function correctly
- ✅ Application is accessible from host machine

## 📝 License

This project is provided for educational purposes.

---

**Good luck with the challenge!** 🚀

*RoyalChess - Premium Online Chess Experience* ♔
