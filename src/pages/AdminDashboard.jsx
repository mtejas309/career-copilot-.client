import { useState, useEffect } from 'react'
import { getStats, getUsers, deleteUser, updateUserRole, getUserDetail } from '../api/admin'
import AdminUserModal from '../components/AdminUserModal'
import { m as motion } from 'framer-motion'
import { SkeletonStatCard, SkeletonTableRow } from '../components/Skeleton'

function StatCard({ label, value, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    Promise.all([getStats(), getUsers()])
      .then(([sRes, uRes]) => {
        setStats(sRes.data)
        setUsers(uRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleViewUser = async (id) => {
    setModalLoading(true)
    try {
      const res = await getUserDetail(id)
      setSelectedUser(res.data)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user and all their data? This cannot be undone.')) return
    setActionLoading(`delete-${id}`)
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      if (selectedUser?.id === id) setSelectedUser(null)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    setActionLoading(`role-${id}`)
    try {
      const res = await updateUserRole(id, newRole)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: res.data.role } : u)))
      if (selectedUser?.id === id) setSelectedUser((prev) => ({ ...prev, role: res.data.role }))
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded h-4 w-24" />
          </div>
          <table className="w-full">
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => <SkeletonTableRow key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage users and monitor platform usage.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Users" value={stats?.totalUsers} icon="👥" index={0} />
        <StatCard label="Resumes" value={stats?.totalResumes} icon="📄" index={1} />
        <StatCard label="Roadmaps" value={stats?.totalRoadmaps} icon="🗺️" index={2} />
        <StatCard label="Chat Messages" value={stats?.totalMessages} icon="💬" index={3} />
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white font-semibold">All Users</h2>
          <span className="text-gray-500 text-sm">{users.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left">
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">User</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Role</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Resumes</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Roadmaps</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Messages</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Joined</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      u.role === 'admin'
                        ? 'bg-violet-50 dark:bg-violet-900/50 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{u._count?.resumes ?? 0}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{u._count?.roadmaps ?? 0}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{u._count?.chatMessages ?? 0}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(u.id)}
                        disabled={modalLoading}
                        className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                      >
                        View
                      </button>
                      <span className="text-gray-300 dark:text-gray-700">·</span>
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={actionLoading === `role-${u.id}`}
                        className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 disabled:opacity-40 transition-colors"
                      >
                        {actionLoading === `role-${u.id}` ? '…' : u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <span className="text-gray-300 dark:text-gray-700">·</span>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={actionLoading === `delete-${u.id}`}
                        className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-40 transition-colors"
                      >
                        {actionLoading === `delete-${u.id}` ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {selectedUser && (
        <AdminUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={handleDelete}
          onRoleToggle={handleRoleToggle}
          actionLoading={actionLoading}
        />
      )}
    </div>
  )
}
