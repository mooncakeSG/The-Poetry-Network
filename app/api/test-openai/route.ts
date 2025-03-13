import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "Say hello!" }],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
      status: "success",
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to OpenAI" },
      { status: 500 }
    );
  }
} 