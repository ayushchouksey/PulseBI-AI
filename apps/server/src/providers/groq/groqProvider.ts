import { logger } from "../../utils/logger.js";

export interface GroqConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  timeout?: number;
}

const DEFAULT_CONFIG: GroqConfig = {
  apiKey: process.env.GROQ_API_KEY || "",
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  temperature: 0.3,
  timeout: 30000,
};

export async function callGroq(prompt: string, config?: Partial<GroqConfig>): Promise<string> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (!cfg.apiKey) {
    throw new Error("Groq API key not configured (set GROQ_API_KEY)");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: "user", content: prompt }],
        temperature: cfg.temperature,
        top_p: 0.9,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(cfg.timeout!),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Groq error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ err: msg }, "Groq call failed");
    throw new Error(`Groq unavailable: ${msg}`);
  }
}

export async function callGroqJSON<T>(prompt: string, config?: Partial<GroqConfig>): Promise<T> {
  const response = await callGroq(prompt, config);

  const strategies: (() => T | null)[] = [
    () => {
      const m = response.match(/```json\s*([\s\S]*?)\s*```/);
      return m ? JSON.parse(m[1]) as T : null;
    },
    () => {
      const start = response.indexOf("{");
      const end = response.lastIndexOf("}");
      if (start === -1 || end === -1 || end <= start) return null;
      return JSON.parse(response.slice(start, end + 1)) as T;
    },
    () => {
      const start = response.indexOf("[");
      const end = response.lastIndexOf("]");
      if (start === -1 || end === -1 || end <= start) return null;
      return JSON.parse(response.slice(start, end + 1)) as T;
    },
    () => JSON.parse(response) as T,
  ];

  for (const strategy of strategies) {
    try {
      const result = strategy();
      if (result !== null) return result;
    } catch {
      continue;
    }
  }

  logger.warn({ responseLength: response.length, preview: response.slice(0, 200) }, "Failed to extract JSON from Groq response");
  throw new Error("No JSON found in Groq response");
}

export async function checkGroqHealth(): Promise<boolean> {
  if (!DEFAULT_CONFIG.apiKey) return false;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${DEFAULT_CONFIG.apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
