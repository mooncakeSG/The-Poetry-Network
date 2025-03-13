import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Workshop {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
}

interface Submission {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

type SortOption = 'newest' | 'oldest' | 'most_comments';

export default function SubmissionsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopRes, submissionsRes] = await Promise.all([
          fetch(`/api/workshops/${params.id}`),
          fetch(`/api/workshops/${params.id}/submissions?page=${page}&sort=${sortBy}&search=${searchQuery}`),
        ]);

        if (!workshopRes.ok || !submissionsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [workshopData, submissionsData] = await Promise.all([
          workshopRes.json(),
          submissionsRes.json(),
        ]);

        setWorkshop(workshopData);
        setSubmissions(prev =>
          page === 1 ? submissionsData.submissions : [...prev, ...submissionsData.submissions]
        );
        setHasMore(submissionsData.hasMore);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load submissions',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, page, sortBy, searchQuery, toast]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  if (!workshop) {
    return <div>Workshop not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Submissions in {workshop.title}</h1>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most_comments">Most Comments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {submissions.map(submission => (
          <Card key={submission.id} className="p-6">
            <div className="prose max-w-none">
              {submission.content}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(submission.createdAt).toLocaleDateString()}
            </div>
            <Button
              variant="link"
              onClick={() => router.push(`/workshops/${params.id}/submissions/${submission.id}`)}
              className="mt-2"
            >
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {hasMore && (
        <Button
          onClick={handleLoadMore}
          className="mt-6"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
} 