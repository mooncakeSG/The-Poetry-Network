import { Resend } from "resend"
import { render } from "@react-email/render"
import VerificationEmail from "@/app/components/emails/verification-email"
import ResetPasswordEmail from "@/app/components/emails/reset-password-email"

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

export async function sendVerificationEmail(email: string, username: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  
  const emailHtml = await render(
    VerificationEmail({
      verificationUrl,
      username,
    })
  )

  try {
    await resend.emails.send({
      from: 'Poetry Network <verify@poetrynetwork.com>',
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, username: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  
  const emailHtml = await render(
    ResetPasswordEmail({
      resetUrl,
      username,
    })
  )

  try {
    await resend.emails.send({
      from: 'Poetry Network <noreply@poetrynetwork.com>',
      to: email,
      subject: 'Reset your password',
      html: emailHtml,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
} 