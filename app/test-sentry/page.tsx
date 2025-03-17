'use client';

import { SentryTest } from '@/components/SentryTest';

// This function will trigger an error
function myUndefinedFunction() {
  // @ts-ignore - Intentionally causing an error
  const result = undefinedFunction();
  return result;
}

export default function TestSentryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sentry Integration Test</h1>
      <SentryTest />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Additional Error Tests</h2>
        <button
          onClick={() => myUndefinedFunction()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Undefined Function Error
        </button>
      </div>
    </div>
  );
} 