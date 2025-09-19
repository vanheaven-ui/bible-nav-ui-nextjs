import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerAuthSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id } = params;

  const deleted = await prisma.note.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0)
    return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json({ message: "Deleted successfully" });
}
