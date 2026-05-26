import { m as motion } from 'framer-motion'
import { getCareerPath } from '../api/agents'
import Tag from '../components/Tag'
import PageHeader from '../components/PageHeader'
import ProviderBadge from '../components/ProviderBadge'
import { useAsync } from '../hooks/useAsync'

function MatchBar({ pct }) {
  const color = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Match</span>
        <span className="text-gray-300 font-semibold">{pct}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function JobCard({ job, variant }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-gray-900 dark:text-white font-semibold text-sm">{job.title}</p>
        <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
          {job.salaryRange}
        </span>
      </div>

      <MatchBar pct={job.matchPercentage} />

      {variant === 'now' && (
        <div className="space-y-2">
          {job.userHas?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.userHas.map((s) => (
                <Tag key={s} label={s} colorClass="bg-green-900/40 border-green-700 text-green-300" />
              ))}
            </div>
          )}
          {job.userMissing?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.userMissing.map((s) => (
                <Tag key={s} label={s} colorClass="bg-red-900/40 border-red-700 text-red-300" />
              ))}
            </div>
          )}
        </div>
      )}

      {variant !== 'now' && job.whatToComplete?.length > 0 && (
        <ul className="space-y-1">
          {job.whatToComplete.map((item, i) => (
            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
              <span className="text-violet-400 shrink-0 mt-0.5">→</span> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Column({ title, badge, jobs, variant, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex-1 min-w-0"
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm">{title}</h3>
        <span className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{badge}</span>
      </div>
      <div className="space-y-3">
        {jobs?.map((job, i) => (
          <JobCard key={i} job={job} variant={variant} />
        ))}
      </div>
    </motion.div>
  )
}

export default function CareerPath() {
  const { data, loading, error } = useAsync(getCareerPath)

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Mapping your career trajectory…</p>
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
    <div className="p-8 max-w-5xl space-y-6">
      <PageHeader title="Career Path" subtitle="Your personalised career trajectory from now to senior level." />

      {/* Level chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <span className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full font-medium">
          Current: <span className="text-white">{data.currentLevel}</span>
        </span>
        <span className="text-gray-600">→</span>
        <span className="text-xs bg-violet-900/40 border border-violet-700 text-violet-200 px-3 py-1.5 rounded-full font-medium">
          Target: <span className="text-white">{data.targetRole}</span>
        </span>
        <ProviderBadge provider={data.provider} prefix="via" />
      </motion.div>

      {/* 3 columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Column title="Now" badge="Available today" jobs={data.now} variant="now" delay={0.1} />
        <div className="hidden lg:block w-px bg-gray-800" />
        <Column title="In 4 Weeks" badge="After roadmap" jobs={data.inFourWeeks} variant="later" delay={0.18} />
        <div className="hidden lg:block w-px bg-gray-800" />
        <Column title="In 3 Months" badge="Senior path" jobs={data.inThreeMonths} variant="later" delay={0.26} />
      </div>

      {/* Salary growth timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
      >
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Salary Growth</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {data.salaryGrowth.split('→').map((seg, i, arr) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-green-300 font-semibold text-sm">{seg.trim()}</span>
              {i < arr.length - 1 && <span className="text-gray-600">→</span>}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Advice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="bg-violet-950 border border-violet-800 rounded-2xl p-6"
      >
        <h3 className="text-violet-300 text-xs font-medium uppercase tracking-wide mb-3">AI Advice</h3>
        <p className="text-violet-100 text-sm leading-relaxed">{data.advice}</p>
      </motion.div>
    </div>
  )
}
