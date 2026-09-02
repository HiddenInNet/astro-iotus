import { supabase } from '@/lib/supabase'

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
