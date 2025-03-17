import Link from "next/link";
import { Poem, User } from "@prisma/client";

type PoemWithAuthor = Poem & {
  author: {
    name: string | null;
    image: string | null;
  };
};

interface PoemCardProps {
  poem: PoemWithAuthor;
}

export function PoemCard({ poem }: PoemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{poem.title}</h3>
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap line-clamp-3">{poem.content}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {poem.author.image && (
            <img
              src={poem.author.image}
              alt={poem.author.name || 'Author'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-gray-600">
            {poem.author.name || 'Anonymous'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {poem.mood && (
            <span className="text-sm text-gray-500">
              Mood: {poem.mood}
            </span>
          )}
          <Link
            href={`/poems/${poem.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
} 