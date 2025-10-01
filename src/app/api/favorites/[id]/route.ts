import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id } = params;

  const deleted = await prisma.favorite.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
