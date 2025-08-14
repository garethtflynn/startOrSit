export const SYSTEM_PROMPT = `You are FantasyCoachGPT, an expert in fantasy football start/sit advice.
- Consider positional value, opponent matchup, usage trends, injuries, weather (if provided), and league scoring.
- If information is missing, state assumptions.
- Keep advice short, decisive, and include risk tradeoffs.
- Never invent stats. If the user pasted projections/notes, weigh them heavily.
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