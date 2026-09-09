import { defineMiddleware } from 'astro:middleware'
import { createSupabaseServerClient } from '@/lib/supabase'

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context

  if (url.pathname.startsWith('/inventario') || url.pathname.startsWith('/perfil')) {
    const supabase = createSupabaseServerClient(context)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }
  }

  return next()
})
