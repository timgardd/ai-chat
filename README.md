# AI Chat Application

A modern, responsive AI chat application built with Next.js, integrating streaming responses and persistent conversation history.

## 🚀 Tech Stack

* **Frontend Framework**: Next.js 15 (App Router)
* **Styling**: Tailwind CSS
* **Database**: PostgreSQL
* **ORM**: Prisma
* **AI Integration**: Vercel AI SDK (@ai-sdk/react)
* **LLM Provider**: OpenRouter API
* **Deployment**: Vercel
* **Containerization**: Docker & Docker Compose (for local database)

## 🛠 Features

* **Real-time Streaming**: Utilizes Vercel AI SDK for smooth, token-by-token text streaming.
* **Database Persistence**: All conversations and messages are securely stored in a PostgreSQL database using Prisma ORM.
* **Optimistic UI Updates**: Instant message rendering via `@tanstack/react-query` and React state management.
* **Dockerized Development**: Easy local setup with `docker-compose`.

## 📦 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Database**:
   ```bash
   docker-compose up -d
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example` and add your `OPENROUTER_API_KEY`.

4. **Run Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```