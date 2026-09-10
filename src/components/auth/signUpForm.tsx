import { useState, type SubmitEvent } from 'react'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      // 2. Enviar datos vía fetch al Endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      })

      const { message }: { message: string } = await response.json()

      if (!response.ok) {
        const msg = message?.includes('User already registered')
          ? 'El correo ya se encuentra registrado. Intenta iniciar sesión.'
          : message || 'Error al procesar el registro.'

        setErrorMessage(msg)
      } else {
        window.location.href = '/perfil?updated=true'
      }
    } catch (err) {
      setErrorMessage('Error de conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-6 border-b-4 border-black pb-4 text-center">
          <span className="inline-block border-2 border-black bg-yellow-300 px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            NUEVA CUENTA
          </span>
          <h1 className="mt-2 text-3xl font-black uppercase">REGISTRARSE</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-black uppercase"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@iotus.com"
              className="w-full border-4 border-black bg-slate-100 p-3 text-sm font-bold placeholder-slate-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-black uppercase"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-4 border-black bg-slate-100 p-3 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-xs font-black uppercase"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-4 border-black bg-slate-100 p-3 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full cursor-pointer border-4 border-black bg-lime-300 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-300 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
          >
            {loading ? 'CARGANDO...' : 'CREAR CUENTA ➔'}
          </button>
        </form>

        <div className="mt-6 border-t-4 border-black pt-6 text-center">
          <p className="mb-3 text-xs font-bold uppercase">
            ¿Ya tienes una cuenta?
          </p>
          <a
            href="/login"
            className="inline-block w-full border-4 border-black bg-yellow-300 py-2.5 text-center text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-pink-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            INICIAR SESIÓN ➔
          </a>
        </div>
      </div>

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-2 flex items-center justify-between border-b-4 border-black pb-2">
              <span className="text-sm font-black uppercase">
                ⚠️ Error de Registro
              </span>
            </div>
            <p className="my-4 text-xs font-bold text-black uppercase">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage(null)}
              type="button"
              className="w-full cursor-pointer border-3 border-black bg-white py-2 text-xs font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}
    </>
  )
}
