import { NextResponse } from "next/server";
import { z } from "zod";
import { formatZar } from "@/lib/calculators/bond";
import { ContactDeliveryError, sendListingEnquiry } from "@/lib/email";

const listingLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .refine((value) => value.replace(/\D/g, "").length >= 10, {
      message: "Enter a phone number",
    }),
  askingPrice: z.coerce.number().positive().max(1_000_000_000),
  area: z.string().trim().min(3).max(240),
  comments: z.string().trim().max(4000).optional().default(""),
  consent: z.literal(true),
  company: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = listingLeadSchema.parse(body);

    if (data.company.trim().length > 0) {
      console.info("Listing enquiry honeypot filled — not emailed");
      return NextResponse.json({ ok: true });
    }

    await sendListingEnquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      askingPrice: formatZar(data.askingPrice),
      area: data.area,
      comments: data.comments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    if (err instanceof ContactDeliveryError) {
      console.error("Listing enquiry delivery error:", err.message);
    } else {
      console.error("Listing enquiry API error:", err);
    }
    return NextResponse.json(
      {
        error:
          "We couldn't send your details just now. Phone or WhatsApp us and we'll pick it up.",
      },
      { status: 503 },
    );
  }
}
