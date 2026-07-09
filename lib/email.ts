const DEFAULT_RECIPIENT = "vinculacion.dii@uchile.cl";
const EMAIL_TIMEOUT_MS = 10000;

type SendFormEmailInput = {
  replyTo: string;
  subject: string;
  text: string;
  to?: string | string[];
  cc?: string | string[];
};

function getResendErrorMessage(body: string) {
  try {
    const payload = JSON.parse(body) as { message?: string; name?: string };
    if (payload.message?.includes("You can only send testing emails")) {
      return "Resend está en modo prueba: falta verificar el dominio de envío para mandar correos a vinculacion.dii@uchile.cl.";
    }
    if (payload.message?.includes("domain is not verified")) {
      return "Falta verificar industrialconj.cl en Resend antes de poder enviar correos desde contacto@industrialconj.cl.";
    }
    return payload.message || body;
  } catch {
    return body;
  }
}

export function getDefaultFormEmailTo() {
  return process.env.FORM_EMAIL_TO || DEFAULT_RECIPIENT;
}

export async function sendFormEmail({ replyTo, subject, text, to, cc }: SendFormEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FORM_EMAIL_FROM || process.env.QUOTE_EMAIL_FROM || "Industrial con J <onboarding@resend.dev>";
  const recipients = to || getDefaultFormEmailTo();

  if (!apiKey) {
    return { skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: recipients,
      ...(cc ? { cc } : {}),
      reply_to: replyTo,
      subject,
      text
    })
  })
    .catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Timeout enviando el correo. Revisa la configuración de Resend e inténtalo nuevamente.");
      }
      throw error;
    })
    .finally(() => clearTimeout(timeout));

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body ? getResendErrorMessage(body) : "No se pudo enviar el correo.");
  }

  return { skipped: false };
}
