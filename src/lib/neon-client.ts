"use client";

import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
import type { Database } from "@/lib/types";

type NeonClient = ReturnType<typeof createClient<Database>>;

let client: NeonClient | null = null;

export function hasNeonConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_NEON_AUTH_URL &&
      process.env.NEXT_PUBLIC_NEON_DATA_API_URL,
  );
}

export function getNeonClient() {
  const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
  const dataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;

  if (!authUrl || !dataApiUrl) {
    throw new Error("Missing Neon public environment variables.");
  }

  if (!client) {
    client = createClient<Database>({
      auth: {
        adapter: BetterAuthReactAdapter(),
        url: authUrl,
      },
      dataApi: {
        url: dataApiUrl,
      },
    });
  }

  return client;
}
