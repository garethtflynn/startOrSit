import { NextResponse } from "next/server";
import { openai, SYSTEM_PROMPT } from "@/app/lib/openai.js";

export async function POST(request) {
  try {
    const { players, week, year } = await request.json();

    if (!players || !Array.isArray(players) || players.length < 2) {
      return NextResponse.json(
        { error: "At least 2 players required" },
        { status: 400 }
      );
    }

    const playersInfo = players
      .map(
        (p, i) => `
Player ${i + 1}: ${p.name}
- Position: ${p.position}
- Team: ${p.team}
`
      )
      .join("\n");

    const userPrompt = `
Week ${week} this season, ${year}, start/sit decision:

${playersInfo}

Give me ONE paragraph (max 100 words) with:
1. Who to START and why (1-2 key reasons)
2. Who to SIT and why (1 key reason)

Be decisive and concise.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Updated to a better model
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userPrompt
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("No response from OpenAI");
      }

      // Return the recommendation in a simple format
      const recommendation = {
        recommendation: aiResponse,
        players: players,
        week: week,
        year: year,
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(recommendation);

    } catch (aiError) {
      console.error("OpenAI API error:", aiError);

      // Return fallback recommendation
      const fallbackRecommendation = {
        recommendation: `AI analysis is temporarily unavailable for Week ${week}. Here's a basic comparison of your players:\n\n${players.map((p, i) => `${i + 1}. ${p.name} (${p.position}, ${p.team})`).join('\n')}\n\nConsider recent performance, matchup difficulty, and injury reports when making your decision.`,
        players: players,
        week: week,
        year: year,
        timestamp: new Date().toISOString(),
        fallback: true
      };

      return NextResponse.json(fallbackRecommendation);
    }
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}