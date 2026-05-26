import { Link } from 'react-router-dom'
import { m as motion } from 'framer-motion'
import { useMotion } from '../hooks/useMotion'

const coreFeatures = [
  { icon: '📄', title: 'Resume Analysis', desc: 'AI extracts your skills, spots gaps, and gives actionable recommendations in seconds.' },
  { icon: '🗺️', title: 'Personalized Roadmap', desc: 'Get a custom weekly learning plan built around your exact career goal and current skill set.' },
  { icon: '💬', title: 'AI Career Mentor', desc: 'Chat with a mentor that remembers your profile, roadmap, and every conversation.' },
  { icon: '👤', title: 'Smart Profile', desc: 'Everything — skills, interests, goals, study hours — feeds every AI feature automatically.' },
]

const agentFeatures = [
  {
    icon: '🎯',
    badge: 'Agent',
    title: 'Job Readiness Score',
    desc: 'See a real-time readiness score (0–100), the exact roles you can apply for today, and the top 3 actions to close the gap.',
  },
  {
    icon: '📅',
    badge: 'Agent',
    title: 'Daily Study Plan',
    desc: "Every morning, get a time-blocked schedule built from your pending goals and available study hours. No more guessing what to do.",
  },
  {
    icon: '🗺️',
    badge: 'Agent',
    title: 'Career Path Forecast',
    desc: 'See which jobs you can land now, in 4 weeks, and in 3 months — with salary growth projections at each stage.',
  },
  {
    icon: '🎤',
    badge: 'Agent',
    title: 'Mock Interview',
    desc: '5 AI-generated questions tailored to your role and weak areas. Get scored, get feedback, and practice until you\'re confident.',
  },
]

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up in seconds. No credit card required.' },
  { step: '02', title: 'Complete Profile + Upload Resume', desc: 'Tell us your goals, skills, and study hours. Drop your resume — AI builds the rest.' },
  { step: '03', title: 'Generate Your Roadmap', desc: 'One click. Get a full personalized learning roadmap with weekly goals and resources.' },
  { step: '04', title: 'Use Your AI Agents Daily', desc: 'Check your study plan every morning, track readiness weekly, practice interviews, chat with your mentor.' },
  { step: '05', title: 'Apply With Confidence', desc: 'When readiness hits 80%+ and your interview score is strong — you\'re ready.' },
]

export default function Landing() {
  const { fadeUp, fadeIn, scaleIn, slideIn, springs, reduced } = useMotion()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Navbar */}
      <motion.nav
        {...fadeIn(0)}
        className="border-b border-gray-200 dark:border-gray-800 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl">CareerCopilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...scaleIn(0.05)}
            className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-300 text-sm px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            Your personal AI career copilot
          </motion.div>

          <motion.h1
            {...fadeUp(0.1, 'hero')}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Upload resume.
            <br />
            <motion.span
              {...fadeUp(0.2, 'hero')}
              className="text-violet-600 dark:text-violet-400 inline-block"
            >
              Get your AI roadmap.
            </motion.span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.25, 'hero')}
            className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto mb-10"
          >
            CareerCopilot analyzes your resume, builds a personalized roadmap, and runs AI agents that
            score your readiness, plan your day, and prep you for interviews — all in one place.
          </motion.p>

          <motion.div
            {...fadeUp(0.32, 'hero')}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors w-full sm:w-auto">
              Start for free →
            </Link>
            <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 px-8 py-3.5 rounded-xl text-lg transition-colors w-full sm:w-auto">
              Log in
            </Link>
          </motion.div>
          <motion.p {...fadeUp(0.38, 'hero')} className="text-gray-400 dark:text-gray-600 text-sm mt-6">
            No credit card required · Takes 2 minutes
          </motion.p>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0, 'core')} className="text-center mb-14" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to accelerate your career</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Powered by AI. Built around your goals.</p>
          </motion.div>

          <motion.div
            variants={{ animate: reduced ? {} : { transition: { staggerChildren: 0.09 } } }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coreFeatures.map((f) => (
              <motion.div
                key={f.title}
                variants={{
                  initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 },
                  animate: { opacity: 1, y: 0, transition: springs.card },
                }}
                whileHover={reduced ? {} : { y: -5, transition: springs.card }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-violet-300 dark:hover:border-violet-800 transition-colors"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0, 'agents')} className="text-center mb-4" viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
              Autonomous AI Agents
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI that works for you —{' '}
              <span className="text-violet-600 dark:text-violet-400">not just with you</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              These agents read your profile, resume, and roadmap automatically. No prompting needed — just open and get insights.
            </p>
          </motion.div>

          <motion.div
            variants={{ animate: reduced ? {} : { transition: { staggerChildren: 0.1 } } }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {agentFeatures.map((f) => (
              <motion.div
                key={f.title}
                variants={{
                  initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 },
                  animate: { opacity: 1, y: 0, transition: springs.card },
                }}
                whileHover={reduced ? {} : { y: -4, transition: springs.card }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 rounded-2xl p-6 transition-colors flex gap-5"
              >
                <div className="text-4xl shrink-0">{f.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{f.title}</h3>
                    <span className="text-xs bg-violet-100 dark:bg-violet-900 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-medium">
                      {f.badge}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0, 'steps')} className="text-center mb-14" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">From zero to job-ready in days, not months.</p>
          </motion.div>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                {...slideIn('left', i * 0.08)}
                viewport={{ once: true }}
                className="flex items-start gap-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
              >
                <span className="text-violet-500 font-bold text-2xl font-mono shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <motion.div {...fadeUp(0, 'cta')} className="max-w-2xl mx-auto text-center" viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-6">Ready to take control of your career?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-10">
            Join professionals using AI to navigate their career path with clarity and confidence.
          </p>
          <Link to="/signup" className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors">
            Create your free account →
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 px-6 py-8 text-center text-gray-500 dark:text-gray-600 text-sm">
        <p>© 2025 CareerCopilot. Built to help you grow.</p>
      </footer>
    </div>
  )
}
