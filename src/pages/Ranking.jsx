import NavBar from '../components/NavBar'

export default function Ranking() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm font-medium text-slate-700 mb-2">Ranking con amigos</p>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
          El ranking se activará cuando empieces a jugar duelos — esa parte la construimos en el
          siguiente paso del proyecto.
        </div>
      </main>
    </div>
  )
}
