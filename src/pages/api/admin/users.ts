import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

export const GET: APIRoute = async (context) => {
  // 1. Instanciar cliente administrativo (requiere Service Role Key)
  const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // 2. Obtener usuarios de auth.users y roles de public.user_roles en paralelo
    const [usersResponse, rolesResponse] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers(),
      supabaseAdmin.from('user_roles').select('user_id, role_id'),
    ])

    if (usersResponse.error) throw new Error(usersResponse.error.message)
    if (rolesResponse.error) throw new Error(rolesResponse.error.message)

    const users = usersResponse.data.users
    const userRoles = rolesResponse.data

    // 3. Cruzar los datos: asociar los roles a cada usuario según su id
    const combinedUsers = users.map((u) => {
      // Filtrar los roles pertenecientes al usuario actual
      const roles = userRoles
        .filter((r) => r.user_id === u.id)
        .map((r) => r.role_id)

      return {
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || null,
        avatar_url: u.user_metadata?.avatar_url || null,
        created_at: u.created_at,
        roles: roles, // Array de roles asignados ej: ['ADMIN', 'MEMBER']
      }
    })

    return new Response(JSON.stringify(combinedUsers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error al obtener usuarios'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
