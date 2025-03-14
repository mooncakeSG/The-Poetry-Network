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

interface VerificationEmailProps {
  verificationUrl: string
  username: string
}

export default function VerificationEmail({
  verificationUrl,
  username,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Poetry Network</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <Heading className="text-2xl font-bold text-gray-900 text-center mb-4">
              Welcome to Poetry Network
            </Heading>
            <Text className="text-gray-700 mb-4">
              Hi {username},
            </Text>
            <Text className="text-gray-700 mb-4">
              Thanks for signing up for Poetry Network! Please verify your email address by clicking
              the button below.
            </Text>
            <Section className="text-center mb-8">
              <Button
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
                href={verificationUrl}
              >
                Verify Email Address
              </Button>
            </Section>
            <Text className="text-sm text-gray-500">
              If you didn't create an account on Poetry Network, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
} 