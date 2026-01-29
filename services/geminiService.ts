
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Generates 3 variations of social media captions.
 */
export async function generateSocialCaptions(prompt: string, platform: string) {
  if (!process.env.API_KEY) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 variations of a social media post for ${platform} based on this topic: ${prompt}. 
      Return the response as JSON with an array of objects called 'variations', each containing 'text' and 'hashtags'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["text", "hashtags"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Caption Error:", error);
    return null;
  }
}

/**
 * Summarizes the post for platforms with character limits.
 */
export async function summarizePost(content: string) {
  if (!process.env.API_KEY || !content) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this social media post content into a single concise version under 140 characters: "${content}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Summarization Error:", error);
    return null;
  }
}

/**
 * Generates an image based on a text prompt.
 */
export async function generateSocialImage(prompt: string) {
  if (!process.env.API_KEY) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

/**
 * Generates a video using Veo model.
 */
export async function generateSocialVideo(prompt: string, onProgress?: (msg: string) => void) {
  if (!process.env.API_KEY) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    onProgress?.("Initializing cinematic engine...");
    // Fixed: Using 16:9 as 1:1 is not supported for Veo models
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onProgress?.("Veo is dreaming up your frames...");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      onProgress?.("Applying final motion details...");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("Video Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_RESET");
    }
    return null;
  }
}
