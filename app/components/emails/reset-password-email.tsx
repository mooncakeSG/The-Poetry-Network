import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface ResetPasswordEmailProps {
  resetUrl: string
  username: string
}

export default function ResetPasswordEmail({
  resetUrl,
  username,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Poetry Network password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <Heading className="text-2xl font-bold text-gray-900 text-center mb-4">
              Password Reset Request
            </Heading>
            <Text className="text-gray-700 mb-4">
              Hi {username},
            </Text>
            <Text className="text-gray-700 mb-4">
              We received a request to reset your Poetry Network password. Click the button below
              to choose a new password. This link will expire in 1 hour.
            </Text>
            <Section className="text-center mb-8">
              <Button
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
                href={resetUrl}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-sm text-gray-500">
              If you didn't request a password reset, you can safely ignore this email.
              Your password will remain unchanged.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
} 