
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatWithBackendLLM = async (
  message: string, 
  history: ChatMessage[], 
  context: Record<string, string>
): Promise<string> => {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        context
      }),
    });

    if (!response.ok) {
      throw new Error('LLM Gateway Error');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Backend LLM Error:", error);
    return "Error: Could not reach the LLM gateway. Please ensure the backend is running.";
  }
};
