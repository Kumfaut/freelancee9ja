import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// 1. Initialize with the Default Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  try {
    const { prompt, language } = req.body;
    
    // Change gemini-1.5-flash to gemini-2.0-flash
    // Change gemini-2.0-flash to the newer preview model
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const formattedPrompt = `
      You are 'NaijaFreelance Assistant'. 

      CORE RULES:
      1. ADAPTIVE TONE: If the user speaks English, reply in Professional English. If the user speaks Pidgin, you can use Pidgin. 
      2. NIGERIAN CONTEXT: Always focus on Nigerian banking (OPay, GTB, etc.) and Naira.
      3. FORMATTING: Use clear, bulleted lists. DO NOT use too many hashtags.
      4. LANGUAGE SETTING: The user's current interface language is ${language}.

      User: ${prompt}
      `;

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ answer: text });
    
  } catch (error) {
    // This will help us see if the error changed from 404 to something else
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ answer: "Abeg, network don bash small. Try again!" });
  }
});

export default router;