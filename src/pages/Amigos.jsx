import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'

export default function Amigos() {
  const { perfil } = useAuth()
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [amigos, setAmigos] = useState([])
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarAmigos()
  }, [])

  async function cargarAmigos() {
    const { data } = await supabase
      .from('amistades')
      .select('id, estado, usuario_a, usuario_b, perfil_a:usuario_a(nombre), perfil_b:usuario_b(nombre)')
      .or(`usuario_a.eq.${perfil.id},usuario_b.eq.${perfil.id}`)
    setAmigos(data || [])
  }

  async function buscar(e) {
    e.preventDefault()
    if (!busqueda.trim()) return
    const { data } = await supabase
      .from('perfiles')
      .select('id, nombre')
      .ilike('nombre', `%${busqueda}%`)
      .neq('id', perfil.id)
      .limit(10)
    setResultados(data || [])
  }

  async function agregarAmigo(otroId) {
    const { error } = await supabase.from('amistades').insert({
      usuario_a: perfil.id,
      usuario_b: otroId,
      estado: 'pendiente',
    })
    if (error) setMensaje('No se pudo enviar la solicitud (quizás ya existe)')
    else {
      setMensaje('Solicitud enviada ✅')
      cargarAmigos()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm font-medium text-slate-700 mb-2">Buscar amigos</p>
        <form onSubmit={buscar} className="flex gap-2 mb-4">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre del amigo"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          <button className="bg-indigo-600 text-white text-sm px-4 rounded-lg">Buscar</button>
        </form>

        {mensaje && <p className="text-xs text-indigo-600 mb-3">{mensaje}</p>}

        {resultados.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {resultados.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-slate-700">{r.nombre}</span>
                <button
                  onClick={() => agregarAmigo(r.id)}
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-sm font-medium text-slate-700 mb-2">Mis amigos y solicitudes</p>
        <div className="flex flex-col gap-2">
          {amigos.length === 0 && <p className="text-sm text-slate-400">Aún no tienes amigos agregados.</p>}
          {amigos.map((a) => {
            const esA = a.usuario_a === perfil.id
            const nombreOtro = esA ? a.perfil_b?.nombre : a.perfil_a?.nombre
            return (
              <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-slate-700">{nombreOtro}</span>
                <span className="text-xs text-slate-400 capitalize">{a.estado}</span>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
