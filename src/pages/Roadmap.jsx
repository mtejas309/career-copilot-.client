import { useState, useEffect } from 'react'
import { getRoadmap, generateRoadmap, updateGoalStatus } from '../api/roadmap'

function WeekCard({ week, onToggleGoal }) {
  const completed = week.goals.filter((g) => g.completed).length
  const total = week.goals.length
  const progress = total ? Math.round((completed / total) * 100) : 0

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Week {week.weekNumber}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{week.theme}</p>
        </div>
        <span className="text-sm text-gray-400 font-mono">{completed}/{total}</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-5">
        <div
          className="bg-violet-500 h-1.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-3 mb-5">
        {week.goals.map((goal) => (
          <li key={goal.id} className="flex items-start gap-3">
            <button
              onClick={() => onToggleGoal(goal.id, goal.completed)}
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                goal.completed
                  ? 'bg-violet-600 border-violet-600'
                  : 'border-gray-600 hover:border-violet-500'
              }`}
            >
              {goal.completed && <span className="text-white text-xs">✓</span>}
            </button>
            <span className={`text-sm ${goal.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
              {goal.title}
            </span>
          </li>
        ))}
      </ul>

      {week.resources?.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">Resources</p>
          <div className="flex flex-wrap gap-2">
            {week.resources.map((r, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getRoadmap()
      .then((res) => setRoadmap(res.data))
      .catch(() => setRoadmap(null))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await generateRoadmap()
      setRoadmap(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate roadmap. Upload your resume first.')
    } finally {
      setGenerating(false)
    }
  }

  // Backend toggles completed — response returns updated goal
  const handleToggleGoal = async (goalId, currentCompleted) => {
    // optimistic update
    setRoadmap((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => ({
        ...w,
        goals: w.goals.map((g) =>
          g.id === goalId ? { ...g, completed: !currentCompleted } : g
        ),
      })),
    }))
    try {
      const res = await updateGoalStatus(goalId)
      // sync with actual server value
      setRoadmap((prev) => ({
        ...prev,
        weeks: prev.weeks.map((w) => ({
          ...w,
          goals: w.goals.map((g) => (g.id === goalId ? { ...g, ...res.data } : g)),
        })),
      }))
    } catch {
      // revert on failure
      setRoadmap((prev) => ({
        ...prev,
        weeks: prev.weeks.map((w) => ({
          ...w,
          goals: w.goals.map((g) =>
            g.id === goalId ? { ...g, completed: currentCompleted } : g
          ),
        })),
      }))
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-400">Your personalized weekly learning plan.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {generating ? 'Generating…' : roadmap ? 'Regenerate' : 'Generate Roadmap'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!roadmap && !generating && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="text-white font-semibold text-xl mb-3">No roadmap yet</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Upload your resume and complete your profile, then generate your personalized career roadmap.
          </p>
          <button
            onClick={handleGenerate}
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Generate My Roadmap →
          </button>
        </div>
      )}

      {generating && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Building your personalized roadmap…</p>
          <p className="text-gray-500 text-sm mt-2">This takes about 30 seconds</p>
        </div>
      )}

      {roadmap && (
        <>
          <div className="bg-violet-950 border border-violet-800 rounded-2xl p-6 mb-6">
            <h2 className="text-violet-200 font-semibold text-lg">{roadmap.title}</h2>
            {roadmap.goal && <p className="text-violet-400 text-sm mt-1">Goal: {roadmap.goal}</p>}
            {roadmap.duration && (
              <p className="text-violet-500 text-xs mt-2">{roadmap.duration} week plan</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.weeks?.map((week) => (
              <WeekCard key={week.id} week={week} onToggleGoal={handleToggleGoal} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
