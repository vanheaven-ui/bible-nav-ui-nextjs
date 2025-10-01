import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAPIKey = process.env.GEMINI_API_KEY;

if (!geminiAPIKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(geminiAPIKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_INSTRUCTION =
  "You are a helpful and knowledgeable Bible expert. Your purpose is to answer user questions about the Bible concisely and accurately. Use your deep understanding of biblical texts, characters, and theological concepts to provide helpful and insightful responses. Please format your responses clearly using markdown.";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing prompt." },
        { status: 400 }
      );
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
    });

    const response = result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate a response." },
      { status: 500 }
    );
  }
}
