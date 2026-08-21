import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

async function runSqlMigration(dbUrl) {
  const sqlPath = join(process.cwd(), "supabase", "migrations", "001_listings.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const { Client } = await import("pg");
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied SQL migration.");
  } finally {
    await client.end();
  }
}

async function ensureBucket(supabase) {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(error.message);

  if (!buckets.some((bucket) => bucket.name === "property-images")) {
    const { error: createError } = await supabase.storage.createBucket(
      "property-images",
      { public: true },
    );
    if (createError && !createError.message.includes("already exists")) {
      throw new Error(createError.message);
    }
    console.log('Created storage bucket "property-images".');
  } else {
    console.log('Storage bucket "property-images" already exists.');
  }
}

async function seedListings(supabase) {
  const jsonPath = join(process.cwd(), "data", "listings.json");
  if (!existsSync(jsonPath)) {
    console.log("No data/listings.json to seed.");
    return;
  }

  const listings = JSON.parse(readFileSync(jsonPath, "utf8"));
  if (!Array.isArray(listings) || listings.length === 0) {
    console.log("No listings to seed.");
    return;
  }

  const { count, error: countError } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) > 0) {
    console.log(`Listings table already has ${count} row(s). Skipping seed.`);
    return;
  }

  for (const listing of listings) {
    const images = [];
    for (const src of listing.images ?? []) {
      if (typeof src !== "string") continue;
      if (src.startsWith("http://") || src.startsWith("https://")) {
        images.push(src);
        continue;
      }

      const localPath = join(process.cwd(), "public", src.replace(/^\//, ""));
      if (!existsSync(localPath)) {
        images.push(src);
        continue;
      }

      const fileName = src.split("/").pop() ?? `image-${Date.now()}.jpg`;
      const buffer = readFileSync(localPath);
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, buffer, { upsert: true, contentType: "image/jpeg" });

      if (uploadError) {
        console.warn(`Could not upload ${fileName}: ${uploadError.message}`);
        images.push(src);
        continue;
      }

      const base = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
      images.push(`${base}/storage/v1/object/public/property-images/${fileName}`);
    }

    const row = {
      id: listing.id,
      type: listing.type ?? "sale",
      title: listing.title,
      suburb: listing.suburb,
      price: listing.price,
      beds: listing.beds,
      baths: listing.baths,
      parking: listing.parking,
      description: listing.description,
      images,
      status: listing.status,
      featured: listing.featured ?? false,
    };

    const { error } = await supabase.from("listings").insert(row);
    if (error) {
      throw new Error(`Seed failed for ${listing.id}: ${error.message}`);
    }

    console.log(`Seeded listing: ${listing.id}`);
  }
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.SUPABASE_DB_URL;

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  if (dbUrl) {
    console.log("Running SQL migration via SUPABASE_DB_URL…");
    await runSqlMigration(dbUrl);
  } else {
    console.log(
      "SUPABASE_DB_URL not set — skipping SQL migration.\n" +
        "Run supabase/migrations/001_listings.sql in Supabase → SQL Editor if the listings table does not exist yet.",
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await ensureBucket(supabase);
  await seedListings(supabase);
  console.log("Supabase setup complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
