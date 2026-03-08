import type { APIRoute } from 'astro'
import { RESEND_API_KEY } from 'astro:env/server'

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>
  delete(key: string): Promise<void>
}

export const prerender = false

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const kv = (locals as { runtime?: { env?: { RATE_LIMIT?: KVNamespace } } })
      .runtime?.env?.RATE_LIMIT

    if (!kv) {
      return new Response('Servicio no disponible', {
        status: 500
      })
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const rateLimitKey = `contact:${ip}`
    const windowStart =
      Math.floor(Date.now() / (30 * 60 * 1000)) * 30 * 60 * 1000
    const requestsData = await kv.get(`${rateLimitKey}:${windowStart}`)
    const requests = requestsData ? parseInt(requestsData) : 0

    if (requests >= 6) {
      return new Response('Too many requests. Try again later.', {
        status: 429
      })
    }

    await kv.put(`${rateLimitKey}:${windowStart}`, String(requests + 1), {
      expirationTtl: 30 * 60
    })

    const body = await request.json()

    if (
      !body.email ||
      body.email.length < 8 ||
      body.email.length > 80 ||
      !body.message ||
      body.message.length < 6 ||
      body.message.length > 240
    ) {
      return new Response('Invalid request', {
        status: 400
      })
    }

    const content = `
    <span style="font-weight: bold;">${body.email}</span> has sent a message on the contact form.<br/><br/>
<span style="font-weight: bold;">Message:</span><br/>${body.message}<br/>
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

    if (res.status !== 200) {
      return new Response('Error sending message', {
        status: 500
      })
    }

    return new Response('Message sent successfully')
  } catch (err) {
    return new Response('Error sending message', {
      status: 500
    })
  }
}
