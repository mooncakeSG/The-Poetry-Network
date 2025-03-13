import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendInvitationEmailParams {
  to: string
  workshop: {
    title: string
    host: string
  }
  inviteCode: string
}

export async function sendInvitationEmail({
  to,
  workshop,
  inviteCode,
}: SendInvitationEmailParams) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/workshops/join/${inviteCode}`

  await resend.emails.send({
    from: "Poetry Network <noreply@poetrynetwork.com>",
    to: [to],
    subject: `You've been invited to join ${workshop.title}`,
    html: `
      <div>
        <h1>Workshop Invitation</h1>
        <p>You've been invited by ${workshop.host} to join the workshop "${workshop.title}".</p>
        <p>Click the link below to join:</p>
        <a href="${inviteUrl}">${inviteUrl}</a>
        <p>This invitation will expire in 7 days.</p>
      </div>
    `,
  })
} 