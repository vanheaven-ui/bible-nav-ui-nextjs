import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Define the type for the context object to ensure type safety and compiler compliance
interface RouteContext {
  params: { id: string };
}

// ---------------------------------------------------------------------------------
// FIX: Corrected signature for GET (Next.js expects Request and Context as two args)
export async function GET(req: NextRequest, context: RouteContext) {
  const { params } = context;
  const id = params.id;

  const session = await auth();
  // Use optional chaining with a check for the user's ID
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

// ---------------------------------------------------------------------------------
// FIX: Corrected signature for DELETE
export async function DELETE(req: NextRequest, context: RouteContext) {
  const { params } = context;
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

// ---------------------------------------------------------------------------------
// FIX: Corrected signature for PATCH
export async function PATCH(req: NextRequest, context: RouteContext) {
  const { params } = context;
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
