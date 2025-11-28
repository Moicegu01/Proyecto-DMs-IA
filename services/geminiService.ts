import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message } from '../types';

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("La variable de entorno API_KEY no está configurada");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export function startChatSession(modelName: string, systemInstruction: string, history: Message[]): Chat {
  const generativeAi = getAiClient();
  
  // Transformamos el historial almacenado al formato estricto que espera el SDK de Gemini
  // Esto asegura que la "memoria" del modelo (contexto) sea perfecta.
  const sdkHistory: Content[] = history.map(msg => ({
    role: msg.role,
    parts: msg.parts.map(p => ({ text: p.text }))
  }));

  return generativeAi.chats.create({
    model: modelName,
    config: {
      systemInstruction,
    },
    history: sdkHistory,
  });
}