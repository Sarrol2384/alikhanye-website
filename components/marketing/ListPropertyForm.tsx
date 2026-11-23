"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number is required")
    .refine((value) => value.replace(/\D/g, "").length >= 10, {
      message: "Enter a phone number we can call",
    }),
  askingPrice: z
    .string()
    .trim()
    .min(1, "Enter an estimated price")
    .refine((value) => {
      const amount = Number(value.replace(/[^\d.]/g, ""));
      return Number.isFinite(amount) && amount > 0 && amount <= 1_000_000_000;
    }, "Enter an estimated price"),
  area: z
    .string()
    .trim()
    .min(3, "Tell us the area or address"),
  comments: z.string().trim().max(4000),
  consent: z.boolean().refine((value) => value === true, {
    message: "POPIA consent is required",
  }),
  company: z.string(),
});

type FormData = z.infer<typeof schema>;

export function ListPropertyForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      askingPrice: "",
      area: "",
      comments: "",
      consent: false,
      company: "",
    },
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/list-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || body.ok !== true) {
        throw new Error(
          body.error ??
            "We couldn't send your details. Phone or WhatsApp us instead.",
        );
      }
      setSent(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-gold/40 bg-gold/5 px-5 py-6">
        <h2 className="font-heading text-2xl text-primary">
          Thanks, we&apos;ve got it
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Wendy has your details and will contact you about the property. If
          it is urgent, phone {site.phoneDisplay} or send a WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="askingPrice">Estimated asking price (R) *</Label>
          <Input
            id="askingPrice"
            type="number"
            min={1}
            step="any"
            inputMode="decimal"
            {...register("askingPrice")}
          />
          {errors.askingPrice ? (
            <p className="text-xs text-destructive">
              {errors.askingPrice.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Property area or address *</Label>
        <Input
          id="area"
          autoComplete="street-address"
          placeholder="For example, Blue Downs or the street name"
          {...register("area")}
        />
        {errors.area ? (
          <p className="text-xs text-destructive">{errors.area.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          rows={5}
          placeholder="Beds, baths, whether you want a valuation, or anything else Wendy should know."
          {...register("comments")}
        />
        {errors.comments ? (
          <p className="text-xs text-destructive">{errors.comments.message}</p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/40 px-3 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          POPIA notice: {site.name} uses your name, phone number, email and
          property details only to respond to this request. We don&apos;t sell
          your details. Email {site.email} if you want them deleted.
        </p>
        <div className="flex items-start gap-2">
          <Checkbox
            id="listing-consent"
            checked={consent === true}
            onCheckedChange={(checked) => {
              const next = checked === true;
              setConsent(next);
              setValue("consent", next, { shouldValidate: true });
            }}
          />
          <Label
            htmlFor="listing-consent"
            className="text-sm font-normal leading-snug"
          >
            I agree that {site.name} may use these details to contact me about
            listing this property.
          </Label>
        </div>
      </div>
      {errors.consent ? (
        <p className="text-xs text-destructive">{errors.consent.message}</p>
      ) : null}

      <Button
        type="submit"
        variant="accent"
        disabled={submitting}
        className="cta-lift w-full sm:w-auto"
      >
        {submitting ? "Sending…" : "Send details"}
      </Button>
    </form>
  );
}
