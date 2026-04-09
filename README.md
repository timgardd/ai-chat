# Next.js AI Chat - Assignment 06

This is the final 6th assignment AI Chat Application featuring an intelligent Next.js backend, a persistent SQLite database using Prisma, and TanStack React Query for instantaneous cache synchronization.

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory (you can copy `.env.example`):
```bash
OPENROUTER_API_KEY="your-openrouter-key-here"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Database
Initialize the Prisma Client natively to establish the SQLite `dev.db`:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` to interact with the streaming LLM chat! All chats and messages are completely persistent using Prisma ORM.
