/// <reference types="astro/client" />
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null
  }
}

declare namespace App {
	interface Locals extends Runtime {}
}
