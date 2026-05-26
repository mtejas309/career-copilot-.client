import { m as motion } from 'framer-motion'
import { getJobReadiness } from '../api/agents'
import Tag from '../components/Tag'
import PageHeader from '../components/PageHeader'
import { useAsync } from '../hooks/useAsync'

function CircleProgress({ score }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} stroke="#1f2937" strokeWidth="10" fill="none" />
        <circle
          cx="72" cy="72" r={r}
          stroke={color} strokeWidth="10" fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="text-center">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="block text-xs text-gray-400 mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

function VerdictBadge({ verdict }) {
  const map = {
    'Ready': 'bg-green-900/40 border-green-700 text-green-300',
    'Almost Ready': 'bg-yellow-900/40 border-yellow-700 text-yellow-300',
    'Not Ready': 'bg-red-900/40 border-red-700 text-red-300',
  }
  return (
    <span className={`border text-sm px-3 py-1 rounded-full font-semibold ${map[verdict] ?? map['Not Ready']}`}>
      {verdict}
    </span>
  )
}

export default function JobReadiness() {
  const { data, loading, error } = useAsync(getJobReadiness)

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Analyzing your job readiness…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <PageHeader title="Job Readiness" subtitle="How ready are you to land your next role right now." />

      {/* Score + Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8"
      >
        <CircleProgress score={data.readinessScore} />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <VerdictBadge verdict={data.verdict} />
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{data.summary}</p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <span className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full">
              Ready in: <span className="text-white font-semibold">{data.readyIn}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Skills columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Current Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.currentSkills.map((s) => (
              <Tag key={s} label={s} colorClass="bg-green-900/40 border-green-700 text-green-300" />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.missingSkills.map((s) => (
              <Tag key={s} label={s} colorClass="bg-red-900/40 border-red-700 text-red-300" />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Goals progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Roadmap Progress</h3>
          <span className="text-xs text-gray-400">{data.completedGoals} / {data.completedGoals + data.pendingGoals} goals</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-violet-500 h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${data.progressPercentage}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">{data.progressPercentage}% complete</p>
      </motion.div>

      {/* Can Apply For */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
      >
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Can Apply For Now</h3>
        <ul className="space-y-2">
          {data.canApplyFor.map((title, i) => (
            <li key={i} className="flex items-center gap-2 text-green-300 text-sm">
              <span className="text-green-400">✓</span> {title}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Top Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-violet-950 border border-violet-800 rounded-2xl p-6"
      >
        <h3 className="text-violet-300 text-xs font-medium uppercase tracking-wide mb-4">Top 3 Actions</h3>
        <ol className="space-y-3">
          {data.topActions.map((action, i) => (
            <li key={i} className="flex items-start gap-3 text-violet-200 text-sm">
              <span className="shrink-0 w-6 h-6 bg-violet-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </span>
              {action}
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  )
}
