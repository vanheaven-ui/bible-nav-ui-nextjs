import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

interface RegisterRequestBody {
  username?: string;
  email?: string;
  password?: string;
}

interface RegisterResponse {
  user: {
    id: string;
    username: string | null;
    email: string | null;
  };
}

export async function POST(req: Request) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { username, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const response: RegisterResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
