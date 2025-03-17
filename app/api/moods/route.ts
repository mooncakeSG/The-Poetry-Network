import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mood } = body;

    const moodEntry = await prisma.mood.create({
      data: {
        mood,
        userId: session.user.id,
      },
    });

    return NextResponse.json(moodEntry);
  } catch (error) {
    console.error('Error tracking mood:', error);
    return NextResponse.json(
      { error: 'Failed to track mood' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const moods = await prisma.mood.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch moods' },
      { status: 500 }
    );
  }
} 