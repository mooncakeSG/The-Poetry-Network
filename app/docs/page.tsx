import { SwaggerUIComponent } from '@/components/docs/SwaggerUI';

export default function APIDocs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <SwaggerUIComponent url="/api/docs" />
      </div>
    </div>
  );
} 