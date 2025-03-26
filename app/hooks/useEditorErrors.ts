import { useState, useCallback } from 'react';
import { ZodError } from 'zod';
import { PoemContentSchema } from '@/app/lib/validations/editor';

interface EditorError {
  message: string;
  field?: string;
  type: 'validation' | 'network' | 'collaboration' | 'unknown';
}

export function useEditorErrors() {
  const [errors, setErrors] = useState<EditorError[]>([]);

  const validateContent = useCallback((content: string) => {
    try {
      PoemContentSchema.parse({ content });
      setErrors([]);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          message: err.message,
          field: err.path.join('.'),
          type: 'validation' as const,
        }));
        setErrors(validationErrors);
      } else {
        setErrors([
          {
            message: 'An unexpected validation error occurred',
            type: 'unknown',
          },
        ]);
      }
      return false;
    }
  }, []);

  const handleNetworkError = useCallback((error: Error) => {
    setErrors([
      {
        message: 'Failed to connect to the server. Please check your internet connection.',
        type: 'network',
      },
    ]);
  }, []);

  const handleCollaborationError = useCallback((error: Error) => {
    setErrors([
      {
        message: 'Failed to sync with other users. Your changes may not be saved.',
        type: 'collaboration',
      },
    ]);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors.find((error) => error.field === field);
  }, [errors]);

  return {
    errors,
    validateContent,
    handleNetworkError,
    handleCollaborationError,
    clearErrors,
    getFieldError,
  };
} 