
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const chatWithGemini = async (message: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Lower temperature for more accurate data/SQL handling
      },
    });

    // Format history for Gemini chat
    // Note: Gemini expects 'user' and 'model' (as 'assistant' mapping)
    const formattedHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // We don't set the history in the create call for this specific SDK version pattern, 
    // we just use the session.
    
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
