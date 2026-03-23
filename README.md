# Assignment 04: React Chat Application

This is the React Migration of the plain-JavaScript chat app (Assignment 03) using Vite.
It features a component-based structure, uses `useState` and `useEffect`, and relies on a mock API for conversations and messages.
Tailwind CSS is integrated via CDN for styling.
The original vanilla JS files have been backed up in the `legacy` folder.

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. **IMPORTANT: OpenRouter API Key**
   To enable AI chat responses, you must provide your OpenRouter API key.
   Open the file `src/api/llm.js` and replace `'YOUR_API_KEY_HERE'` with your actual API key:

   ```javascript
   // src/api/llm.js
   const apiKey = "YOUR_API_KEY_HERE"; // Replace this!
   ```

   _(Note: The API key is intentionally not committed to the repository for security reasons.)_

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.
