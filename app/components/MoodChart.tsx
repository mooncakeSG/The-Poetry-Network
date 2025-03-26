import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic import of the chart component
const Chart = dynamic(() => import('./charts/MoodChartImpl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-white rounded-lg shadow p-4">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

interface MoodChartProps {
  data: Array<{
    date: string;
    mood: number;
    note?: string;
  }>;
}

export function MoodChart({ data }: MoodChartProps) {
  return (
    <div className="w-full">
      <Chart data={data} />
    </div>
  );
} 