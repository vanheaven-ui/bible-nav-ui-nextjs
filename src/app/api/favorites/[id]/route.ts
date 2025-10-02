import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// NOTE: Updated to use Promise<> for params to match Next.js 13.4+ dynamic route context.
// This resolves the TypeScript build error for async param resolution.
type Context = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------------
// FIX: Await params inside the handler to access the resolved value.
export async function GET(
  req: NextRequest,
  context: Context // Corrected type for the dynamic route context
) {
  const params = await context.params;
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
    // Check if error is an instance of Error for better type safety
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to fetch favorite: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------------
// FIX: Await params inside the handler to access the resolved value.
export async function DELETE(
  req: NextRequest,
  context: Context // Corrected type
) {
  const params = await context.params;
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
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to delete favorite: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------------
// FIX: Await params inside the handler to access the resolved value.
export async function PATCH(
  req: NextRequest,
  context: Context // Corrected type
) {
  const params = await context.params;
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
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to update favorite: ${errorMessage}` },
      { status: 500 }
    );
  }
}
