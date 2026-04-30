# AI Chat

## Setup

Create a `.env.local` file in the root:

```
OPENROUTER_API_KEY="your-api-key-here"
DATABASE_URL="file:./dev.db"
```

## Run

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)