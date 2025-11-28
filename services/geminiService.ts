import { GoogleGenAI, Chat } from "@google/genai";
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
  return generativeAi.chats.create({
    model: modelName,
    config: {
      systemInstruction,
    },
    history,
  });
}