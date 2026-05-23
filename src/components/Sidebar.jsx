import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSidebar } from '../context/SidebarContext'
import LogoutModal from './LogoutModal'
import {
  LayoutDashboard, FileText, Map, MessageSquare,
  User, LogOut, Zap, ShieldCheck, ChevronLeft, ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard',       end: true  },
  { to: '/dashboard/resume',  icon: FileText,        label: 'Resume Analysis', end: false },
  { to: '/dashboard/roadmap', icon: Map,             label: 'Roadmap',         end: false },
  { to: '/dashboard/chat',    icon: MessageSquare,   label: 'AI Mentor',       end: false },
  { to: '/dashboard/profile', icon: User,            label: 'Profile',         end: false },
]

function NavItem({ to, icon: Icon, label, end, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
          collapsed ? 'justify-center' : ''
        } ${
          isActive
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
          {!collapsed && <span className="truncate">{label}</span>}
          {!collapsed && isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { collapsed, toggle } = useSidebar()
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const handleLogoutConfirm = () => { logout(); navigate('/') }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 flex flex-col z-40 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-800/80">
          <div className="w-8 h-8 bg-linear-to-br from-violet-500 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50 shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-36 opacity-100'}`}>
            <p className="text-white font-bold text-sm leading-none whitespace-nowrap">CareerCopilot</p>
            <p className="text-violet-400 text-xs mt-0.5 whitespace-nowrap">AI Career Assistant</p>
          </div>
        </div>

        {/* Floating toggle — sits on the right edge of the sidebar */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-[4.2rem] w-6 h-6 bg-gray-800 hover:bg-violet-600 border border-gray-700 hover:border-violet-500 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 shadow-md z-50"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <p className="text-gray-600 text-xs font-medium uppercase tracking-widest px-3 mb-3">
              Menu
            </p>
          )}

          {navItems.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} />
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="my-3 border-t border-gray-800" />
              {!collapsed && (
                <p className="text-gray-600 text-xs font-medium uppercase tracking-widest px-3 mb-3">
                  Admin
                </p>
              )}
              <NavItem to="/dashboard/admin" icon={ShieldCheck} label="Admin Panel" end={false} collapsed={collapsed} />
            </>
          )}
        </nav>

        {/* User + Logout */}
        <div className={`py-3 border-t border-gray-800 ${collapsed ? 'px-2' : 'px-3'}`}>
          {/* User card */}
          {collapsed ? (
            <div className="flex justify-center mb-2">
              <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center" title={user?.name}>
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-800/60 rounded-xl">
              <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
              {user?.role === 'admin' && (
                <span className="text-xs bg-violet-900/60 border border-violet-700 text-violet-300 px-1.5 py-0.5 rounded-md shrink-0">
                  Admin
                </span>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => setShowLogout(true)}
            title={collapsed ? 'Log out' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 w-full transition-all duration-150 group ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={17} className="shrink-0 group-hover:text-red-400 transition-colors" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {showLogout && (
        <LogoutModal onConfirm={handleLogoutConfirm} onCancel={() => setShowLogout(false)} />
      )}
    </>
  )
}
