import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getIsOpen, setIsOpen } from '@/lib/services/settings'

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient(context)
  
  // 1. Verificar sesión
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  // 2. Verificar rol ADMIN
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)

  const isAdmin = roles?.some((r) => r.role_id === 'ADMIN')
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Permisos insuficientes' }), { status: 403 })
  }

  // 3. Cambiar estado
  const currentState = await getIsOpen()
  const newState = !currentState
  await setIsOpen(newState)

  return new Response(JSON.stringify({ isOpen: newState }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}