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

export type ListingEnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  askingPrice: string;
  area: string;
  comments?: string;
};

type OutboundEmail = {
  subject: string;
  html: string;
  text: string;
  replyTo: { email: string; name: string };
};

export class ContactDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContactDeliveryError";
  }
}

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

async function sendTransactionalEmail(message: OutboundEmail): Promise<void> {
  const client = getBrevoClient();
  const toEmails = getRecipientEmails();
  const senderEmail = getSenderEmail();

  if (!client) {
    console.error("BREVO_API_KEY is not set — message was not emailed");
    throw new ContactDeliveryError("Email is not configured");
  }

  if (toEmails.length === 0 || !senderEmail) {
    console.error("Contact email recipient or sender is missing");
    throw new ContactDeliveryError("Email is not configured");
  }

  try {
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: { name: site.name, email: senderEmail },
      to: toEmails.map((email) => ({ email, name: site.name })),
      replyTo: message.replyTo,
      subject: message.subject,
      htmlContent: message.html,
      textContent: message.text,
    });

    console.info(
      "Notification sent via Brevo",
      response.messageId ?? "ok",
      "to:",
      toEmails.join(", "),
      "from:",
      senderEmail,
    );
  } catch (error) {
    console.error("Brevo rejected the message", error);
    throw new ContactDeliveryError("Brevo did not accept the message");
  }
}

export async function sendContactNotification(
  payload: ContactEmailPayload,
): Promise<void> {
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

  await sendTransactionalEmail({
    subject: `New enquiry from ${payload.name}`,
    html,
    text,
    replyTo: { email: payload.email, name: payload.name },
  });
}

export async function sendListingEnquiry(
  payload: ListingEnquiryPayload,
): Promise<void> {
  const comments = payload.comments?.trim() || "None";
  const html = `
    <h2>List your property — ${escapeHtml(site.name)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
    <p><strong>Estimated asking price:</strong> ${escapeHtml(payload.askingPrice)}</p>
    <p><strong>Property area / address:</strong> ${escapeHtml(payload.area)}</p>
    <p><strong>Comments:</strong></p>
    <p>${escapeHtml(comments).replace(/\n/g, "<br>")}</p>
  `;

  const text = [
    `List your property — ${site.name}`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Estimated asking price: ${payload.askingPrice}`,
    `Property area / address: ${payload.area}`,
    "",
    "Comments:",
    comments,
  ].join("\n");

  await sendTransactionalEmail({
    subject: `List your property — ${payload.name}`,
    html,
    text,
    replyTo: { email: payload.email, name: payload.name },
  });
}
