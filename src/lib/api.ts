import { Message } from '../components/dashboard/ChatInterface';

const API_KEY = import.meta.env.VITE_OPENROUTER_API;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert AI development assistant. When asked to create or modify code:
1. Always provide complete, working implementations
2. Format code blocks with proper language tags
3. Include error handling and comments
4. Follow modern best practices
5. Respond in this format:
   - Brief explanation (if needed)
   - Complete code block with language tag
   - Any additional instructions

Example:
Here's a React component that implements a counter:

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\``;

export async function sendMessage(messages: Message[]) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}