
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SkinAnalysisReport } from "../types";

// Note: process.env.API_KEY is pre-configured
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs skin analysis on an uploaded image using gemini-3-pro-preview.
 */
export const analyzeSkinImage = async (base64Image: string, mimeType: string): Promise<SkinAnalysisReport> => {
  const ai = getAIClient();
  const prompt = `Analyze this human face image and provide a non-medical skin quality analysis.
  Detect and evaluate: Acne/Pimples, Dark spots, Dark circles, and Uneven skin tone.
  
  ANALYSIS REQUIREMENTS:
  1. Detect severity (Low/Medium/High) for each aspect.
  2. Provide a short explanation in simple language.
  3. Calculate an overall skin health score (1-10).
  4. Categorize as: Healthy, Normal, Needs Care, or Poor.

  Rules:
  - Do not mention medical treatment.
  - Use simple English.
  - Do not guess age or gender.
  - Provide ONLY a JSON response based on the schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overall_score: { type: Type.NUMBER },
          skin_category: { type: Type.STRING },
          analysis: {
            type: Type.OBJECT,
            properties: {
              acne: {
                type: Type.OBJECT,
                properties: { severity: { type: Type.STRING }, details: { type: Type.STRING } },
                required: ["severity", "details"]
              },
              dark_spots: {
                type: Type.OBJECT,
                properties: { severity: { type: Type.STRING }, details: { type: Type.STRING } },
                required: ["severity", "details"]
              },
              dark_circles: {
                type: Type.OBJECT,
                properties: { severity: { type: Type.STRING }, details: { type: Type.STRING } },
                required: ["severity", "details"]
              },
              skin_tone: {
                type: Type.OBJECT,
                properties: { severity: { type: Type.STRING }, details: { type: Type.STRING } },
                required: ["severity", "details"]
              }
            },
            required: ["acne", "dark_spots", "dark_circles", "skin_tone"]
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          disclaimer: { type: Type.STRING }
        },
        required: ["overall_score", "skin_category", "analysis", "recommendations", "disclaimer"]
      }
    }
  });

  const report = JSON.parse(response.text || "{}") as SkinAnalysisReport;
  report.date = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  return report;
};

/**
 * Chat with Gemini using Thinking mode for complex skincare queries.
 */
export const chatWithThinking = async (message: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      thinkingConfig: { thinkingBudget: 16000 },
      systemInstruction: "You are an expert skin care assistant. Provide helpful, non-medical advice in simple English. Keep responses concise and mobile-friendly."
    }
  });
  return response.text;
};

/**
 * Fast chat response using Gemini 2.5 Flash Lite.
 */
export const chatFast = async (message: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: "You are a helpful skin care assistant. Provide brief, friendly, fast responses."
    }
  });
  return response.text;
};

/**
 * Generates a high-quality skin visual using gemini-3-pro-image-preview.
 */
export const generateSkinVisual = async (prompt: string, aspectRatio: string): Promise<string | null> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key from the dialog.
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    },
  });

  // Iterate through parts to find the image part, as it might not be the first part.
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
  }
  return null;
};
