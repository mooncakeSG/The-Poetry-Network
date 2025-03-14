'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token')
        if (!token) {
          setStatus('error')
          setError('Verification token is missing')
          return
        }

        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify email')
        }

        setStatus('success')
      } catch (error) {
        setStatus('error')
        setError(error instanceof Error ? error.message : 'Failed to verify email')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="container max-w-lg mx-auto py-12">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
            <p className="text-muted-foreground">
              Your email has been successfully verified. You can now access all features of Poetry Network.
            </p>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.push('/api/auth/verify-email')} variant="outline">
              Resend Verification Email
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 