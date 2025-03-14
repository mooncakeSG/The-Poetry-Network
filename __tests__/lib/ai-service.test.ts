import { AIService } from "@/lib/ai/ai-service"
import { OpenAI } from 'openai'
import { generatePoemSuggestion } from '@/lib/ai/ai-service'

// Mock OpenAI
const mockCreate = jest.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content: 'Test poem suggestion',
      },
    },
  ],
})

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}))

describe("AI Service", () => {
  let aiService: AIService

  beforeEach(() => {
    aiService = new AIService()
    jest.clearAllMocks()
  })

  describe("getWritingSuggestions", () => {
    it("provides writing suggestions for content", async () => {
      const mockContent = "This is a draft poem about nature."
      const suggestions = await aiService.getWritingSuggestions(mockContent)
      
      expect(suggestions).toHaveProperty("suggestions")
      expect(suggestions).toHaveProperty("improvements")
      expect(suggestions).toHaveProperty("grammarIssues")
    })
  })

  describe("generateContent", () => {
    it("generates a poem based on prompt", async () => {
      const mockPrompt = "Write a poem about spring"
      const content = await aiService.generateContent(mockPrompt, "poem")
      
      expect(content).toHaveProperty("title")
      expect(content).toHaveProperty("content")
      expect(content).toHaveProperty("metadata")
    })

    it("generates a story based on prompt", async () => {
      const mockPrompt = "Write a story about adventure"
      const content = await aiService.generateContent(mockPrompt, "story")
      
      expect(content).toHaveProperty("title")
      expect(content).toHaveProperty("content")
      expect(content).toHaveProperty("metadata")
    })
  })

  describe("analyzeSentiment", () => {
    it("analyzes sentiment of content", async () => {
      const mockContent = "The sun shines brightly, bringing joy to all."
      const sentiment = await aiService.analyzeSentiment(mockContent)
      
      expect(sentiment).toHaveProperty("sentiment")
      expect(sentiment).toHaveProperty("confidence")
      expect(sentiment).toHaveProperty("keywords")
    })
  })

  describe("categorizeContent", () => {
    it("categorizes content by theme and style", async () => {
      const mockContent = "Roses are red, violets are blue"
      const categorization = await aiService.categorizeContent(mockContent)
      
      expect(categorization).toHaveProperty("themes")
      expect(categorization).toHaveProperty("style")
      expect(categorization).toHaveProperty("genre")
    })
  })

  describe("getPersonalizedRecommendations", () => {
    it("provides personalized recommendations based on user interests", async () => {
      const mockUserId = "user123"
      const mockInterests = ["nature", "love"]
      const mockRecentActivity = ["read poem about spring", "liked love poem"]
      const recommendations = await aiService.getPersonalizedRecommendations(
        mockUserId,
        mockInterests,
        mockRecentActivity
      )
      
      expect(Array.isArray(recommendations)).toBe(true)
      expect(recommendations[0]).toHaveProperty("type")
      expect(recommendations[0]).toHaveProperty("content")
    })
  })

  describe("provideFeedback", () => {
    it("provides AI feedback on content", async () => {
      const mockContent = "A poem about the changing seasons"
      const feedback = await aiService.provideFeedback(mockContent)
      
      expect(feedback).toHaveProperty("strengths")
      expect(feedback).toHaveProperty("weaknesses")
      expect(feedback).toHaveProperty("suggestions")
    })
  })

  describe("checkPlagiarism", () => {
    it("checks content for potential plagiarism", async () => {
      const mockContent = "Original poetry content for testing"
      const result = await aiService.checkPlagiarism(mockContent)
      
      expect(result).toHaveProperty("isPlagiarized")
      expect(result).toHaveProperty("similarityScore")
      expect(result).toHaveProperty("matches")
    })
  })

  describe("analyzePoetry", () => {
    it("analyzes poetry structure and devices", async () => {
      const mockPoem = "Roses are red\nViolets are blue\nSugar is sweet\nAnd so are you"
      const analysis = await aiService.analyzePoetry(mockPoem)
      
      expect(analysis).toHaveProperty("meter")
      expect(analysis).toHaveProperty("rhymeScheme")
      expect(analysis).toHaveProperty("poeticDevices")
    })
  })

  it('generates a poem suggestion', async () => {
    const prompt = 'Write a poem about nature'
    const suggestion = await generatePoemSuggestion(prompt)

    expect(suggestion).toBe('Test poem suggestion')
    expect(OpenAI).toHaveBeenCalledWith({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  })

  it('handles errors gracefully', async () => {
    // Mock OpenAI error
    mockCreate.mockRejectedValueOnce(new Error('API Error'))

    await expect(generatePoemSuggestion('test')).rejects.toThrow('API Error')
  })
}) 