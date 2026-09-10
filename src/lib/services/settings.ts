import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export async function getIsOpen(): Promise<boolean> {
  try {
    let { data: open, error } = await supabase
      .from('settings')
      .select('name, value')
      .eq('name', 'isOpen')
      .single()

    return open?.value === 'true'
  } catch (error) {
    console.error('Error al obtener isOpen: ', error)
    return false
  }
}

const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function setIsOpen(isOpen: boolean): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('settings')
    .update({ value: isOpen })
    .eq('name', 'isOpen')

  if (error) {
    console.error('Error al actualizar el estado del departamento:', error)
    throw new Error(`No se pudo actualizar el estado: ${error.message}`)
  }

  return isOpen
}
