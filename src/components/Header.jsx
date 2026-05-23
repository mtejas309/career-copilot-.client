import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell } from 'lucide-react'

const PAGE_META = {
  '/dashboard':         { title: 'Dashboard',       subtitle: 'Welcome back' },
  '/dashboard/resume':  { title: 'Resume Analysis', subtitle: 'AI-powered insights from your resume' },
  '/dashboard/roadmap': { title: 'Career Roadmap',  subtitle: 'Your personalized weekly learning plan' },
  '/dashboard/chat':    { title: 'AI Mentor',        subtitle: 'Your career mentor remembers everything' },
  '/dashboard/profile': { title: 'My Profile',      subtitle: 'Keep your info updated for better AI recommendations' },
  '/dashboard/admin':   { title: 'Admin Panel',     subtitle: 'Manage users and monitor platform usage' },
}

export default function Header() {
  const { user } = useAuth()
  const { pathname } = useLocation()

  const meta = PAGE_META[pathname] || { title: 'Dashboard', subtitle: '' }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        {/* Page title */}
        <div>
          <h1 className="text-white font-bold text-lg leading-none">{meta.title}</h1>
          {meta.subtitle && (
            <p className="text-gray-500 text-xs mt-1">{meta.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-2.5 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
          <div className="w-7 h-7 bg-linear-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
            {user?.role === 'admin' && (
              <p className="text-violet-400 text-xs mt-0.5">Admin</p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
