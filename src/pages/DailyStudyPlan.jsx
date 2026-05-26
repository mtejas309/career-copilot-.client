import { m as motion } from 'framer-motion'
import { getDailyPlan } from '../api/agents'
import PageHeader from '../components/PageHeader'
import ProviderBadge from '../components/ProviderBadge'
import { useAsync } from '../hooks/useAsync'

const typeStyles = {
  learn:    { badge: 'bg-blue-900/40 border-blue-700 text-blue-300',   dot: 'bg-blue-500',   line: 'border-blue-800' },
  practice: { badge: 'bg-violet-900/40 border-violet-700 text-violet-300', dot: 'bg-violet-500', line: 'border-violet-800' },
  review:   { badge: 'bg-orange-900/40 border-orange-700 text-orange-300', dot: 'bg-orange-500', line: 'border-orange-800' },
}

function TypeBadge({ type }) {
  const s = typeStyles[type] ?? typeStyles.learn
  return (
    <span className={`border text-xs px-2 py-0.5 rounded-full font-medium capitalize ${s.badge}`}>
      {type}
    </span>
  )
}

function TimeBlock({ block, index, total }) {
  const s = typeStyles[block.type] ?? typeStyles.learn
  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${s.dot}`} />
        {index < total - 1 && <div className={`w-px flex-1 mt-1 border-l border-dashed ${s.line}`} />}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 }}
        className="flex-1 pb-6"
      >
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gray-400 font-mono">{block.time}</span>
            <TypeBadge type={block.type} />
          </div>
          <p className="text-gray-900 dark:text-white font-semibold text-sm">{block.topic}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Goal: {block.goal}</p>
          {block.resource && (
            <p className="text-xs">
              <span className="text-gray-500">Resource: </span>
              <a
                href={block.resource.startsWith('http') ? block.resource : `https://${block.resource}`}
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2 break-all"
              >
                {block.resource}
              </a>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function DailyStudyPlan() {
  const { data, loading, error } = useAsync(getDailyPlan)

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Building your plan for today…</p>
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
    <div className="p-8 max-w-3xl space-y-6">
      <PageHeader title="Daily Study Plan" subtitle="Your personalised schedule for today." />
      {/* Date + hours */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full font-mono">
            {data.date}
          </span>
          <span className="text-xs bg-violet-900/40 border border-violet-700 text-violet-300 px-3 py-1 rounded-full">
            {data.totalHours}h total
          </span>
          <ProviderBadge provider={data.provider} prefix="via" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-3">{data.greeting}</h2>
      </motion.div>

      {/* Focus Goal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-violet-950 border border-violet-700 rounded-2xl p-5 flex items-start gap-3"
      >
        <span className="text-2xl shrink-0">🎯</span>
        <div>
          <p className="text-violet-300 text-xs font-medium uppercase tracking-wide mb-1">Today's Focus Goal</p>
          <p className="text-white font-semibold">{data.focusGoal}</p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
      >
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-5">Schedule</h3>
        {data.blocks.map((block, i) => (
          <TimeBlock key={i} block={block} index={i} total={data.blocks.length} />
        ))}
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-yellow-950 border border-yellow-800 rounded-2xl p-5 flex items-start gap-3"
      >
        <span className="text-xl shrink-0">💡</span>
        <div>
          <p className="text-yellow-300 text-xs font-medium uppercase tracking-wide mb-1">Tip</p>
          <p className="text-yellow-100 text-sm">{data.tip}</p>
        </div>
      </motion.div>

      {/* Estimated progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5"
      >
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">After Today</p>
        <p className="text-gray-900 dark:text-white text-sm">{data.estimatedProgress}</p>
      </motion.div>
    </div>
  )
}
