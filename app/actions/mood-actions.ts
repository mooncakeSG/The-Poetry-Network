'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface MoodEntry {
  mood: string;
  notes: string;
  intensity: string;
}

export async function createMoodEntry(data: MoodEntry) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const moodEntry = await prisma.mood.create({
      data: {
        mood: data.mood,
        notes: data.notes,
        intensity: data.intensity,
        userId: session.user.id,
        date: new Date(),
      },
    });

    // Check for crisis indicators in notes
    if (data.notes) {
      const isCrisis = await checkForCrisis(data.notes);
      if (isCrisis) {
        await sendCrisisAlert(session.user.id);
      }
    }

    return moodEntry;
  } catch (error) {
    console.error("Error creating mood entry:", error);
    throw new Error("Failed to create mood entry");
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

    const data = await response.json();
    return data.results[0].flagged;
  } catch (error) {
    console.error("Error checking for crisis:", error);
    return false;
  }
}

async function sendCrisisAlert(userId: string) {
  // Implement your notification logic here
  // This could be sending an email, creating a support ticket, etc.
  console.log(`Crisis alert for user ${userId}`);
} 