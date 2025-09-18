export default function Header({ title }) {
  return (
    <header className="w-full py-6 px-6 bg-gradient-to-r from-black/40 to-black/10 border-b border-white/5">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-bold shadow-2xl">CS</div>
        <h1 className="text-xl font-semibold text-white">{title || 'Chimney Solutions'}</h1>
      </div>
    </header>
  )
}
