import { GoogleGenAI } from "@google/genai";

import { z } from "zod"; // 👈 add this

const ResponseSchema = z.object({
  command: z.string(),
  explanation: z.string(),
  riskScore: z.number().min(1).max(10),
  riskAnalysis: z.string(),
  simulation: z
    .object({
      fileCount: z.string().optional(),
      spaceImpact: z.string().optional(),
      processes: z.string().optional(),
      git: z.string().optional(),
    })
    .optional(),
});

import config from "../core/config.js";

import shell from "shelljs";

export const getCommandFromAI = async (prompt) => {
  const apiKey = config.get("apiKey") || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set.\n\n" +
        "1. Get a free key at https://aistudio.google.com/app/apikey\n" +
        "2. Run 'terminally config' to save your key.",
    );
  }

  // Get Context (ls -F and Project Detection)
  const files = shell.ls("-F").join("\n");
  const projectType = [];
  if (shell.test("-f", "package.json")) projectType.push("Node.js");
  if (shell.test("-f", "requirements.txt") || shell.test("-f", "setup.py"))
    projectType.push("Python");
  if (shell.test("-f", "Dockerfile")) projectType.push("Docker");
  if (shell.test("-d", ".git")) projectType.push("Git");

  const fullPrompt = `CONTEXT:
OS: ${process.platform}
Project Type: ${projectType.join(", ") || "Unknown"}
Files in Current Directory:
${files}

USER REQUEST: ${prompt}`;

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullPrompt,
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
     "riskAnalysis": "Analysis of flags/targets",
     "simulation": {
        "fileCount": "N files will be created/deleted",
        "spaceImpact": "N MB change",
        "processes": "Description of PIDs affected",
        "git": "Branches/commits affected"
     }
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
export const diagnoseErrorFromAI = async (command, stderr) => {
  const apiKey = config.get("apiKey") || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Command failed: ${command}\nError: ${stderr}\n\nSuggest a fix.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction: `You are Terminally, an expert debugger. 
Analyse the error and suggest a fix.
Response Format (JSON only):
{
  "command": "the fix command",
  "explanation": "why this fixes it",
  "riskScore": 1-10,
  "riskAnalysis": "risk details"
}`,
    },
  });

  try {
    const clean = response.text.replace(/```json|```/g, "").trim();
    return ResponseSchema.parse(JSON.parse(clean));
  } catch {
    throw new Error("Diagnosis failed.");
  }
};
