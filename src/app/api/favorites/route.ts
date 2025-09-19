import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth"; 

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id; 

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ verses: favorites });
}

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { book, chapter, verseNumber, verseText } = body;

  if (!book || !chapter || !verseNumber || !verseText) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const favorite = await prisma.favorite.create({
    data: { userId, book, chapter, verseNumber, verseText },
  });

  return NextResponse.json(favorite, { status: 201 });
}
