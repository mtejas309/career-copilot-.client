import Sidebar from './Sidebar'
import AiPanel from './AiPanel'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarProvider, useSidebar } from '../context/SidebarContext'

const HIDE_AI_PANEL = ['/dashboard/chat']

function Layout() {
  const { collapsed } = useSidebar()
  const location = useLocation()
  const showPanel = !HIDE_AI_PANEL.includes(location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        } ${showPanel ? 'mr-80' : ''}`}
      >
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      {showPanel && <AiPanel />}
    </div>
  )
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  )
}
