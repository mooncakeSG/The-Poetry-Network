'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export default function ApiDocs() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      <Suspense
        fallback={
          <div className="w-full h-screen">
            <Skeleton className="w-full h-full" />
          </div>
        }
      >
        <SwaggerUI url="/api/openapi.json" />
      </Suspense>
    </div>
  );
} 