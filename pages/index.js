import Link from 'next/link'
import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Header title="Chimney Solutions" />
      <main className="max-w-5xl mx-auto p-6">
        <section className="bg-white/5 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome — Chimney Solutions</h2>
          <p className="mb-6 text-white/80">Create technician reports, generate QR-based report cards, and manage customers from a professional CRM.</p>
          <div className="flex gap-4">
            <Link href="/technician" className="px-5 py-3 rounded-md bg-brand text-white font-semibold">
              Technician Form
            </Link>
            <Link href="/admin/login" className="px-5 py-3 rounded-md border border-white/10 text-white">
              Admin CRM
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
