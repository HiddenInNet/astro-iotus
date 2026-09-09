import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData()
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email y contraseña requeridos' }),
      { status: 400 }
    )
  }

  const supabase = createSupabaseServerClient(context)
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }

  return context.redirect('/')
}
