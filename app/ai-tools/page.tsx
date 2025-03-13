import { WritingAssistant } from '@/components/ai/WritingAssistant';
import { ContentGenerator } from '@/components/ai/ContentGenerator';
import { SentimentAnalyzer } from '@/components/ai/SentimentAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AIToolsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI Writing Tools</h1>
          <p className="text-muted-foreground">
            Enhance your writing with our suite of AI-powered tools.
          </p>
        </div>

        <Tabs defaultValue="writing-assistant" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="writing-assistant">Writing Assistant</TabsTrigger>
            <TabsTrigger value="content-generator">Content Generator</TabsTrigger>
            <TabsTrigger value="sentiment-analyzer">Sentiment Analyzer</TabsTrigger>
          </TabsList>

          <TabsContent value="writing-assistant" className="space-y-4">
            <WritingAssistant />
          </TabsContent>

          <TabsContent value="content-generator" className="space-y-4">
            <ContentGenerator />
          </TabsContent>

          <TabsContent value="sentiment-analyzer" className="space-y-4">
            <SentimentAnalyzer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 