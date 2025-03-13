import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components"

interface CommentNotificationEmailProps {
  authorName: string
  commenterName: string
  submissionTitle: string
  workshopTitle: string
  commentContent: string
  submissionUrl: string
}

export default function CommentNotificationEmail({
  authorName,
  commenterName,
  submissionTitle,
  workshopTitle,
  commentContent,
  submissionUrl,
}: CommentNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New comment on your submission in {workshopTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Comment on Your Submission</Heading>
          <Text style={text}>Hi {authorName},</Text>
          <Text style={text}>
            {commenterName} has commented on your submission "{submissionTitle}" in the workshop "{workshopTitle}".
          </Text>
          <Text style={text}>Here's what they said:</Text>
          <Text style={quote}>"{commentContent}"</Text>
          <Link href={submissionUrl} style={button}>
            View Comment
          </Link>
          <Text style={footer}>
            You're receiving this email because you're a member of {workshopTitle}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const quote = {
  backgroundColor: "#f4f4f4",
  borderLeft: "4px solid #ddd",
  color: "#666",
  fontSize: "16px",
  fontStyle: "italic",
  lineHeight: "24px",
  margin: "16px 0",
  padding: "16px",
}

const button = {
  backgroundColor: "#000",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "24px 0",
  padding: "12px 24px",
  textDecoration: "none",
}

const footer = {
  color: "#898989",
  fontSize: "14px",
  margin: "48px 0 0",
} 