import OpenAI from 'openai';
import { 
  WritingAssistantResponse, 
  AIGeneratedContent, 
  SentimentAnalysisResult,
  ContentCategorization,
  SearchRecommendation,
  AIFeedback,
  PlagiarismCheckResult
} from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  // Writing Assistant
  async getWritingSuggestions(content: string): Promise<WritingAssistantResponse> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional writing assistant. Analyze the following content and provide suggestions for improvement, including grammar, style, and content enhancements."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Process and structure the response
    const response = completion.choices[0].message.content;
    return this.processWritingAssistantResponse(response);
  }

  // AI Content Generation
  async generateContent(prompt: string, type: 'poem' | 'story'): Promise<AIGeneratedContent> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative writing AI. Generate a ${type} based on the following prompt.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content;
    return this.processGeneratedContent(content, type);
  }

  // Sentiment Analysis
  async analyzeSentiment(content: string): Promise<SentimentAnalysisResult> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment and emotional content of the following text. Provide a detailed analysis including overall sentiment, emotions detected, and main topics."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return this.processSentimentAnalysis(completion.choices[0].message.content);
  }

  // Content Categorization
  async categorizeContent(content: string): Promise<ContentCategorization> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze and categorize the following content by genre, themes, and topics. Provide confidence scores for each categorization."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return this.processContentCategorization(completion.choices[0].message.content);
  }

  // Search Recommendations
  async getPersonalizedRecommendations(
    userId: string,
    userInterests: string[],
    recentActivity: string[]
  ): Promise<SearchRecommendation[]> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Based on the user's interests and recent activity, generate personalized content recommendations."
        },
        {
          role: "user",
          content: JSON.stringify({ userInterests, recentActivity })
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return this.processSearchRecommendations(completion.choices[0].message.content);
  }

  // AI Feedback
  async provideFeedback(content: string): Promise<AIFeedback> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Provide constructive feedback on the following content, including strengths, areas for improvement, and specific suggestions."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return this.processAIFeedback(completion.choices[0].message.content);
  }

  // Plagiarism Detection
  async checkPlagiarism(content: string): Promise<PlagiarismCheckResult> {
    // Note: This is a simplified version. In production, you would want to use
    // a dedicated plagiarism detection service or API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze the following content for potential plagiarism and provide a detailed report."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return this.processPlagiarismCheck(completion.choices[0].message.content);
  }

  // Helper methods for processing responses
  private processWritingAssistantResponse(response: string): WritingAssistantResponse {
    // Implementation for processing the response
    return {
      suggestions: [],
      improvements: [],
      grammarIssues: []
    };
  }

  private processGeneratedContent(content: string, type: 'poem' | 'story'): AIGeneratedContent {
    // Implementation for processing the generated content
    return {
      content,
      metadata: {
        genre: [],
        themes: [],
        sentiment: {
          score: 0,
          label: 'neutral',
          emotions: []
        }
      }
    };
  }

  private processSentimentAnalysis(response: string): SentimentAnalysisResult {
    // Implementation for processing sentiment analysis
    return {
      overallSentiment: {
        score: 0,
        label: 'neutral'
      },
      emotions: [],
      topics: []
    };
  }

  private processContentCategorization(response: string): ContentCategorization {
    // Implementation for processing content categorization
    return {
      genres: [],
      themes: [],
      topics: [],
      confidence: 0
    };
  }

  private processSearchRecommendations(response: string): SearchRecommendation[] {
    // Implementation for processing search recommendations
    return [];
  }

  private processAIFeedback(response: string): AIFeedback {
    // Implementation for processing AI feedback
    return {
      strengths: [],
      areasForImprovement: [],
      suggestions: [],
      technicalAnalysis: {
        structure: '',
        pacing: '',
        imagery: '',
        language: ''
      }
    };
  }

  private processPlagiarismCheck(response: string): PlagiarismCheckResult {
    // Implementation for processing plagiarism check
    return {
      isOriginal: true,
      similarityScore: 0,
      matches: []
    };
  }
} 