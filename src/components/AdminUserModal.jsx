export default function AdminUserModal({ user, onClose, onDelete, onRoleToggle, actionLoading }) {
  const profile = user.profile
  const latestResume = user.resumes?.[0]
  const roadmap = user.roadmaps?.[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              user.role === 'admin'
                ? 'bg-violet-900/50 border-violet-700 text-violet-300'
                : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}>
              {user.role}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onRoleToggle(user.id, user.role)}
              disabled={actionLoading === `role-${user.id}`}
              className="flex-1 border border-blue-700 text-blue-400 hover:bg-blue-900/30 disabled:opacity-40 text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {actionLoading === `role-${user.id}` ? 'Updating…' : user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            </button>
            <button
              onClick={() => onDelete(user.id)}
              disabled={actionLoading === `delete-${user.id}`}
              className="flex-1 border border-red-800 text-red-400 hover:bg-red-900/30 disabled:opacity-40 text-sm font-medium py-2 rounded-lg transition-colors"
            >
              {actionLoading === `delete-${user.id}` ? 'Deleting…' : 'Delete User & Data'}
            </button>
          </div>

          {/* Account info */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-3">Account</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Joined</p>
                <p className="text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Role</p>
                <p className="text-gray-200 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Profile */}
          {profile && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-3">Profile</p>
              <div className="space-y-2 text-sm">
                {profile.education && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28 shrink-0">Education</span>
                    <span className="text-gray-200">{profile.education}</span>
                  </div>
                )}
                {profile.careerGoal && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28 shrink-0">Career Goal</span>
                    <span className="text-gray-200">{profile.careerGoal}</span>
                  </div>
                )}
                {profile.salaryGoal && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28 shrink-0">Salary Goal</span>
                    <span className="text-gray-200">{profile.salaryGoal.toLocaleString()}</span>
                  </div>
                )}
                {profile.dailyStudyHours && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28 shrink-0">Study Hours</span>
                    <span className="text-gray-200">{profile.dailyStudyHours} hrs/day</span>
                  </div>
                )}
                {profile.skills?.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28 shrink-0">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.map((s) => (
                        <span key={s} className="text-xs bg-violet-900/40 border border-violet-800 text-violet-300 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.interests?.length > 0 && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28 shrink-0">Interests</span>
                    <span className="text-gray-200">{profile.interests.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Latest Resume Analysis */}
          {latestResume?.analysisJson && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-3">Latest Resume Analysis</p>
              <div className="space-y-3 text-sm">
                {latestResume.analysisJson.skills?.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {latestResume.analysisJson.skills.map((s) => (
                        <span key={s} className="text-xs bg-blue-900/40 border border-blue-800 text-blue-300 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {latestResume.analysisJson.missingSkills?.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Skill Gaps</p>
                    <div className="flex flex-wrap gap-1">
                      {latestResume.analysisJson.missingSkills.map((s) => (
                        <span key={s} className="text-xs bg-red-900/40 border border-red-800 text-red-300 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {latestResume.analysisJson.recommendations?.length > 0 && (
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Recommendations</p>
                    <ul className="space-y-1">
                      {latestResume.analysisJson.recommendations.map((r, i) => (
                        <li key={i} className="text-gray-300 flex gap-2">
                          <span className="text-violet-400 shrink-0">→</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Roadmap */}
          {roadmap && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-3">Roadmap</p>
              <p className="text-white font-medium text-sm mb-1">{roadmap.title}</p>
              <p className="text-gray-400 text-xs mb-3">{roadmap.goal} · {roadmap.duration} weeks</p>
              <div className="space-y-2">
                {roadmap.weeks?.map((w) => {
                  const done = w.goals.filter((g) => g.completed).length
                  const total = w.goals.length
                  return (
                    <div key={w.weekNumber} className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs w-14 shrink-0">Week {w.weekNumber}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-violet-500 h-1.5 rounded-full"
                          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs w-10 text-right">{done}/{total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!profile && !latestResume && !roadmap && (
            <p className="text-gray-500 text-sm text-center py-4">This user hasn't set up their profile yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
