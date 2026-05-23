import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { m as motion } from 'framer-motion'
import { useMotion } from '../hooks/useMotion'

const cards = [
  {
    to: '/dashboard/resume',
    icon: '📄',
    label: 'Resume Analysis',
    desc: 'Upload your resume and get AI-powered insights on skills, gaps, and career recommendations.',
    cta: 'Analyze Resume',
    color: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
    badge: null,
  },
  {
    to: '/dashboard/roadmap',
    icon: '🗺️',
    label: 'Career Roadmap',
    desc: 'View your personalized learning roadmap with weekly goals, resources, and projects.',
    cta: 'View Roadmap',
    color: 'border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
    badge: null,
  },
  {
    to: '/dashboard/chat',
    icon: '💬',
    label: 'AI Career Mentor',
    desc: 'Chat with your AI mentor who knows your goals, progress, and career history.',
    cta: 'Open Chat',
    color: 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600',
    badge: 'AI',
  },
  {
    to: '/dashboard/profile',
    icon: '👤',
    label: 'My Profile',
    desc: 'Update your skills, career goals, salary expectations, and study hours.',
    cta: 'Edit Profile',
    color: 'border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600',
    badge: null,
  },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const { fadeUp, slideIn, stagger, interactive, springs, reduced } = useMotion()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="p-8">
      <motion.div {...fadeUp(0, 'header')} className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">
          Hey {firstName} 👋 — your AI career copilot is ready. Here&apos;s what you can do today.
        </p>
      </motion.div>

      <motion.div
        {...slideIn('left', 0.08)}
        className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 mb-10 flex items-start gap-4"
      >
        <span className="text-2xl shrink-0">⚡</span>
        <div>
          <p className="text-violet-700 dark:text-violet-200 font-medium">Get started: Upload your resume</p>
          <p className="text-violet-500 dark:text-violet-400 text-sm mt-1">
            Upload your resume first — your AI mentor will extract your profile and build your personalized roadmap automatically.
          </p>
          <Link to="/dashboard/resume" className="inline-block mt-3 text-violet-600 dark:text-violet-300 hover:text-violet-800 dark:hover:text-white text-sm font-medium underline underline-offset-2 transition-colors">
            Upload resume →
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={{ animate: reduced ? {} : { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {cards.map((card) => (
          <motion.div
            key={card.to}
            variants={{
              initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 },
              animate: { opacity: 1, y: 0, transition: springs.card },
            }}
            whileHover={reduced ? {} : { y: -4, transition: springs.card }}
            whileTap={reduced ? {} : { scale: 0.98 }}
          >
            <Link
              to={card.to}
              className={`bg-white dark:bg-gray-900 border ${card.color} rounded-2xl p-6 transition-colors group block`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{card.icon}</span>
                {card.badge && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                    {card.badge}
                  </span>
                )}
              </div>
              <h2 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">{card.label}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{card.desc}</p>
              <span className="text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 text-sm font-medium transition-colors">
                {card.cta} →
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
