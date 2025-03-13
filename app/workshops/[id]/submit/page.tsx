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

export default function SubmitPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await fetch(`/api/workshops/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch workshop');
        const data = await response.json();
        setWorkshop(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workshop details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [params.id, toast]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/workshops/${params.id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      toast({
        title: 'Success',
        description: 'Your submission has been received',
      });

      router.push(`/workshops/${params.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your work',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workshop) {
    return <div>Workshop not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Submit to {workshop.title}</h1>
      <Card className="p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your submission..."
          className="min-h-[200px] mb-4"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
} 