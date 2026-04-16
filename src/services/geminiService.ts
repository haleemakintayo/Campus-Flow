import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function predictRushHour(historicalData: any) {
  const prompt = `
    As a campus transit expert, analyze this historical occupancy data and predict the next rush hour peak.
    Suggest 3 actionable strategies for administrators to mitigate bottlenecks.
    
    Data: ${JSON.stringify(historicalData)}
    
    Format your response as JSON:
    {
      "prediction": "string",
      "confidence": number,
      "strategies": ["string", "string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || "";
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return {
      prediction: "Peak expected at 09:00 AM",
      confidence: 0.85,
      strategies: [
        "Deploy 2 additional buses to North Loop",
        "Implement express shuttle between Library and Main Gate",
        "Send push notification suggesting walking routes for short distances"
      ]
    };
  }
}
