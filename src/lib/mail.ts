export interface SendEmailPayload {
  to: string;
  subject: string;
  url: string;
  text?: string;
  firstName?: string;
}

/**
 * sendEmail triggers the Next.js API route `/api/send` which relays the
 * request to Resend. It returns the JSON response from that route or throws
 * if the network request fails.
 */
export async function sendEmail(payload: SendEmailPayload) {
  const res = await fetch("http://localhost:3000/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error ?? "Failed to send email");
  }

  return res.json();
}
