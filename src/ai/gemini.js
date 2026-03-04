import { GoogleGenAI } from "@google/genai";

import { z } from "zod"; // 👈 add this

const ResponseSchema = z.object({
  // 👈 add this block
  command: z.string(),
  explanation: z.string(),
  riskScore: z.number().min(1).max(10),
  riskAnalysis: z.string(),
});

import config from "../core/config.js";

export const getCommandFromAI = async (prompt) => {
  const apiKey = config.get("apiKey") || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set.\n\n" +
        "1. Get a free key at https://aistudio.google.com/app/apikey\n" +
        "2. Run 'terminally config' to save your key.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: `You are Terminally, an expert terminal assistant.
Your goal is to convert natural language into high-quality, safe, and efficient bash/zsh commands.

CRITICAL SAFETY RULES:
1. Target Analysis: If a command involves PIDs (process IDs), analyze if they are critical system processes.
2. Flag Analysis: Explicitly check for dangerous flags like -rf, --force, --no-preserve-root, or sudo.
3. OS Context: Only suggest commands that work on macOS/Unix.
4. Response Format: Return ONLY a raw JSON object with no markdown or backticks:
   {
     "command": "the shell command",
     "explanation": "what it does",
     "riskScore": 1-10 (High risk for rm -rf, sudo, or killing system PIDs),
     "riskAnalysis": "Specific analysis of flags and targets"
   }`,
    },
  });

  try {
    const clean = response.text.replace(/```json|```/g, "").trim();
    return ResponseSchema.parse(JSON.parse(clean));
  } catch {
    throw new Error(
      "AI returned an invalid response format. Please try again.",
    );
  }
};
