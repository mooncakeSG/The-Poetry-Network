'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { moodSchema, type MoodInput } from "@/lib/validations/mood";
import { ZodError } from "zod";

export async function createMoodEntry(data: MoodInput) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // Validate input data
    const validatedData = moodSchema.parse(data);

    const moodEntry = await prisma.mood.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        date: new Date(),
      },
    });

    // Check for crisis indicators in notes
    if (validatedData.notes) {
      const isCrisis = await checkForCrisis(validatedData.notes);
      if (isCrisis) {
        await sendCrisisAlert(session.user.id);
      }
    }

    return moodEntry;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    console.error("Error creating mood entry:", error);
    throw new Error("Failed to create mood entry");
  }
}

export async function getMoodHistory(userId: string, limit: number = 30) {
  try {
    const moods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return moods;
  } catch (error) {
    console.error("Error fetching mood history:", error);
    throw new Error("Failed to fetch mood history");
  }
}

async function checkForCrisis(text: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ input: text })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results[0].flagged;
  } catch (error) {
    console.error("Error checking for crisis:", error);
    return false;
  }
}

async function sendCrisisAlert(userId: string) {
  try {
    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // TODO: Implement your notification logic here
    // This could be sending an email, creating a support ticket, etc.
    console.log(`Crisis alert for user ${user.name} (${user.email})`);
  } catch (error) {
    console.error("Error sending crisis alert:", error);
  }
} 