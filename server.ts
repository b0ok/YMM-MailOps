import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: High-Thinking AI Spam & Threat Inspector
app.post('/api/analyze-spam', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email payload required' });
    }

    const prompt = `You are a Principal Cyber Security Specialist and Email Systems Administrator.
Analyze this incoming email that was flagged by the Java Spam Heuristic Filter.

EMAIL DETAILS:
From: ${email.sender || 'Unknown'}
To: ${email.recipient || 'Unknown'}
Subject: ${email.subject || 'No subject'}
Body:
${email.body || 'No content'}

Heuristic Risk Score: ${email.heuristicScore || 'N/A'}/10
Triggered Rules: ${(email.flags || []).join(', ')}

Perform a thorough security analysis. Identify:
1. Threat classification (Phishing, Social Engineering, Malware Carrier, BEC / CEO Fraud, Scam, Spoofing, or False Positive)
2. Indicators of Compromise (IoCs) & suspicious linguistic cues
3. Recommended administrative action (Quarantine, Hard Reject, Sandboxing, or Whitelist)
4. A concise threat explanation for the IT admin dashboard.

Return your response in clean JSON format matching this schema:
{
  "classification": string,
  "confidenceScore": number (0 to 100),
  "threatLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "recommendedAction": "QUARANTINE" | "BLOCK_SENDER" | "REJECT" | "DELIVER_WITH_WARNING" | "RELEASE_SAFE",
  "reasoningSummary": string,
  "detectedIndicators": string[],
  "mitigationAdvice": string
}`;

    // Per instruction: Use gemini-3.1-pro-preview and set thinkingLevel to ThinkingLevel.HIGH without maxOutputTokens
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, analysis: parsed, modelUsed: 'gemini-3.1-pro-preview (Thinking: HIGH)' });
    } catch (modelError: any) {
      console.warn('gemini-3.1-pro-preview error, attempting fallback to gemini-3.8-flash:', modelError?.message);
      // Fallback in case user's project key doesn't have tier access for pro preview yet
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const parsed = JSON.parse(fallbackResponse.text || '{}');
      return res.json({ success: true, analysis: parsed, modelUsed: 'gemini-3.8-flash (Fallback)' });
    }
  } catch (error: any) {
    console.error('Spam analysis failed:', error);
    return res.status(500).json({
      error: 'AI Analysis failed',
      details: error?.message || 'Internal server error',
    });
  }
});

// Dev vs Prod Vite mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Email Administration Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
