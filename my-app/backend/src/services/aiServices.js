import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

/**
 * generateAIResponse
 * A reusable helper function to interact with Gemini.
 */
export const generateAIResponse = async (systemPrompt, userMessage) => {
  try {
    // Combine the instructions and the user input into one clear prompt
    const finalPrompt = `
      ${systemPrompt}
      
      ---
      USER INPUT / CONTENT TO ANALYZE:
      ${userMessage}
    `;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ AI Service Error:", error);
    throw error; // Let the route handle the error response
  }
};