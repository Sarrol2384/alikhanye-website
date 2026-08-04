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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

const interestOptions = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
  { value: "valuation", label: "Valuation" },
  { value: "first-time-buyer", label: "First-time buyer" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
] as const;

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  interest: z.string().min(1, "Please select an interest"),
  message: z.string().min(10, "Please tell us how we can help"),
  consent: z.boolean().refine((v) => v === true, {
    message: "POPIA consent is required",
  }),
});

type FormData = z.infer<typeof schema>;

type ContactFormProps = {
  defaultMessage?: string;
  defaultInterest?: string;
};

export function ContactForm({
  defaultMessage = "",
  defaultInterest = "",
}: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent: undefined,
      interest: defaultInterest,
      message: defaultMessage,
    },
  });

  const consent = watch("consent");
  const interest = watch("interest");

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Failed to send message");
      }
      toast.success("Message sent — we'll be in touch soon.");
      reset({
        name: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
        consent: undefined,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </div>
        <div className="space-y-2">
          <Label>Interest *</Label>
          <Select
            value={interest || undefined}
            onValueChange={(v) =>
              setValue("interest", String(v ?? ""), { shouldValidate: true })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an interest" />
            </SelectTrigger>
            <SelectContent>
              {interestOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interest && (
            <p className="text-xs text-destructive">{errors.interest.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="consent"
          checked={consent === true}
          onCheckedChange={(checked) =>
            setValue("consent", checked === true ? true : (undefined as never), {
              shouldValidate: true,
            })
          }
        />
        <Label htmlFor="consent" className="text-sm font-normal leading-snug">
          I consent to {site.name} processing my personal information to respond
          to this enquiry, in line with POPIA.
        </Label>
      </div>
      {errors.consent && (
        <p className="text-xs text-destructive">{errors.consent.message}</p>
      )}

      <Button
        type="submit"
        variant="accent"
        disabled={submitting}
        className="cta-lift w-full sm:w-auto"
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
