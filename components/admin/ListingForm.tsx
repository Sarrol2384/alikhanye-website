"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Property, PropertyStatus } from "@/lib/properties";

type ListingFormProps = {
  mode: "create" | "edit";
  initial?: Property;
};

type FormState = {
  title: string;
  suburb: string;
  price: string;
  beds: string;
  baths: string;
  parking: string;
  description: string;
  status: PropertyStatus;
  featured: boolean;
  images: string[];
};

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

function toState(initial?: Property): FormState {
  return {
    title: initial?.title ?? "",
    suburb: initial?.suburb ?? "",
    price: initial?.price ?? "",
    beds: String(initial?.beds ?? 2),
    baths: String(initial?.baths ?? 1),
    parking: String(initial?.parking ?? 1),
    description: initial?.description ?? "",
    status: initial?.status ?? "available",
    featured: initial?.featured ?? true,
    images: initial?.images ?? [],
  };
}

export function ListingForm({ mode, initial }: ListingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of list) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = await readJsonResponse(response);
        const url = typeof data.url === "string" ? data.url : undefined;
        const error = typeof data.error === "string" ? data.error : undefined;
        if (!response.ok || !url) {
          throw new Error(error ?? `Upload failed for ${file.name}`);
        }
        uploaded.push(url);
      }
      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploaded],
      }));
      toast.success(
        uploaded.length === 1
          ? "Photo uploaded"
          : `${uploaded.length} photos uploaded`,
      );
    } catch (error) {
      if (uploaded.length > 0) {
        setForm((current) => ({
          ...current,
          images: [...current.images, ...uploaded],
        }));
      }
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    update("images", [...form.images, url]);
    setImageUrl("");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.images.length === 0) {
      toast.error("Add at least one photo");
      return;
    }

    if (form.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    setPending(true);
    try {
      const payload = {
        title: form.title.trim(),
        suburb: form.suburb.trim(),
        price: form.price.trim(),
        beds: Number(form.beds),
        baths: Number(form.baths),
        parking: Number(form.parking),
        description: form.description.trim(),
        status: form.status,
        featured: form.featured,
        images: form.images,
      };

      const response = await fetch(
        mode === "create"
          ? "/api/admin/listings"
          : `/api/admin/listings/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readJsonResponse(response);
      const listing = data.listing as Property | undefined;
      const error = typeof data.error === "string" ? data.error : undefined;
      if (!response.ok || !listing) {
        throw new Error(error ?? "Could not save listing");
      }

      toast.success(mode === "create" ? "Listing published" : "Listing updated");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
            className="h-10"
            placeholder="e.g. 3-Bedroom Home in Blue Downs"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suburb">Suburb</Label>
          <Input
            id="suburb"
            value={form.suburb}
            onChange={(e) => update("suburb", e.target.value)}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
            className="h-10"
            placeholder="R1 250 000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beds">Beds</Label>
          <Input
            id="beds"
            type="number"
            min={0}
            value={form.beds}
            onChange={(e) => update("beds", e.target.value)}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="baths">Baths</Label>
          <Input
            id="baths"
            type="number"
            min={0}
            value={form.baths}
            onChange={(e) => update("baths", e.target.value)}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="parking">Parking</Label>
          <Input
            id="parking"
            type="number"
            min={0}
            value={form.parking}
            onChange={(e) => update("parking", e.target.value)}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => update("status", e.target.value as PropertyStatus)}
            className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          minLength={10}
          rows={6}
          placeholder="Describe the property…"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="size-4 accent-[var(--gold)]"
        />
        Feature on home page
      </label>

      <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
        <p className="text-sm font-medium text-primary">Photos</p>
        <div className="flex flex-wrap gap-3">
          {form.images.map((src) => (
            <div
              key={src}
              className="relative size-24 overflow-hidden rounded-md bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="size-full object-cover" />
              <button
                type="button"
                className="absolute inset-x-0 bottom-0 bg-navy/80 py-1 text-[10px] text-white"
                onClick={() =>
                  update(
                    "images",
                    form.images.filter((image) => image !== src),
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo">Upload photos</Label>
          <Input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading}
            className="h-10"
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) void uploadFiles(files);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-muted-foreground">
            You can select multiple images at once.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste image URL"
            className="h-10"
          />
          <Button type="button" variant="outline" onClick={addImageUrl}>
            Add URL
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || uploading}>
          {pending
            ? "Saving…"
            : uploading
              ? "Uploading…"
              : mode === "create"
                ? "Publish listing"
                : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
