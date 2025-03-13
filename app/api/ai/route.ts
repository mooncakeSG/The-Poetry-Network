import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AIService } from "@/lib/ai/ai-service";

const aiService = new AIService();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { action, content, type, prompt } = body;

    if (!action) {
      return new NextResponse("Action is required", { status: 400 });
    }

    switch (action) {
      case "writing-assistant":
        if (!content) {
          return new NextResponse("Content is required", { status: 400 });
        }
        const suggestions = await aiService.getWritingSuggestions(content);
        return NextResponse.json(suggestions);

      case "generate-content":
        if (!prompt || !type) {
          return new NextResponse("Prompt and type are required", { status: 400 });
        }
        const generatedContent = await aiService.generateContent(prompt, type);
        return NextResponse.json(generatedContent);

      case "analyze-sentiment":
        if (!content) {
          return new NextResponse("Content is required", { status: 400 });
        }
        const sentiment = await aiService.analyzeSentiment(content);
        return NextResponse.json(sentiment);

      case "categorize-content":
        if (!content) {
          return new NextResponse("Content is required", { status: 400 });
        }
        const categorization = await aiService.categorizeContent(content);
        return NextResponse.json(categorization);

      case "get-recommendations":
        const recommendations = await aiService.getPersonalizedRecommendations(
          session.user.id,
          body.userInterests || [],
          body.recentActivity || []
        );
        return NextResponse.json(recommendations);

      case "provide-feedback":
        if (!content) {
          return new NextResponse("Content is required", { status: 400 });
        }
        const feedback = await aiService.provideFeedback(content);
        return NextResponse.json(feedback);

      case "check-plagiarism":
        if (!content) {
          return new NextResponse("Content is required", { status: 400 });
        }
        const plagiarismCheck = await aiService.checkPlagiarism(content);
        return NextResponse.json(plagiarismCheck);

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("[AI_API]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 