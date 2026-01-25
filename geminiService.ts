
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Servicio experto de Pico & Amor.
 * Resuelve dudas de cuidados y recomienda productos del catálogo de forma robusta.
 */
export async function getToyRecommendation(userInput: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ 
        parts: [{ 
          text: `Pregunta del usuario: "${userInput}". Responde como experto en agapornis.` 
        }] 
      }],
      config: {
        systemInstruction: `Eres "Pico Bot", experto de la tienda Pico & Amor. 
        Tu misión: Asesorar sobre cuidados de agapornis y recomendar productos.

        CONOCIMIENTOS CLAVE:
        - Alimentación: Semillas, pienso, frutas y verduras. Prohibido aguacate.
        - Salud: Consultar veterinarios de exóticos. Signos: embolamiento, apatía.
        - Materiales: Solo madera natural y fibras vegetales.

        PRODUCTOS DISPONIBLES:
        - p1: Pack Aventura (aves activas)
        - p6: Pack Relax (aves miedosas)
        - p14: Pack Natura (naturalidad y descanso)
        - p11: Columpio Esencia (rústico)
        - p12: Caja de Forrajeo (estimulación mental)
        - p13: Buscador de Semillas (instinto natural)

        REGLAS DE ORO:
        - Si preguntan por cuidados, sé educativo y breve.
        - Si mencionan aburrimiento, recomienda p12 o p13.
        - Devuelve SIEMPRE un objeto JSON con "text" y "recommendedProductId".`,
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { 
              type: Type.STRING,
              description: "Respuesta educativa o recomendación."
            },
            recommendedProductId: { 
              type: Type.STRING, 
              description: "ID del producto (p1, p6, p11, p12, p13, p14) o null."
            }
          },
          required: ["text", "recommendedProductId"]
        }
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Respuesta vacía de la IA");
    
    const cleanedJson = rawText.trim().replace(/```json|```/g, "");
    return JSON.parse(cleanedJson);
    
  } catch (error) {
    console.error("PicoBot Critical Error:", error);
    return {
      text: "¡Pío! Mis alitas se han enredado un poco. ¿Me podrías repetir la pregunta sobre tu agapornis?",
      recommendedProductId: null
    };
  }
}
