import * as Sentry from '@sentry/nextjs';
import { NodeTracing } from '@sentry/tracing';
import { ExpressIntegration } from '@sentry/integrations';
import { PrismaInstrumentation } from '@prisma/instrumentation';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    new NodeTracing(),
    new ExpressIntegration(),
    new PrismaInstrumentation(),
  ],
}); 