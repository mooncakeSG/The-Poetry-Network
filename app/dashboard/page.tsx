import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { PoemCard } from "@/components/poetry/PoemCard";
import { MoodChart } from "@/components/mood/MoodChart";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Link 
          href="/auth/signin"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const [poems, moods] = await Promise.all([
    prisma.poem.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.mood.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
      take: 30,
    }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user.name || 'Poet'}
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Recent Poems</h2>
          <div className="space-y-4">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
          <Link 
            href="/poems/new"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Poem
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Mood History</h2>
          <MoodChart data={moods} />
          <Link 
            href="/moods"
            className="inline-block mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            View Full History
          </Link>
        </div>
      </div>
    </div>
  );
} 