import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

export const POST: APIRoute = async (context) => {
  const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    const { userId, fullName, roles } = await context.request.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Falta el ID de usuario' }), {
        status: 400,
      })
    }

    // 1. Actualizar metadatos en auth.users (Nombre)
    const { error: userError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { full_name: fullName },
      }
    )

    if (userError) throw userError

    // 2. Sincronizar roles en public.user_roles (Eliminar actuales e insertar los nuevos)
    const { error: deleteError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (deleteError) throw deleteError

    if (roles && roles.length > 0) {
      const newRoles = roles.map((roleId: string) => ({
        user_id: userId,
        role_id: roleId,
      }))

      const { error: insertError } = await supabaseAdmin
        .from('user_roles')
        .insert(newRoles)

      if (insertError) throw insertError
    }

    return new Response(
      JSON.stringify({ message: 'Usuario actualizado correctamente' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error al actualizar usuario'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
