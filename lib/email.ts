import "server-only";
import { BrevoClient } from "@getbrevo/brevo";
import { site } from "@/lib/site";

type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
};

let cachedClient: BrevoClient | null = null;

function getBrevoClient(): BrevoClient | null {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return null;
  if (!cachedClient) {
    cachedClient = new BrevoClient({ apiKey });
  }
  return cachedClient;
}

function getRecipientEmails(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL ?? site.email;
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function getSenderEmail(): string {
  return process.env.BREVO_SENDER_EMAIL?.trim() || site.email;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactNotification(
  payload: ContactEmailPayload,
): Promise<void> {
  const client = getBrevoClient();
  const toEmails = getRecipientEmails();
  const senderEmail = getSenderEmail();

  if (!client) {
    console.warn("BREVO_API_KEY not set — skipping contact email notification");
    return;
  }

  const html = `
    <h2>New enquiry — ${escapeHtml(site.name)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
    ${payload.interest ? `<p><strong>Interest:</strong> ${escapeHtml(payload.interest)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>
  `;

  const text = [
    `New enquiry — ${site.name}`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : "",
    payload.interest ? `Interest: ${payload.interest}` : "",
    "",
    "Message:",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.transactionalEmails.sendTransacEmail({
    sender: { name: site.name, email: senderEmail },
    to: toEmails.map((email) => ({ email, name: site.name })),
    replyTo: { email: payload.email, name: payload.name },
    subject: `New enquiry from ${payload.name}`,
    htmlContent: html,
    textContent: text,
  });

  console.info(
    "Contact notification sent via Brevo",
    response.messageId ?? "ok",
    "to:",
    toEmails.join(", "),
    "from:",
    senderEmail,
  );
}
