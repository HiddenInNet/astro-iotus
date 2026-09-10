import { defineMiddleware } from 'astro:middleware'
import { createSupabaseServerClient } from '@/lib/supabase'

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context
  const supabase = createSupabaseServerClient(context)

  // 1. Obtener y refrescar sesión al inicio de la petición (Headers HTTP abiertos)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. Exponer el usuario en context.locals para consumirlo en Header.astro y páginas
  context.locals.user = user

  // 3. Proteger la ruta de Perfil (requiere cualquier usuario autenticado)
  if (url.pathname.startsWith('/perfil') && !user) {
    return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
  }

  // 4. Proteger la ruta de Inventario (requiere autenticación + rol ADMIN o MEMBER)
  if (url.pathname.startsWith('/inventario')) {
    if (!user) {
      return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }

    // Consultar roles en Supabase
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id)

    const allowedRoles = ['ADMIN', 'MEMBER']
    const hasPermission = userRoles?.some((r) =>
      allowedRoles.includes(r.role_id)
    )

    if (!hasPermission) {
      return redirect('/?error=unauthorized')
    }
  }

  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
    }

    // Consultar roles en Supabase
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id)

    const allowedRoles = ['ADMIN']
    const hasPermission = userRoles?.some((r) =>
      allowedRoles.includes(r.role_id)
    )

    if (!hasPermission) {
      return redirect('/?error=unauthorized')
    }
  }

  return next()
})
