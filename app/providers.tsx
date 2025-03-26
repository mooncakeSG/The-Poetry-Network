"use client"

import React, { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/auth-provider';
import axe from '@axe-core/react';

// Run accessibility checks in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  axe(React, {
    rules: [
      { id: 'color-contrast', enabled: true },
      { id: 'document-title', enabled: true },
      { id: 'html-has-lang', enabled: true },
      { id: 'landmark-one-main', enabled: true },
      { id: 'page-has-heading-one', enabled: true },
      { id: 'region', enabled: true },
    ],
    timeout: 1000,
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add keyboard navigation support
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
} 