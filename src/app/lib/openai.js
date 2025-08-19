import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPT = `You are FantasyCoachGPT, an expert in fantasy football start/sit advice.
- Give concise recommendations (max 100 words total)
- Focus only on the most important factor for each player
- Be decisive: clearly state START vs SIT
- Skip detailed analysis - just give the key reason
- Never invent stats
`;

export const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    decision: { type: "string", enum: ["START", "SIT", "LEAN_START", "LEAN_SIT"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    summary: { type: "string" },
    factors: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    alt_take: { type: "string" }
  },
  required: ["decision", "confidence", "summary", "factors", "risks"],
  additionalProperties: false
};