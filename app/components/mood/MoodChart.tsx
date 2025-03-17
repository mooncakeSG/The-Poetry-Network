'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const moodValues = {
  "Happy": 3,
  "Peaceful": 2,
  "Neutral": 1,
  "Sad": 0,
  "Angry": -1
};

interface MoodData {
  id: string;
  mood: string;
  date: Date;
  createdAt: Date;
}

interface MoodChartProps {
  data: MoodData[];
}

export function MoodChart({ data }: MoodChartProps) {
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    mood: moodValues[entry.mood as keyof typeof moodValues] || 1
  }));

  return (
    <div className="h-64 bg-white rounded-lg shadow-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            hide 
            domain={[-1, 3]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => {
              const mood = Object.entries(moodValues).find(([_, v]) => v === value);
              return mood ? mood[0] : 'Unknown';
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 