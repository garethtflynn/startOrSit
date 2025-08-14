import { hash } from "bcrypt";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { username, password } = await req.json();

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user: {
        username: user.username,
        password: user.password,
      },
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
