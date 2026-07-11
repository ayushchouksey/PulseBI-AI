import { logger } from "../../utils/logger.js";

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  temperature?: number;
  timeout?: number;
}

const DEFAULT_CONFIG: OllamaConfig = {
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3.2",
  temperature: 0.3,
  timeout: 60000,
};

export async function callOllama(prompt: string, config?: Partial<OllamaConfig>): Promise<string> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  try {
    const response = await fetch(`${cfg.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: cfg.model,
        prompt,
        stream: false,
        options: {
          temperature: cfg.temperature,
          top_p: 0.9,
        },
      }),
      signal: AbortSignal.timeout(cfg.timeout!),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data.response || "";
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error({ err: msg }, "Ollama call failed");
    throw new Error(`Ollama unavailable: ${msg}`);
  }
}

export async function callOllamaJSON<T>(prompt: string, config?: Partial<OllamaConfig>): Promise<T> {
  const response = await callOllama(prompt, config);

  // Try multiple extraction strategies
  const strategies: (() => T | null)[] = [
    // 1. ```json ... ``` block
    () => {
      const m = response.match(/```json\s*([\s\S]*?)\s*```/);
      return m ? JSON.parse(m[1]) as T : null;
    },
    // 2. Bare { ... } block (greedy but bounded)
    () => {
      const start = response.indexOf("{");
      const end = response.lastIndexOf("}");
      if (start === -1 || end === -1 || end <= start) return null;
      return JSON.parse(response.slice(start, end + 1)) as T;
    },
    // 3. Bare [ ... ] block
    () => {
      const start = response.indexOf("[");
      const end = response.lastIndexOf("]");
      if (start === -1 || end === -1 || end <= start) return null;
      return JSON.parse(response.slice(start, end + 1)) as T;
    },
    // 4. Try the entire response as-is
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

  logger.warn({ responseLength: response.length, preview: response.slice(0, 200) }, "Failed to extract JSON from Ollama response");
  throw new Error("No JSON found in Ollama response");
}

export async function checkOllamaHealth(baseUrl?: string): Promise<boolean> {
  try {
    const url = baseUrl || DEFAULT_CONFIG.baseUrl;
    const response = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });
    return response.ok;
  } catch {
    return false;
  }
}
