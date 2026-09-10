import React, { useState, useEffect } from 'react'
import EditUserModal, {
  type UserToEdit,
} from '@/components/admin/EditUserModal'

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  roles: string[]
}

export default function UserMonitor() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<UserToEdit | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Error al cargar la lista de usuarios')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // Filtrado reactivo
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()))

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="w-full space-y-6 font-mono text-black">
      {/* Panel de Estadísticas Rápida */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-4 border-black bg-yellow-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs font-black uppercase">
            Total Usuarios
          </span>
          <span className="text-3xl font-black">{users.length}</span>
        </div>
        <div className="border-4 border-black bg-cyan-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs font-black uppercase">
            Filtro Activo
          </span>
          <span className="text-3xl font-black">{filteredUsers.length}</span>
        </div>
        <div className="border-4 border-black bg-lime-300 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="block text-xs font-black uppercase">
            Estado Sistema
          </span>
          <span className="text-xs font-black text-emerald-900 uppercase">
            ● EN LÍNEA / SYNC
          </span>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col gap-4 border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="BUSCAR POR EMAIL O NOMBRE..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-3 border-black bg-slate-100 p-2.5 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none md:max-w-md"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase">Rol:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="cursor-pointer border-3 border-black bg-yellow-300 p-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          >
            <option value="ALL">TODOS</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MEMBER">MEMBER</option>
            <option value="USER">USER</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="border-4 border-black bg-white p-8 text-center font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          Cargando base de datos de usuarios...
        </div>
      ) : error ? (
        <div className="border-4 border-black bg-red-400 p-6 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          ⚠️ {error}
        </div>
      ) : (
        <div className="overflow-x-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-4 border-black bg-pink-400 text-xs font-black uppercase">
                <th className="border-r-2 border-black p-3">Usuario</th>
                <th className="border-r-2 border-black p-3">Email</th>
                <th className="border-r-2 border-black p-3">Rol</th>
                <th className="border-r-2 border-black p-3">Fecha Registro</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-xs font-bold uppercase">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center font-black">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-slate-100"
                  >
                    <td className="flex items-center gap-3 border-r-2 border-black p-3 overflow-x-hidden">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt={u.full_name || 'Avatar'}
                          className="h-8 w-8 border-2 border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-yellow-300 font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {u.email[0].toUpperCase()}
                        </div>
                      )}
                      <span>{u.full_name || 'SIN NOMBRE'}</span>
                    </td>
                    <td className="border-r-2 border-black p-3">{u.email}</td>
                    <td className="border-r-2 border-black p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length > 0 ? (
                          u.roles.map((role) => (
                            <span
                              key={role}
                              className={`inline-block border-2 border-black px-2 py-0.5 text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                role === 'ADMIN'
                                  ? 'bg-red-400'
                                  : role === 'MEMBER'
                                    ? 'bg-lime-300'
                                    : 'bg-yellow-300'
                              }`}
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="inline-block border-2 border-black bg-slate-200 px-2 py-0.5 text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            SIN ROL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border-r-2 border-black p-3">
                      {new Date(u.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          setEditingUser({
                            id: u.id,
                            email: u.email,
                            full_name: u.full_name,
                            roles: u.roles,
                          })
                        }
                        className="cursor-pointer border-2 border-black bg-yellow-300 px-2 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      >
                        EDITAR
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {editingUser && (
            <EditUserModal
              user={editingUser}
              isOpen={Boolean(editingUser)}
              onClose={() => setEditingUser(null)}
              onSuccess={() => fetchUsers()}
            />
          )}
        </div>
      )}
    </div>
  )
}
