'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export function SentryTest() {
  const [error, setError] = useState<string | null>(null);

  // Test error tracking
  const triggerError = () => {
    try {
      throw new Error('This is a test error from SentryTest component');
    } catch (err) {
      Sentry.captureException(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Test performance monitoring
  const simulateSlowOperation = async () => {
    const transaction = Sentry.getCurrentHub().startTransaction({
      name: 'Slow Operation',
    });

    try {
      // Simulate a slow operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Add some spans to the transaction
      const span = transaction.startChild({
        op: 'task',
        description: 'Processing data',
      });

      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      span.finish();
      transaction.finish();
    } catch (err) {
      transaction.finish();
      Sentry.captureException(err);
    }
  };

  // Test user feedback
  const triggerUserFeedback = () => {
    Sentry.showReportDialog({
      eventId: 'test-event-id',
      title: 'Test Feedback',
      subtitle: 'This is a test feedback form',
      subtitle2: 'Please provide your feedback about this test.',
      labelName: 'Name',
      labelEmail: 'Email',
      labelComments: 'Comments',
      labelClose: 'Close',
      errorGeneric: 'An error occurred while submitting your report. Please try again.',
      errorFormEntry: 'Some fields were invalid. Please correct the errors and try again.',
      successMessage: 'Thank you for your feedback!',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={triggerError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Error
        </button>
        
        <button
          onClick={simulateSlowOperation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Simulate Slow Operation
        </button>
        
        <button
          onClick={triggerUserFeedback}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show Feedback Form
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
} 