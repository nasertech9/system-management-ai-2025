
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIAssistantResponse = async (prompt: string, chatHistory: { role: string, parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    return { text: "API Key not configured. Please set up your API key.", action: null };
  }
  
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are a system management AI assistant integrated into a dashboard.
  The user will give you commands.
  If the user asks to perform an action, respond ONLY with a JSON object.
  Possible actions are:
  - 'ADD_USER': requires 'name' (string) and 'role' ('Admin', 'Operator', 'Viewer').
  - 'OPTIMIZE_MEMORY': no parameters required.
  - 'SHOW_PERFORMANCE': no parameters required.
  Example user query: "Add a new operator named Alex."
  Your JSON response: {"action": "ADD_USER", "params": {"name": "Alex", "role": "Operator"}}
  
  If the user asks a question or makes a statement that is not a direct command, provide a helpful, concise text response.
  Example user query: "What is the system status?"
  Your text response: "The system is currently online with all services operational."`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction,
        }
    });

    const text = response.text;
    
    try {
      const jsonResponse = JSON.parse(text);
      if (jsonResponse.action) {
        return { text: `Executing action: ${jsonResponse.action}`, action: jsonResponse };
      }
    } catch (e) {
      // Not a JSON response, treat as text
    }

    return { text, action: null };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { text: "Sorry, I encountered an error. Please try again.", action: null };
  }
};

export const getAIInsight = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return "AI features are disabled. API key is not configured.";
    }
    const model = "gemini-2.5-flash";
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching AI insight:", error);
        return "Failed to get AI insight. Please check the console for details.";
    }
}
