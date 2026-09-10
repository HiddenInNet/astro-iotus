import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData()
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: 'Todos los campos son obligatorios.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createSupabaseServerClient(context)
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Registro exitoso.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}