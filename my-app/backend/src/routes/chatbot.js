import express from "express";
import { generateAIResponse } from "../services/aiServices.js";

const router = express.Router();

// ROUTE 1: General Assistant
router.post("/ask", async (req, res) => {
  const { prompt, language } = req.body;
  
  const systemPrompt = `You are 'NaijaFreelance Assistant'. 
    Respond professionally in ${language === 'pcm' ? 'Pidgin' : 'English'}. 
    Focus on Nigerian context (banking, Naira, etc.).`;

  try {
    const answer = await generateAIResponse(systemPrompt, prompt);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ answer: "Omo, I no fit talk right now. Try again later!" });
  }
});

// ROUTE 2: Professional Proposal Writer
router.post('/proposal', async (req, res) => {
  const { jobDescription, language } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ error: "No job description provided." });
  }

  const systemPrompt = `
    You are a high-level Business Development Consultant for Freelancee9ja.
    Write a professional, winning freelance proposal.
    - Language: ${language === 'pcm' ? 'Professional Pidgin' : 'Standard English'}.
    - No 'begging' language. Focus on results.
    - Structure: Hook, Value, Methodology, Social Proof, CTA.
  `;

  try {
    const proposal = await generateAIResponse(systemPrompt, jobDescription);
    res.json({ proposal });
  } catch (error) {
    res.status(500).json({ error: "AI service failed to cook the proposal." });
  }
});

export default router;