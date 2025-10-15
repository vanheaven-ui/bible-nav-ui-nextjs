import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Updated Context type for Next.js 15 async dynamic params
type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: Context) {
  const params = await context.params; // Await to resolve the Promise
  const id = params.id;

  const session = await auth();

  console.log(session);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to fetch note: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const params = await context.params; // Await to resolve the Promise
  const id = params.id;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const deleted = await prisma.note.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to delete note: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: Context) {
  const params = await context.params; // Await to resolve the Promise
  const id = params.id;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const data = await req.json(); // fields to update
    const updated = await prisma.note.updateMany({
      where: { id, userId },
      data,
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Note not found or nothing updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to update note: ${errorMessage}` },
      { status: 500 }
    );
  }
}
