# Next.js AI Chat

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root folder and add your key:
```bash
OPENROUTER_API_KEY="your-api-key-here"
```

### 2. Install and run database
```bash
npm install
npx prisma db push
```

### 3. Run the app
```bash
npm run dev
```

Open `http://localhost:3000` to use the chat.