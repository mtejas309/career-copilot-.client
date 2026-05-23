import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Bell, Sun, Moon } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { useMotion } from '../hooks/useMotion'

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
  const { isDark, toggle } = useTheme()
  const { pathname } = useLocation()
  const { fadeUp, springs } = useMotion()

  const meta = PAGE_META[pathname] || { title: 'Dashboard', subtitle: '' }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <motion.header
      {...fadeUp(0, 'header')}
      className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0 transition-colors duration-300"
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg leading-none">{meta.title}</h1>
          {meta.subtitle && (
            <p className="text-gray-500 text-xs mt-1">{meta.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="w-9 h-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        <button className="w-9 h-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
          <div className="w-7 h-7 bg-linear-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-gray-900 dark:text-white text-sm font-medium leading-none">{user?.name}</p>
            {user?.role === 'admin' && (
              <p className="text-violet-600 dark:text-violet-400 text-xs mt-0.5">Admin</p>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
