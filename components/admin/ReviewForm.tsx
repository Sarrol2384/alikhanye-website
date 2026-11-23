"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/lib/reviews-store";

type ReviewFormProps = {
  mode: "create" | "edit";
  initial?: Review;
};

type FormState = {
  clientName: string;
  suburb: string;
  rating: string;
  comment: string;
  published: boolean;
  sortOrder: string;
};

function toState(initial?: Review): FormState {
  return {
    clientName: initial?.clientName ?? "",
    suburb: initial?.suburb ?? "",
    rating: String(initial?.rating ?? 5),
    comment: initial?.comment ?? "",
    published: initial?.published ?? false,
    sortOrder: String(initial?.sortOrder ?? 0),
  };
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    throw new Error(
      response.ok
        ? "Empty response from server"
        : `Request failed (${response.status})`,
    );
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(
      response.ok
        ? "Invalid response from server"
        : `Request failed (${response.status})`,
    );
  }
}

export function ReviewForm({ mode, initial }: ReviewFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [pending, setPending] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/reviews"
          : `/api/admin/reviews/${initial?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: form.clientName,
            suburb: form.suburb,
            rating: Number(form.rating),
            comment: form.comment,
            published: form.published,
            sortOrder: Number(form.sortOrder),
          }),
        },
      );
      const data = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not save review",
        );
      }
      toast.success(mode === "create" ? "Review added" : "Review saved");
      router.push("/admin/reviews");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save review");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="space-y-5 rounded-xl border border-border bg-card p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client name *</Label>
          <Input
            id="clientName"
            value={form.clientName}
            onChange={(event) => update("clientName", event.target.value)}
            required
            maxLength={80}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suburb">Suburb</Label>
          <Input
            id="suburb"
            value={form.suburb}
            onChange={(event) => update("suburb", event.target.value)}
            maxLength={80}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating *</Label>
          <select
            id="rating"
            value={form.rating}
            onChange={(event) => update("rating", event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Good</option>
            <option value="3">3 — Fine</option>
            <option value="2">2 — Poor</option>
            <option value="1">1 — Very poor</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            step={1}
            value={form.sortOrder}
            onChange={(event) => update("sortOrder", event.target.value)}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            Lower numbers show first on the website.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment *</Label>
        <Textarea
          id="comment"
          rows={5}
          value={form.comment}
          onChange={(event) => update("comment", event.target.value)}
          required
          minLength={10}
          maxLength={2000}
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="published"
          checked={form.published}
          onCheckedChange={(checked) => update("published", checked === true)}
        />
        <Label htmlFor="published" className="font-normal leading-snug">
          Published. Hidden reviews stay off the website.
        </Label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Add review" : "Save review"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/reviews")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
