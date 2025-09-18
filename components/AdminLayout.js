import Link from 'next/link'

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
          <Link href="/admin/clients" className="block hover:text-yellow-400">All Clients</Link>
          <Link href="/admin/renewals" className="block hover:text-yellow-400">6/8 Month Clients</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
