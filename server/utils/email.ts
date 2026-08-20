// Versand ueber die Resend HTTP-API (https://resend.com), bewusst ohne SDK-Abhaengigkeit.
export async function sendEmail(options: { to: string, subject: string, html: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM

  if (!apiKey || !from) {
    console.warn('[email] RESEND_API_KEY/RESEND_FROM nicht konfiguriert, Mail wird nicht versendet:', options.subject)
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html
    })
  })

  if (!response.ok) {
    const body = await response.text()
    console.error('[email] Versand fehlgeschlagen:', response.status, body)
  }
}
