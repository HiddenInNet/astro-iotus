import React, { useState, type FormEventHandler } from 'react'

export interface UserToEdit {
  id: string
  email: string
  full_name: string | null
  roles: string[]
}

interface EditUserModalProps {
  user: UserToEdit
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AVAILABLE_ROLES = ['ADMIN', 'MEMBER', 'USER']

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [fullName, setFullName] = useState(user.full_name || '')
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || [])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  // Alternar selección de roles
  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          fullName,
          roles: selectedRoles,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar los cambios')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono text-black">
      <div className="w-full max-w-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
          <div>
            <span className="inline-block border-2 border-black bg-yellow-300 px-2 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              EDICIÓN RÁPIDA
            </span>
            <h2 className="mt-1 text-xl font-black uppercase">GESTIONAR USUARIO</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="border-2 border-black bg-red-400 px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Lectura) */}
          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-600">
              Correo (No editable)
            </label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full border-3 border-black bg-slate-200 p-2.5 text-xs font-bold text-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed"
            />
          </div>

          {/* Nombre Completo */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-xs font-black uppercase">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nombre del usuario"
              className="w-full border-3 border-black bg-slate-100 p-2.5 text-xs font-bold placeholder-slate-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Asignación de Roles */}
          <div>
            <label className="mb-1 block text-xs font-black uppercase">
              Roles Asignados (`user_roles`)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role)
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleToggle(role)}
                    className={`border-3 border-black px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-lime-300 translate-x-0.5 translate-y-0.5 shadow-none'
                        : 'bg-slate-100 hover:bg-yellow-300'
                    }`}
                  >
                    {isSelected ? `✓ ${role}` : `+ ${role}`}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="border-3 border-black bg-red-400 p-3 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="mt-6 flex gap-3 border-t-4 border-black pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border-3 border-black bg-slate-200 py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 border-3 border-black bg-cyan-400 py-2.5 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS ➔'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}