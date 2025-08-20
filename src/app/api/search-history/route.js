import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/db";

export async function POST(req) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { players, week, year, recommendation } = body


    if (!Array.isArray(players) || players.some(p => typeof p.name !== "string")) {
      return NextResponse.json(
        { error: "Players must be an array of objects with string names" },
        { status: 400 }
      )
    }

    if (typeof week !== "number" || week < 1 || week > 18) {
      return NextResponse.json({ error: "Week must be between 1–18" }, { status: 400 })
    }

    if (typeof year !== "number" || year < 2000) {
      return NextResponse.json({ error: "Year must be valid" }, { status: 400 })
    }

    if (typeof recommendation !== "string" || recommendation.trim().length === 0) {
      return NextResponse.json({ error: "Recommendation must be a non-empty string" }, { status: 400 })
    }

    const entry = await prisma.searchHistory.create({
      data: {
        userId: session.user.id,
        players,
        week,
        year,
        recommendation,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error("POST /search-history error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}


export async function GET(req) {
  try {
    const session = await auth(); // get logged-in user
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const searchHistory = await prisma.searchHistory.findMany({
      where: {
        userId: session.user.id, 
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(searchHistory);
  } catch (error) {
    console.error("Search history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get("id");

    if (!searchId) {
      return NextResponse.json(
        { error: "Search ID required" },
        { status: 400 }
      );
    }

    await prisma.searchHistory.delete({
      where: {
        id: searchId,
        user: {
          email: session.user.email,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete search history error:", error);
    return NextResponse.json(
      { error: "Failed to delete search" },
      { status: 500 }
    );
  }
}
