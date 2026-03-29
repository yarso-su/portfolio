import type { APIRoute } from 'astro'
import { z } from 'astro/zod'
import { RESEND_API_KEY } from 'astro:env/server'
import { env } from 'cloudflare:workers'

const sendMessageSchema = z.object({
  email: z.email().min(8).max(80),
  message: z.string().min(6).max(240)
})

export const prerender = false

async function limitExceeded(ip: string) {
  const rateLimitKey = `contact:${ip}`
  const windowStart = Math.floor(Date.now() / 1800000) * 1800000 // note: 1800000 = 30 * 60 * 1000

  const requestsData = await env.RATE_LIMIT.get(
    `${rateLimitKey}:${windowStart}`
  )
  const requests = requestsData ? parseInt(requestsData) : 0

  if (requests >= 6) {
    return true
  }

  await env.RATE_LIMIT.put(
    `${rateLimitKey}:${windowStart}`,
    String(requests + 1),
    {
      expirationTtl: 30 * 60
    }
  )

  return false
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (
      await limitExceeded(request.headers.get('CF-Connecting-IP') || 'unknown')
    ) {
      return new Response('Too many requests', {
        status: 429
      })
    }

    const body = await request.json()
    const { success, data } = sendMessageSchema.safeParse(body)
    if (!success) {
      return new Response('Invalid request', {
        status: 400
      })
    }

    const content = `
    <span style="font-weight: bold;">${data.email}</span> has sent a message on the contact form.<br/><br/>
<span style="font-weight: bold;">Message:</span><br/>${data.message}<br/>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Portfolio <portfolio@apps.yarso.dev>`,
        subject: 'Contact Form',
        to: ['contact@yarso.dev'],
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 8px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
          <tr>
            <td style="border: 1px solid #eaeaea; border-radius: 4px;"> 

              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                  <td align="center">
                    <p style="padding: 0; margin: 0; padding-top: 48px; padding-bottom: 32px; font-size: 18px;"><strong>Yarso.</strong> Software Developer</p>
                  </td>
                </tr>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                  <td align="left">
                    <p style="padding: 0; margin: 0; padding-bottom: 24px; padding-left: 16px; padding-right: 16px; font-size: 14px;">Hi, <strong>Admin</strong>.</p>
                  </td>
                </tr>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                  <td align="left">
                    <p style="padding: 0; margin: 0; padding-left: 16px; padding-right: 16px; font-size: 14px;">${content}</p>
                  </td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 12px;">

              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                <tr>
                  <td align="left">
                    <p style="padding: 0; margin: 0; padding-top: 12px; padding-left:16px; padding-right: 16px; padding-bottom: 24px; color: #999999; font-size: 12px;">This email was sent automatically, so you don't need to reply. If you need more information about any of our services or have any questions, you can open a thread within the platform.<br/><br/>If the email contains any code or link, it will expire in less than 5 minutes after it has been received, this for security purposes.</p>
                  </td>
                </tr>
              </table>

            </td> 
          </tr>
          <tr>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`
      })
    })

    if (!res.ok) {
      throw new Error('Error sending message')
    }

    return new Response()
  } catch {
    return new Response('Internal server error', {
      status: 500
    })
  }
}
