import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Key status endpoint (confirms key existence from user profile without exposing the secret)
app.get('/api/keys/status', (req, res) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY
  );

  res.json({
    hasKey: hasGeminiKey,
    source: hasGeminiKey ? 'User Profile Secrets (Injected by AI Studio)' : 'None detected',
    modelsSupported: ['gemini-4-argon', 'gemini-3.8-flash'],
  });
});

// Server-side Gemini proxy endpoint
app.post('/api/gemini', async (req, res) => {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      error: 'GEMINI_API_KEY is not configured in environment or user profile secrets.',
    });
  }

  try {
    const { prompt, messages, model = 'gemini-4-argon' } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction =
      "You are the Senior Legal and Environmental Investigator for HBNC Case 3 (Knabb v. City of Huntington Beach, 8:26-cv-00348-JWH-ADS) and the /ailaws framework. " +
      "You analyze toxic torts, hexavalent chromium (980 µg/kg, 49× DTSC level), the 1-year asphalt cap warranty (Laserfiche #5406552), " +
      "the 2 void ab initio public land deals (HBNC Shelter & Angel Stadium sale under Thomson v. Call, 38 Cal.3d 633), " +
      "and statutory causes of action (ADA Title II, FHA, RCRA 6972, Cal. Gov. Code 835, EADACPA 15657, § 1983 Monell). " +
      "Answer with authoritative citations, docket references, and clear legal elements.";

    const contents =
      messages && messages.length > 0
        ? messages.map((m: any) => ({
            role: m.role,
            parts: [{ text: m.text }],
          }))
        : [{ role: 'user', parts: [{ text: prompt }] }];

    let response;
    try {
      // First attempt requested model (e.g. gemini-4-argon)
      response = await ai.models.generateContent({
        model: model,
        contents,
        config: { systemInstruction },
      });
    } catch (modelErr) {
      console.warn(`Model ${model} unavailable, falling back to gemini-3.8-flash:`, modelErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: { systemInstruction },
      });
    }

    res.json({
      text: response.text || '',
      modelUsed: response.modelVersion || model,
    });
  } catch (err: any) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({
      error: err.message || 'Error processing Gemini request',
    });
  }
});

// Studio Neural AI TTS endpoint powered by Gemini Flash Lite TTS
app.post('/api/tts', async (req, res) => {

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      error: 'GEMINI_API_KEY is not configured in environment or user profile secrets.',
    });
  }

  try {
    const { text, voice = 'Charon', style } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS generation.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Official prebuilt voice names in Gemini TTS: 'Charon', 'Kore', 'Fenrir', 'Zephyr', 'Puck'
    const allowedVoices = ['Charon', 'Kore', 'Fenrir', 'Zephyr', 'Puck'];
    const selectedVoice = allowedVoices.includes(voice) ? voice : 'Charon';

    const defaultStyle = selectedVoice === 'Charon'
      ? 'Deep, authoritative, cinematic investigative documentary narrator with measured, gravitas cadence'
      : selectedVoice === 'Fenrir'
      ? 'Intense, resonant federal courtroom prosecutor delivering solemn indictment'
      : selectedVoice === 'Kore'
      ? 'Clear, calm, analytical federal intelligence briefing anchor'
      : 'Professional broadcast investigative journalism anchor';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: style || defaultStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by Gemini TTS model.' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voice: selectedVoice,
    });
  } catch (err: any) {
    console.error('Gemini TTS error:', err);
    res.status(500).json({
      error: err.message || 'Error generating studio voice',
    });
  }
});

// Mount Vite in development or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
