import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Workshop {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
}

interface AnalyticsData {
  totalSubmissions: number;
  totalComments: number;
  activeMembers: number;
  submissionsByDay: Array<{
    date: string;
    count: number;
  }>;
  commentsByDay: Array<{
    date: string;
    count: number;
  }>;
  memberActivity: Array<{
    userId: string;
    name: string;
    submissions: number;
    comments: number;
  }>;
}

type TimeRange = '7d' | '30d' | '90d';

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopRes, analyticsRes] = await Promise.all([
          fetch(`/api/workshops/${params.id}`),
          fetch(`/api/workshops/${params.id}/analytics?timeRange=${timeRange}`),
        ]);

        if (!workshopRes.ok || !analyticsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [workshopData, analyticsData] = await Promise.all([
          workshopRes.json(),
          analyticsRes.json(),
        ]);

        setWorkshop(workshopData);
        setData(analyticsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, timeRange, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workshop || !data) {
    return <div>Workshop not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics for {workshop.title}</h1>
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Submissions</h3>
          <p className="text-3xl font-bold">{data.totalSubmissions}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Comments</h3>
          <p className="text-3xl font-bold">{data.totalComments}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Members</h3>
          <p className="text-3xl font-bold">{data.activeMembers}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Submissions Over Time</h3>
          <div className="h-[300px]">
            {/* Add chart component here */}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Comments Over Time</h3>
          <div className="h-[300px]">
            {/* Add chart component here */}
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Member Activity</h3>
        <div className="space-y-4">
          {data.memberActivity.map(member => (
            <div key={member.userId} className="flex items-center justify-between p-2 border rounded">
              <div className="font-medium">{member.name}</div>
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-gray-500">Submissions: </span>
                  {member.submissions}
                </div>
                <div>
                  <span className="text-sm text-gray-500">Comments: </span>
                  {member.comments}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 