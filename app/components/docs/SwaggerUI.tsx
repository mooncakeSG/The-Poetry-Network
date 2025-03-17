'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIProps {
  url: string;
}

export function SwaggerUIComponent({ url }: SwaggerUIProps) {
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchSpec();
  }, [url]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error Loading API Documentation</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="p-4 bg-gray-50 text-gray-700 rounded-md">
        <p>Loading API documentation...</p>
      </div>
    );
  }

  return (
    <div className="swagger-ui-container">
      <SwaggerUI spec={spec} />
    </div>
  );
} 