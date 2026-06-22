const DEFAULT_RECIPIENT = "vinculacion.dii@uchile.cl";

type SendFormEmailInput = {
  replyTo: string;
  subject: string;
  text: string;
};

export async function sendFormEmail({ replyTo, subject, text }: SendFormEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORM_EMAIL_FROM || process.env.QUOTE_EMAIL_FROM || "Industrial con J <onboarding@resend.dev>";
  const to = process.env.FORM_EMAIL_TO || DEFAULT_RECIPIENT;

  if (!apiKey) {
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "No se pudo enviar el correo.");
  }

  return { skipped: false };
}
