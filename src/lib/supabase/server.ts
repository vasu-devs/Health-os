import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Uses the publishable key — all queries still go through RLS as the signed-in user.
// For admin-level operations that need to bypass RLS (cron jobs, backfills, webhooks),
// instantiate a separate client with SUPABASE_SECRET_KEY (starts with `sb_secret_`).
// That key is server-only — never prefix it with NEXT_PUBLIC_.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware will refresh the session instead.
          }
        },
      },
    },
  );
}
