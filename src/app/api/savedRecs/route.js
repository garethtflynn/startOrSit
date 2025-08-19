import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";

export async function POST(request) {
  try {
    const { players, week, situation, recommendation, userId } =
      await request.json();

    const comparison = await prisma.playerComparison.create({
      data: {
        userId: userId || null, // Allow anonymous comparisons
        week,
        situation,
        recommendation: JSON.stringify(recommendation),
        confidence:
          recommendation.playerRecommendations?.[0]?.confidence || 0.5,
        players: {
          create: players.map((player, index) => ({
            playerName: player.name,
            team: player.team,
            position: player.position,
            projectedPoints: parseFloat(player.projectedPoints) || null,
            averagePoints: parseFloat(player.averagePoints) || null,
            lastWeekPoints: parseFloat(player.lastWeekPoints) || null,
            injuryStatus: player.injuryStatus,
            order: index + 1,
            // Add AI recommendation for this player
            recommendation: recommendation.playerRecommendations?.find(
              (r) => r.playerId === player.id
            )?.action,
            confidence: recommendation.playerRecommendations?.find(
              (r) => r.playerId === player.id
            )?.confidence,
            reasoning: recommendation.playerRecommendations?.find(
              (r) => r.playerId === player.id
            )?.reasoning,
          })),
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json({ success: true, comparisonId: comparison.id });
  } catch (error) {
    console.error("Save comparison error:", error);
    return NextResponse.json(
      { error: "Failed to save comparison" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    const comparisons = await prisma.playerComparison.findMany({
      where: userId ? { userId } : {},
      include: {
        players: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to last 20 comparisons
    });

    return NextResponse.json({ comparisons });
  } catch (error) {
    console.error("Get comparisons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparisons" },
      { status: 500 }
    );
  }
}