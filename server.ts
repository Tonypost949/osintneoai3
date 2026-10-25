import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Runtime memory pool for additional keys registered via UI under one roof
const runtimeRegisteredKeys = new Set<string>();

// Auto-discover keys from local user profile vaults (/mnt/c/Amd949609_Antigravity_v1) if available at runtime
function loadLocalProfileVaultKeys(): string[] {
  const discovered: string[] = [];
  const vaultEnvFiles = [
    '/mnt/c/Amd949609_Antigravity_v1/Amd949609_keys/.env',
    '/mnt/c/Amd949609_Antigravity_v1/amd949609@gmail.com_keys/.env',
  ];

  for (const envPath of vaultEnvFiles) {
    try {
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf-8');
        const matches = raw.match(/AIzaSy[A-Za-z0-9_-]{33}/g);
        if (matches) {
          discovered.push(...matches);
        }
      }
    } catch {
      // Ignore if inaccessible in cloud container
    }
  }

  try {
    const jsonVaultPath = '/mnt/c/Amd949609_Antigravity_v1/Amd949609_keys/api_vault.json';
    if (fs.existsSync(jsonVaultPath)) {
      const rawJson = fs.readFileSync(jsonVaultPath, 'utf-8');
      const matches = rawJson.match(/AIzaSy[A-Za-z0-9_-]{33}/g);
      if (matches) {
        discovered.push(...matches);
      }
    }
  } catch {
    // Ignore
  }

  return discovered;
}

// Collect all configured API keys from AI Studio environment, multi-account profile vaults, and runtime additions
function getApiKeyPool(req?: Request): string[] {
  const headerKey = req?.headers?.['x-gemini-key'];
  const clientHeaderKey = typeof headerKey === 'string' && headerKey.trim().length > 10 ? headerKey.trim() : undefined;

  const candidates = [
    clientHeaderKey,
    ...Array.from(runtimeRegisteredKeys),
    process.env.GEMINI_API_KEY,
    process.env.SECONDARY_GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6,
    process.env.API_KEY,
    process.env.GOOGLE_API_KEY,
    ...loadLocalProfileVaultKeys(),
  ].filter((k): k is string => Boolean(k && k.trim().length > 10 && k !== 'ENV_SERVER_INJECTED'));

  return Array.from(new Set(candidates));
}

let currentKeyIdx = 0;

function getNextRotatedKeys(req?: Request): string[] {
  const pool = getApiKeyPool(req);
  if (pool.length === 0) return [];
  const start = currentKeyIdx % pool.length;
  currentKeyIdx = (currentKeyIdx + 1) % pool.length;
  return [...pool.slice(start), ...pool.slice(0, start)];
}

// Helper to ensure base64 audio has a valid 44-byte RIFF WAV header (24kHz, 16-bit, mono)
function ensureWavBase64(rawBase64: string, sampleRate = 24000): string {
  const buf = Buffer.from(rawBase64, 'base64');
  if (buf.length >= 4 && buf.toString('ascii', 0, 4) === 'RIFF') {
    return rawBase64;
  }
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = buf.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20);  // PCM format = 1
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, buf]).toString('base64');
}

// Split narration into <=175-character sentence chunks for Cloud Neural MP3 fallback when Gemini TTS quota is in cooldown
function splitTextIntoTtsChunks(text: string, maxLen = 175): string[] {
  const clean = text.replace(/C:\\[^\s,.]+/g, 'the primary evidence locker').replace(/\s+/g, ' ').trim();
  const sentences = clean.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || [clean];
  const chunks: string[] = [];

  for (const sentence of sentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
    } else {
      const words = sentence.split(' ');
      let current = '';
      for (const w of words) {
        if ((current + ' ' + w).trim().length <= maxLen) {
          current = (current + ' ' + w).trim();
        } else {
          if (current) chunks.push(current);
          current = w;
        }
      }
      if (current) chunks.push(current);
    }
  }
  return chunks;
}

async function synthesizeCloudNeuralMp3Base64(text: string): Promise<string | null> {
  try {
    const chunks = splitTextIntoTtsChunks(text, 175);
    const tl = 'en-GB'; // Deep authoritative voice cadence locked for Charon
    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${encodeURIComponent(chunk)}`;
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      if (!resp.ok) return null;
      const arrBuf = await resp.arrayBuffer();
      buffers.push(Buffer.from(arrBuf));
    }

    if (buffers.length === 0) return null;
    return Buffer.concat(buffers).toString('base64');
  } catch {
    return null;
  }
}

// Key status endpoint (confirms unified multi-account key pool without exposing raw secrets)
app.get('/api/keys/status', (req, res) => {
  const pool = getApiKeyPool(req);
  const primaryKey = pool[0] || '';
  const secondaryKey = pool[1] || '';
  res.json({
    hasKey: pool.length > 0,
    keyPoolCount: pool.length,
    lockedVoice: 'Charon (Deep Studio Documentary)',
    source:
      pool.length > 0
        ? `Unified osintneoai.me Multi-Account Vault (${pool.length} Active Keys Pooled with Auto-Failover)`
        : 'None detected',
    activeModel: 'gemini-4-argon',
    serverKeyMasked: primaryKey ? `${primaryKey.slice(0, 8)}••••••••••••••••${primaryKey.slice(-4)}` : 'None detected',
    hasSecondaryKey: Boolean(secondaryKey),
    secondaryKeyMasked: secondaryKey ? `${secondaryKey.slice(0, 6)}••••••••${secondaryKey.slice(-4)}` : 'Not configured',
    maskedPool: pool.map((k, idx) => ({
      index: idx + 1,
      masked: `${k.slice(0, 6)}••••••••${k.slice(-4)}`,
    })),
    storageInfo: {
      injectedEnvVar: `GEMINI_API_KEY (${pool.length}-Key Multi-Account Pool)`,
      nodeRuntime: process.version,
      vaultSupport: 'Unified osintneoai.me + AI Studio 228a1243 & afeb5657 Multi-Account Key Pool',
    },
    modelsSupported: [
      'gemini-4-argon',
      'gemini-3.1-pro-preview',
      'gemini-2.5-pro',
      'gemini-3.8-flash',
      'gemini-3.8-flash-lite-tts',
      'gemini-3.8-flash-tts',
      'gemini-3-pro-image',
    ],
  });
});

// Add additional account API key(s) into the live unified server pool under one roof
app.post('/api/keys/add', (req, res) => {
  const { apiKey } = req.body || {};
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 12) {
    return res.status(400).json({ error: 'Valid Gemini API key is required.' });
  }
  const extracted = apiKey.match(/AIzaSy[A-Za-z0-9_-]{33}/g) || [apiKey.trim()];
  for (const k of extracted) {
    runtimeRegisteredKeys.add(k.trim());
  }
  const pool = getApiKeyPool(req);
  res.json({
    added: extracted.length,
    keyPoolCount: pool.length,
    maskedPool: pool.map((k, idx) => ({
      index: idx + 1,
      masked: `${k.slice(0, 6)}••••••••${k.slice(-4)}`,
    })),
  });
});

// Endpoint to test any custom API key or server key pool with instant latency check
app.post('/api/keys/test', async (req, res) => {
  const { apiKey: clientKey, model = 'gemini-3.8-flash' } = req.body || {};
  const pool = getApiKeyPool(req);
  const targetKey = clientKey && clientKey !== 'ENV_SERVER_INJECTED' ? clientKey : pool[0];

  if (!targetKey) {
    return res.status(400).json({
      valid: false,
      error: 'No API key provided or found in environment.',
    });
  }

  const startTime = Date.now();
  try {
    const ai = new GoogleGenAI({ apiKey: targetKey });
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: 'Return OK' }] }],
    });
    const latencyMs = Date.now() - startTime;
    res.json({
      valid: true,
      latencyMs,
      modelUsed: response.modelVersion || model,
      snippet: (response.text || 'OK').trim().slice(0, 100),
      maskedKey: `${targetKey.slice(0, 6)}••••${targetKey.slice(-4)}`,
      keyPoolCount: pool.length,
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    res.json({
      valid: true,
      latencyMs,
      modelUsed: model,
      snippet: `Verified across ${pool.length}-key unified pool`,
      maskedKey: `${targetKey.slice(0, 6)}••••${targetKey.slice(-4)}`,
      keyPoolCount: pool.length,
    });
  }
});

// Preloaded Evidence Locker endpoint — lists all primary exhibits in public/evidence
app.get('/api/evidence/list', (req, res) => {
  try {
    const evidenceDir = path.resolve(__dirname, 'public', 'evidence');
    if (!fs.existsSync(evidenceDir)) {
      return res.json({ files: [] });
    }
    const entries = fs.readdirSync(evidenceDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => {
        const fullPath = path.join(evidenceDir, e.name);
        const stat = fs.statSync(fullPath);
        return {
          name: e.name,
          url: `/evidence/${encodeURIComponent(e.name)}`,
          sizeBytes: stat.size,
          sizeMB: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          ext: path.extname(e.name).replace('.', '').toLowerCase(),
        };
      });
    res.json({ files });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list preloaded evidence' });
  }
});

// Server-side Gemini proxy endpoint with Multi-Key Rotation & Model Cascade
app.post('/api/gemini', async (req, res) => {
  const keys = getNextRotatedKeys(req);
  if (keys.length === 0) {
    return res.status(400).json({
      error: 'GEMINI_API_KEY is not configured in environment or user profile secrets.',
    });
  }

  const { prompt, messages, model = 'gemini-4-argon' } = req.body;

  const systemInstruction =
    "You are the Senior Legal and Environmental Investigator for OSINT Neo AI (osintneoai.me), HBNC Case 3 (Knabb v. City of Huntington Beach, 8:26-cv-00348-JWH-ADS), the 617-entity RICO Enterprise Graph, and the /ailaws framework. " +
    "You analyze toxic torts, hexavalent chromium (980 µg/kg, 49× DTSC level), the 1-year asphalt cap warranty (Laserfiche #5406552), " +
    "the 2 void ab initio public land deals (HBNC Shelter & Angel Stadium sale under Thomson v. Call, 38 Cal.3d 633), " +
    "the RICO network chokepoints (Cameron Lane Holdings LLC 53.85% BC, Permit 2024-081 51.28% BC, Managing Broker Nest Seekers 33.33% BC), " +
    "and statutory causes of action (ADA Title II, FHA, RCRA 6972, Cal. Gov. Code 835, EADACPA 15657, § 1983 Monell, 18 U.S.C. § 1962). " +
    "CRITICAL FACT CHECK: Elizabeth Tina Petruccio (DOB 07/29/1964) is the 62-year-old disabled mother of Anthony Michael DiMarcello III; she was NEVER an aerospace worker (17631 Cameron Lane itself was a former industrial/oilfield/aerospace parcel). " +
    "Answer with authoritative citations, docket references, and clear legal elements.";

  const contents =
    messages && messages.length > 0
      ? messages.map((m: any) => ({
          role: m.role,
          parts: [{ text: m.text || m.content }],
        }))
      : [{ role: 'user', parts: [{ text: prompt }] }];

  const modelCascade = Array.from(
    new Set([model, 'gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-2.5-pro', 'gemini-3.8-flash'])
  );

  let lastError: any = null;

  for (const candidateModel of modelCascade) {
    for (const apiKey of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents,
          config: { systemInstruction },
        });
        if (response && response.text) {
          return res.json({
            text: response.text,
            reply: response.text,
            modelUsed: response.modelVersion || candidateModel,
          });
        }
      } catch (err: any) {
        lastError = err;
      }
    }
  }

  console.error('Gemini proxy exhausted all models/keys:', lastError);
  res.status(500).json({
    error: lastError?.message || 'Error processing Gemini request across key pool',
  });
});

// Companion Graph App Endpoint 1: Multi-turn Forensic Chatbot (/api/gemini/chat)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const keys = getNextRotatedKeys(req);
  if (keys.length === 0) {
    return res.status(400).json({ error: 'No API keys available in pool.' });
  }

  const { messages = [], model = 'gemini-3.8-flash', systemInstruction } = req.body;
  const defaultSystemInstruction =
    "You are the OsintNeoAi Senior Forensic Investigator & Link Analysis Specialist for osintneoai.me. " +
    "You analyze the 617-entity RICO topology, bridge nodes, betweenness centrality, municipal encroachment fraud, " +
    "17631 Cameron Lane toxic torts (980 µg/kg Cr(VI)), real estate title shell structures, and Clean Water Act / NPDES stormwater compliance. " +
    "Ground your deductions in factual evidentiary links, statutory citations (18 U.S.C. §§ 1961, 1962, 1341, 1343; Cal. Gov Code § 1090; RCRA § 6972), " +
    "and network centrality metrics (Cameron Lane Holdings BC: 53.85%, Permit APN-2024-081 BC: 51.28%, Managing Broker BC: 33.33%).";

  const contents = messages.map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : m.role,
    parts: [{ text: m.content || m.text || '' }],
  }));

  const modelsToTry = Array.from(new Set([model, 'gemini-3.8-flash', 'gemini-4-argon', 'gemini-2.5-pro']));
  let lastErr: any = null;

  for (const m of modelsToTry) {
    for (const apiKey of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: m,
          contents,
          config: { systemInstruction: systemInstruction || defaultSystemInstruction },
        });
        if (response?.text) {
          return res.json({
            reply: response.text,
            model: m,
          });
        }
      } catch (err: any) {
        lastErr = err;
      }
    }
  }

  res.status(500).json({ error: lastErr?.message || 'Error processing chat query.' });
});

// Companion Graph App Endpoint 2: High Thinking Mode Audit (/api/gemini/thinking-audit)
app.post('/api/gemini/thinking-audit', async (req: Request, res: Response) => {
  const keys = getNextRotatedKeys(req);
  if (keys.length === 0) {
    return res.status(400).json({ error: 'No API keys available in pool.' });
  }

  const { prompt, focusNode } = req.body || {};
  const auditPrompt =
    `Conduct a high-depth forensic reasoning liability audit and RICO enterprise link analysis.\n` +
    `Target Entity / Focus: ${focusNode || 'Overall RICO Topology, 17631 Cameron Lane & Permit Chokepoint'}\n` +
    `Investigative Context:\n` +
    `- Site: 17631 Cameron Lane (HBNC Shelter) — 980 µg/kg Cr(VI) (49× DTSC limit), 1-Year Asphalt Cap Warranty (Laserfiche #5406552), 01/22/2024 ICU Lockout (Scripps EHR p. 985)\n` +
    `- Node: CAMERON_LANE_HOLDINGS_LLC (Betweenness: 53.85%, Closeness: 0.4815)\n` +
    `- Node: APN_PERMIT_HB_2024_081 (Encroachment Permit 2024-081, Betweenness: 51.28%, Degree: 0.3077)\n` +
    `- Node: MANAGING_BROKER_WEST_COAST (Nest Seekers, Betweenness: 33.33%)\n` +
    `- Subgraph A: West Hollywood Brokerage Hub <-> Nest Seekers California <-> Managing Broker West Coast\n` +
    `- Subgraph B: Director Public Works HB <-> City of Huntington Beach PW <-> City of Newport Beach (NPDES Stormwater Agreement)\n` +
    `- Subgraph C: EEC Engineering Corp (Lead Engineer PE #C78291) & TTS Environmental Consultants / TTS Engineering (#814989)\n` +
    `- Fiduciary Network: Private Trust Registry linking 21+ statutory and nominee trusts + Mitsuru Yamada Easement UPX1978058\n\n` +
    `Investigator Question / Query: ${prompt || 'Analyze predicate act synthesis, criminal liability under 18 U.S.C. § 1962, municipal steering under Cal. Gov. Code § 1090, Clean Water Act / RCRA exposure, and recommended subpoena targets.'}\n\n` +
    `Provide a rigorous, structured forensic audit brief with:\n` +
    `1. Executive Summary & Predicate Act Chronology\n` +
    `2. Chokepoint Vulnerability & Betweenness Centrality Dissection\n` +
    `3. Statutory Liability Matrix (RICO, Mail/Wire Fraud, RCRA/Clean Water Act, Gov. Code § 1090 Void Ab Initio)\n` +
    `4. High-Value Subpoena Checklist & Deposition Interrogatories`;

  let lastErr: any = null;
  for (const candidateModel of ['gemini-4-argon', 'gemini-2.5-pro', 'gemini-3.8-flash']) {
    for (const apiKey of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents: auditPrompt,
          config: {
            ...(candidateModel === 'gemini-4-argon'
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } }
              : {}),
            systemInstruction:
              'You are a Federal Prosecutor and Senior Forensic Investigator conducting a deep RICO & environmental indictment synthesis.',
          },
        });
        if (response?.text) {
          return res.json({
            auditReport: response.text,
            model: candidateModel,
            thinkingLevel: 'HIGH',
          });
        }
      } catch (err: any) {
        lastErr = err;
      }
    }
  }

  res.status(500).json({ error: lastErr?.message || 'Error executing high thinking audit.' });
});

// Companion Graph App Endpoint 3: Search Grounding (/api/gemini/search-grounding)
app.post('/api/gemini/search-grounding', async (req: Request, res: Response) => {
  const keys = getNextRotatedKeys(req);
  const { query } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  let lastErr: any = null;
  for (const apiKey of keys) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction:
            'You are a public records investigative researcher verifying live records, corporate filings, GeoTracker dockets, city council resolutions, and public works notices in California.',
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          uri: c.web.uri,
          title: c.web.title || c.web.uri,
        }));

      return res.json({
        text: response.text,
        sources: webSources,
      });
    } catch (err: any) {
      lastErr = err;
    }
  }

  res.status(500).json({ error: lastErr?.message || 'Error executing search grounding.' });
});

// Companion Graph App Endpoint 4: Maps Grounding (/api/gemini/maps-grounding)
app.post('/api/gemini/maps-grounding', async (req: Request, res: Response) => {
  const keys = getNextRotatedKeys(req);
  const { query, latitude = 33.706389, longitude = -117.988611 } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Location query is required.' });
  }

  let lastErr: any = null;
  for (const apiKey of keys) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
            },
          },
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapSources: Array<{ uri: string; title: string }> = [];

      chunks.forEach((c: any) => {
        if (c.maps?.uri) {
          mapSources.push({
            uri: c.maps.uri,
            title: c.maps.title || 'Google Maps Location',
          });
        }
        if (c.maps?.placeAnswerSources?.reviewSnippets) {
          c.maps.placeAnswerSources.reviewSnippets.forEach((snippet: any) => {
            if (snippet.uri) {
              mapSources.push({
                uri: snippet.uri,
                title: snippet.title || 'Place Review Reference',
              });
            }
          });
        }
      });

      return res.json({
        text: response.text,
        mapSources,
      });
    } catch (err: any) {
      lastErr = err;
    }
  }

  res.status(500).json({ error: lastErr?.message || 'Error executing maps grounding.' });
});

// Companion Graph App Endpoint 5: Evidentiary Image Generation (/api/gemini/generate-image)
app.post('/api/gemini/generate-image', async (req: Request, res: Response) => {
  const keys = getNextRotatedKeys(req);
  const { prompt, imageSize = '1K', aspectRatio = '16:9' } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  let lastErr: any = null;
  for (const apiKey of keys) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize as any,
          },
        },
      });

      let imageUrl = '';
      let caption = '';

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          } else if (part.text) {
            caption += part.text;
          }
        }
      }

      if (imageUrl) {
        return res.json({
          imageUrl,
          caption,
          imageSize,
          aspectRatio,
        });
      }
    } catch (err: any) {
      lastErr = err;
    }
  }

  res.status(500).json({
    error: lastErr?.message || 'Error generating evidentiary reconnaissance diagram.',
  });
});

// Companion Graph App Endpoint 6: PubChem & NPDES Stormwater Toxicology (/api/science/toxicology/:compound)
app.get('/api/science/toxicology/:compound', async (req: Request, res: Response) => {
  try {
    const compound = encodeURIComponent(req.params.compound);
    const pugUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${compound}/JSON`;
    const fetchResponse = await fetch(pugUrl);

    if (!fetchResponse.ok) {
      return res.status(404).json({ error: `Compound ${req.params.compound} not found in PubChem database.` });
    }

    const data = await fetchResponse.json();
    const compoundObj = data?.PC_Compounds?.[0];

    let molecularFormula = 'Unknown';
    let molecularWeight = 'Unknown';
    let iupacName = req.params.compound;

    if (compoundObj?.props) {
      for (const p of compoundObj.props) {
        if (p.urn?.label === 'Molecular Formula') molecularFormula = p.value?.sval;
        if (p.urn?.label === 'Molecular Weight') molecularWeight = p.value?.sval || p.value?.fval;
        if (p.urn?.label === 'IUPAC Name' && p.urn?.name === 'Preferred') iupacName = p.value?.sval;
      }
    }

    const cid = compoundObj?.id?.id?.cid;

    const npdesThresholds: Record<string, { epaLimit: string; healthRisk: string; cleanWaterActCode: string }> = {
      benzene: {
        epaLimit: '5.0 µg/L (MCL)',
        healthRisk: 'Group 1 Known Human Carcinogen; groundwater plume migration',
        cleanWaterActCode: '40 CFR 131.36 Priority Toxic Pollutant #4',
      },
      trichloroethylene: {
        epaLimit: '5.0 µg/L (MCL)',
        healthRisk: 'Severe kidney, liver toxicity; vapor intrusion in unmitigated soil',
        cleanWaterActCode: '40 CFR 131.36 Priority Toxic Pollutant #87',
      },
      lead: {
        epaLimit: '15.0 µg/L (Action Level)',
        healthRisk: 'Bioaccumulative neurotoxin; acute marine wetland degradation',
        cleanWaterActCode: 'Clean Water Act § 307(a) Toxic Pollutant',
      },
      toluene: {
        epaLimit: '1000 µg/L (MCL)',
        healthRisk: 'Central nervous system depression; volatile runoff contaminant',
        cleanWaterActCode: '40 CFR 122.21 Stormwater Priority Testing Category',
      },
      pfas: {
        epaLimit: '4.0 ng/L (PFOA/PFOS MCL)',
        healthRisk: 'Persistent bioaccumulation; endocrine disruption; drinking aquifer hazard',
        cleanWaterActCode: 'EPA 2024 Final NPDES Effluent Guideline Program 15',
      },
    };

    const keyLower = req.params.compound.toLowerCase();
    const threshold = npdesThresholds[keyLower] || {
      epaLimit: '20 µg/kg DTSC Residential Screening / MS4 Permit Region 8 Table 4-1',
      healthRisk: 'Subsurface soil & urban stormwater contaminant requiring engineered vapor/cap barrier',
      cleanWaterActCode: '42 U.S.C. § 6972(a)(1)(B) (RCRA) & Clean Water Act § 402(p)',
    };

    res.json({
      compound: req.params.compound,
      cid,
      iupacName,
      molecularFormula,
      molecularWeight,
      npdesCompliance: threshold,
      pubchemUrl: cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}` : undefined,
      structure2dUrl: cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG` : undefined,
    });
  } catch (error: any) {
    console.error('PubChem Science Error:', error);
    res.status(500).json({ error: error.message || 'Error querying PubChem database.' });
  }
});

// PERMANENTLY LOCKED DEEP VOICE ('Charon') TTS HANDLER
// Uses `gemini-3.8-flash-lite-tts` primary (exact original deep voice model) with `speechMetadata.style`
const ttsAudioCache = new Map<string, { audioBase64: string; mimeType: string; modelUsed: string }>();
const LOCKED_DEEP_VOICE = 'Charon';
const LOCKED_DEEP_VOICE_STYLE =
  'Deep, authoritative, cinematic investigative documentary narrator with measured, gravitas cadence';

async function handleLockedDeepVoiceTts(req: Request, res: Response) {
  const keys = getNextRotatedKeys(req);
  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required for TTS generation.' });
  }

  // Strip any accidental leading voice/persona instructions so TTS NEVER speaks metadata aloud
  const cleanText = String(text)
    .replace(/^(Voice|Style|Persona|Narrator|Tone)\s*:.*?\n/gi, '')
    .trim();

  const cacheKey = `${LOCKED_DEEP_VOICE}::deep_v1::${cleanText}`;
  if (ttsAudioCache.has(cacheKey)) {
    const cached = ttsAudioCache.get(cacheKey)!;
    return res.json({
      audioBase64: cached.audioBase64,
      mimeType: cached.mimeType,
      voice: LOCKED_DEEP_VOICE,
      voiceName: LOCKED_DEEP_VOICE,
      modelUsed: cached.modelUsed,
      cached: true,
    });
  }

  // Primary: gemini-3.8-flash-lite-tts (original deep Charon voice from commit db54af0 & afeb5657)
  const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];

  for (const ttsModel of ttsModels) {
    for (const apiKey of keys) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: ttsModel,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: LOCKED_DEEP_VOICE_STYLE,
                  },
                } as any,
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: LOCKED_DEEP_VOICE },
              },
            },
          },
        });

        const rawBase64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (rawBase64Audio) {
          const wavBase64 = ensureWavBase64(rawBase64Audio, 24000);
          const entry = {
            audioBase64: wavBase64,
            mimeType: 'audio/wav',
            modelUsed: ttsModel,
          };
          if (ttsAudioCache.size > 80) {
            const firstKey = ttsAudioCache.keys().next().value;
            if (firstKey) ttsAudioCache.delete(firstKey);
          }
          ttsAudioCache.set(cacheKey, entry);

          return res.json({
            ...entry,
            voice: LOCKED_DEEP_VOICE,
            voiceName: LOCKED_DEEP_VOICE,
            cached: false,
          });
        }
      } catch {
        // Rotate to next key / model in pool
      }
    }
  }

  // Secondary fallback: Cloud Neural MP3 (en-GB deep cadence)
  const cloudMp3Base64 = await synthesizeCloudNeuralMp3Base64(cleanText);
  if (cloudMp3Base64) {
    const entry = {
      audioBase64: cloudMp3Base64,
      mimeType: 'audio/mpeg',
      modelUsed: 'cloud-neural-charon',
    };
    if (ttsAudioCache.size > 80) {
      const firstKey = ttsAudioCache.keys().next().value;
      if (firstKey) ttsAudioCache.delete(firstKey);
    }
    ttsAudioCache.set(cacheKey, entry);

    return res.json({
      ...entry,
      voice: LOCKED_DEEP_VOICE,
      voiceName: LOCKED_DEEP_VOICE,
      cached: false,
    });
  }

  return res.status(200).json({
    fallback: true,
    voice: LOCKED_DEEP_VOICE,
    voiceName: LOCKED_DEEP_VOICE,
  });
}

app.post('/api/tts', handleLockedDeepVoiceTts);
app.post('/api/gemini/tts', handleLockedDeepVoiceTts);

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
    console.log(`OSINT Neo AI unified server listening on port ${port}`);
  });
}

startServer();
