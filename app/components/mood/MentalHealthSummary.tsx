interface Mood {
  mood: string;
  date: Date;
}

interface MentalHealthSummaryProps {
  moods: Mood[];
}

export function MentalHealthSummary({ moods }: MentalHealthSummaryProps) {
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDays = moods.length;
  const positiveDays = moodCounts["😊"] || 0;
  const strugglingDays = moodCounts["😢"] || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Mental Health Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl mb-1">😊</div>
          <div className="text-sm text-gray-600">Positive Days</div>
          <div className="text-2xl font-bold">{positiveDays}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-1">😢</div>
          <div className="text-sm text-gray-600">Struggling Days</div>
          <div className="text-2xl font-bold">{strugglingDays}</div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 mb-2">
          {totalDays} days tracked
        </p>
        {strugglingDays > 3 ? (
          <p className="text-red-600 font-medium">
            Consider reaching out for support →
          </p>
        ) : (
          <p className="text-green-600 font-medium">
            You're doing great!
          </p>
        )}
      </div>
    </div>
  );
} 