import OpenAI from 'openai';
import { 
  WritingAssistantResponse, 
  AIGeneratedContent, 
  SentimentAnalysisResult,
  ContentCategorization,
  SearchRecommendation,
  AIFeedback,
  PlagiarismCheckResult,
  PoetryAnalysis
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

  // Poetry Analysis
  async analyzePoetry(content: string): Promise<PoetryAnalysis> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a poetry analysis expert. Analyze the following poem for its meter, rhyme scheme, form, and poetic devices. Provide a detailed technical analysis."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return this.processPoetryAnalysis(completion.choices[0].message.content);
  }

  // Helper methods for processing responses
  private processWritingAssistantResponse(response: string): WritingAssistantResponse {
    try {
      // Parse the response into structured feedback
      const lines = response.split('\n').filter(line => line.trim());
      const suggestions: string[] = [];
      const improvements: string[] = [];
      const grammarIssues: { text: string; suggestion: string; type: 'grammar' | 'spelling' | 'style' }[] = [];

      let currentSection: 'suggestions' | 'improvements' | 'grammar' | null = null;

      for (const line of lines) {
        if (line.toLowerCase().includes('suggestion')) {
          currentSection = 'suggestions';
          continue;
        } else if (line.toLowerCase().includes('improvement')) {
          currentSection = 'improvements';
          continue;
        } else if (line.toLowerCase().includes('grammar') || line.toLowerCase().includes('spelling') || line.toLowerCase().includes('style')) {
          currentSection = 'grammar';
          continue;
        }

        if (currentSection === 'suggestions' && line.trim()) {
          suggestions.push(line.trim());
        } else if (currentSection === 'improvements' && line.trim()) {
          improvements.push(line.trim());
        } else if (currentSection === 'grammar' && line.trim()) {
          const match = line.match(/^(.*?)\s*->\s*(.*)$/);
          if (match) {
            const [, text, suggestion] = match;
            const type = line.toLowerCase().includes('spell') ? 'spelling' :
                        line.toLowerCase().includes('style') ? 'style' : 'grammar';
            grammarIssues.push({ text: text.trim(), suggestion: suggestion.trim(), type });
          }
        }
      }

      return {
        suggestions,
        improvements,
        grammarIssues
      };
    } catch (error) {
      console.error('Error processing writing assistant response:', error);
      return {
        suggestions: ['Error processing suggestions'],
        improvements: [],
        grammarIssues: []
      };
    }
  }

  private processPoetryAnalysis(response: string): PoetryAnalysis {
    try {
      const sections = response.split('\n\n');
      const analysis: PoetryAnalysis = {
        meter: {
          pattern: '',
          type: '',
          analysis: ''
        },
        rhymeScheme: {
          pattern: '',
          type: '',
          analysis: ''
        },
        form: {
          type: '',
          characteristics: [],
          adherence: 0
        },
        devices: [],
        technicalScore: 0,
        suggestions: []
      };

      const extractValue = (text: string): string => {
        const parts = text.split(':');
        return parts.length > 1 ? parts.slice(1).join(':').trim() : '';
      };

      const extractListItem = (text: string): string => {
        const parts = text.split('-');
        return parts.length > 1 ? parts.slice(1).join('-').trim() : '';
      };

      for (const section of sections) {
        const lines = section.split('\n').filter(Boolean);

        if (section.toLowerCase().includes('meter')) {
          if (lines.length > 0) analysis.meter.type = extractValue(lines[0]);
          if (lines.length > 1) analysis.meter.pattern = extractValue(lines[1]);
          analysis.meter.analysis = lines.slice(2).join('\n').trim();
        } else if (section.toLowerCase().includes('rhyme scheme')) {
          if (lines.length > 0) analysis.rhymeScheme.type = extractValue(lines[0]);
          if (lines.length > 1) analysis.rhymeScheme.pattern = extractValue(lines[1]);
          analysis.rhymeScheme.analysis = lines.slice(2).join('\n').trim();
        } else if (section.toLowerCase().includes('form')) {
          if (lines.length > 0) analysis.form.type = extractValue(lines[0]);
          analysis.form.characteristics = lines
            .slice(1)
            .filter(line => line.includes('-'))
            .map(line => extractListItem(line))
            .filter(Boolean);

          const adherenceLine = lines.find(l => l.includes('adherence'));
          if (adherenceLine) {
            const adherenceValue = extractValue(adherenceLine);
            const parsed = parseFloat(adherenceValue);
            analysis.form.adherence = isNaN(parsed) ? 0 : parsed;
          }
        } else if (section.toLowerCase().includes('poetic devices')) {
          analysis.devices = lines
            .filter(line => line.includes('-'))
            .map(line => {
              const parts = line.split('-').map(s => s.trim());
              return {
                name: parts[0] || '',
                description: parts.slice(1).join('-').trim() || ''
              };
            });
        } else if (section.toLowerCase().includes('technical score')) {
          const score = extractValue(section);
          const parsed = parseFloat(score);
          analysis.technicalScore = isNaN(parsed) ? 0 : parsed;
        } else if (section.toLowerCase().includes('suggestions')) {
          analysis.suggestions = lines
            .filter(line => line.includes('-'))
            .map(line => extractListItem(line))
            .filter(Boolean);
        }
      }

      return analysis;
    } catch (error) {
      console.error('Error processing poetry analysis:', error);
      return {
        meter: { pattern: '', type: '', analysis: '' },
        rhymeScheme: { pattern: '', type: '', analysis: '' },
        form: { type: '', characteristics: [], adherence: 0 },
        devices: [],
        technicalScore: 0,
        suggestions: ['Error processing analysis']
      };
    }
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