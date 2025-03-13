export interface WritingAssistantResponse {
  suggestions: string[];
  improvements: string[];
  grammarIssues: {
    text: string;
    suggestion: string;
    type: 'grammar' | 'spelling' | 'style';
  }[];
}

export interface AIGeneratedContent {
  content: string;
  metadata: {
    genre: string[];
    themes: string[];
    sentiment: {
      score: number;
      label: 'positive' | 'negative' | 'neutral';
      emotions: string[];
    };
  };
}

export interface SentimentAnalysisResult {
  overallSentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  emotions: {
    name: string;
    score: number;
  }[];
  topics: string[];
}

export interface ContentCategorization {
  genres: string[];
  themes: string[];
  topics: string[];
  confidence: number;
}

export interface SearchRecommendation {
  contentId: string;
  title: string;
  relevance: number;
  reason: string;
}

export interface AIFeedback {
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  technicalAnalysis: {
    structure: string;
    pacing: string;
    imagery: string;
    language: string;
  };
}

export interface PlagiarismCheckResult {
  isOriginal: boolean;
  similarityScore: number;
  matches: {
    source: string;
    similarity: number;
    matchedText: string;
  }[];
} 