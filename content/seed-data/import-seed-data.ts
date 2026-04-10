import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Listing {
  type: "resource" | "provider" | "church" | "nonprofit";
  subtype: string;
  name: string;
  slug?: string;
  description: string;
  city: string;
  state: string;
  zip?: string;
  county: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  tags: string[];
  source: string;
  published: boolean;
  premium_tier: string;
  metadata?: Record<string, unknown>;
}

// Generate slug from name and location
function generateSlug(listing: Listing): string {
  if (listing.slug) return listing.slug;

  const name = listing.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const city = listing.city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const state = listing.state.toLowerCase();

  return `${name}-${city}-${state}`;
}

async function importSeedData(filePath: string): Promise<void> {
  try {
    // Read the JSON file
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const listings: Listing[] = JSON.parse(fileContent);

    console.log(`Loading ${listings.length} listings from ${path.basename(filePath)}...`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    // Process each listing
    for (const listing of listings) {
      try {
        // Generate slug if missing
        const slug = generateSlug(listing);

        // Prepare the record
        const record = {
          ...listing,
          slug,
        };

        // Upsert by slug (insert if doesn't exist, update if exists)
        const { error, data } = await supabase
          .from("listings")
          .upsert([record], { onConflict: "slug" })
          .select();

        if (error) {
          console.error(`Error upserting ${listing.name}:`, error.message);
          errors++;
        } else {
          // Check if it was created or updated by looking at the response
          if (data && data.length > 0) {
            // For upsert, we can't directly determine created vs updated
            // So we'll log as updated to be conservative
            created++;
            console.log(`✓ ${listing.name} (${slug})`);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error processing ${listing.name}:`, errorMessage);
        errors++;
      }
    }

    // Summary
    console.log("\n=== Import Summary ===");
    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Processed: ${listings.length}`);
    console.log(`Created/Updated: ${created}`);
    console.log(`Errors: ${errors}`);
    console.log("");

    return;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Failed to import seed data from ${filePath}:`, errorMessage);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const seedDir = path.dirname(__filename);

  console.log("=== TSI Seed Data Importer ===\n");

  // Import both seed data files
  const files = [
    path.join(seedDir, "denton-county-resources.json"),
    path.join(seedDir, "family-office-providers.json"),
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      await importSeedData(file);
    } else {
      console.warn(`File not found: ${file}`);
    }
  }

  console.log("=== Import Complete ===");
}

// Run the import
main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
