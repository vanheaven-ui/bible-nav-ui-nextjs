import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// -------------------------------------------------------------
// GET: Fetch notes with optional filters
// -------------------------------------------------------------
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { searchParams } = new URL(req.url);

    const book = searchParams.get("book") ?? undefined;
    const chapter = searchParams.get("chapter")
      ? Number(searchParams.get("chapter"))
      : undefined;
    const verse = searchParams.get("verse")
      ? Number(searchParams.get("verse"))
      : undefined;

    const notes = await prisma.note.findMany({
      where: {
        userId,
        ...(book ? { book } : {}),
        ...(chapter ? { chapter } : {}),
        ...(verse ? { verse } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error("GET /notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// POST: Create a new note
// -------------------------------------------------------------
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await req.json();
    const { book, chapter, verse, content } = body;

    if (!book || !chapter || !verse || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        userId,
        book,
        chapter: Number(chapter),
        verse: Number(verse),
        content, // Prisma can handle JSON if field is set as `Json`
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
