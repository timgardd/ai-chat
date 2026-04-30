
## Local Development

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