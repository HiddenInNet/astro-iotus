import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '@/lib/supabase'

export const POST: APIRoute = async (context) => {
  const formData = await context.request.formData()
  const fullName = formData.get('fullName')?.toString().trim()
  const avatarFile = formData.get('avatarFile') as File | null

  const supabase = createSupabaseServerClient(context)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return context.redirect('/login')
  }

  let publicUrl = user.user_metadata?.avatar_url || null

  if (avatarFile && avatarFile.size > 0) {
    const oldAvatarUrl: string | undefined = user.user_metadata?.avatar_url

    if (
      oldAvatarUrl &&
      oldAvatarUrl.includes('/storage/v1/object/public/avatars/')
    ) {
      const oldPath = oldAvatarUrl.split(
        '/storage/v1/object/public/avatars/'
      )[1]

      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath])
      }
    }

    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const arrayBuffer = await avatarFile.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileBuffer, {
        contentType: avatarFile.type,
        upsert: true,
      })

    if (uploadError) {
      return context.redirect(
        '/perfil?error=' + encodeURIComponent(uploadError.message)
      )
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    publicUrl = urlData.publicUrl
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName || null,
      avatar_url: publicUrl,
    },
  })

  if (updateError) {
    return context.redirect(
      '/perfil?error=' + encodeURIComponent(updateError.message)
    )
  }

  return context.redirect('/perfil?updated=true')
}
