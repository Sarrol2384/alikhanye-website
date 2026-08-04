import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactNotification } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  interest: z.string().min(1),
  message: z.string().min(10),
  consent: z.literal(true),
});

const interestLabels: Record<string, string> = {
  buy: "Buy",
  sell: "Sell",
  valuation: "Valuation",
  "first-time-buyer": "First-time buyer",
  investment: "Investment",
  other: "Other",
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = contactSchema.parse(body);

    await sendContactNotification({
      name: data.name,
      email: data.email,
      phone: data.phone,
      interest: interestLabels[data.interest] ?? data.interest,
      message: data.message,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
