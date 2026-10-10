import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function requiredServerEnv(name: "SUPABASE_URL" | "SUPABASE_ANON_KEY"): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required server configuration: ${name}`);
  }
  return value;
}

/**
 * Request-scoped Supabase SSR client. Do not cache this client globally.
 * Entitlement authorization must still query durable state on protected requests.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requiredServerEnv("SUPABASE_URL"),
    requiredServerEnv("SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot always write cookies. Refresh/write flows
            // must be handled by the request boundary that is allowed to mutate them.
          }
        },
      },
    },
  );
}
