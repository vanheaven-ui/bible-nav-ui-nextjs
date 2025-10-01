// src/app/api/favorites/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// -------------------------------------------------------------
// DELETE /api/favorites/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const deleted = await prisma.favorite.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// GET /api/favorites/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const favorite = await prisma.favorite.findFirst({
      where: { id, userId },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch favorite" },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// PATCH /api/favorites/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const data = await req.json(); // fields to update
    const updated = await prisma.favorite.updateMany({
      where: { id, userId },
      data,
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Favorite not found or nothing updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update favorite" },
      { status: 500 }
    );
  }
}
