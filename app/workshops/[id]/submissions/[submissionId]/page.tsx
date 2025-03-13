import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

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

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function SubmissionPage({ params }: { params: { id: string; submissionId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopRes, submissionRes, commentsRes] = await Promise.all([
          fetch(`/api/workshops/${params.id}`),
          fetch(`/api/workshops/${params.id}/submissions/${params.submissionId}`),
          fetch(`/api/workshops/${params.id}/submissions/${params.submissionId}/comments`),
        ]);

        if (!workshopRes.ok || !submissionRes.ok || !commentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [workshopData, submissionData, commentsData] = await Promise.all([
          workshopRes.json(),
          submissionRes.json(),
          commentsRes.json(),
        ]);

        setWorkshop(workshopData);
        setSubmission(submissionData);
        setComments(commentsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load submission details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, params.submissionId, toast]);

  const handleAddComment = async () => {
    try {
      const response = await fetch(`/api/workshops/${params.id}/submissions/${params.submissionId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const comment = await response.json();
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workshop || !submission) {
    return <div>Submission not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Submission in {workshop.title}</h1>
      <Card className="p-6 mb-6">
        <div className="prose max-w-none">
          {submission.content}
        </div>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map(comment => (
          <Card key={comment.id} className="p-4">
            <div className="prose max-w-none">
              {comment.content}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px] mb-4"
        />
        <Button onClick={handleAddComment}>Add Comment</Button>
      </div>
    </div>
  );
} 