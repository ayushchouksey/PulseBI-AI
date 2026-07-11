import { callOllama, callOllamaJSON, checkOllamaHealth } from "./ollama/ollamaProvider.js";
import { callGroq, callGroqJSON, checkGroqHealth } from "./groq/groqProvider.js";

export type LLMProvider = "ollama" | "groq";

function getProvider(): LLMProvider {
  return (process.env.LLM_PROVIDER as LLMProvider) || "ollama";
}

export async function callLLM(prompt: string): Promise<string> {
  return getProvider() === "groq"
    ? callGroq(prompt)
    : callOllama(prompt);
}

export async function callLLMJSON<T>(prompt: string): Promise<T> {
  return getProvider() === "groq"
    ? callGroqJSON<T>(prompt)
    : callOllamaJSON<T>(prompt);
}

export async function checkLLMHealth(): Promise<boolean> {
  return getProvider() === "groq"
    ? checkGroqHealth()
    : checkOllamaHealth();
}
