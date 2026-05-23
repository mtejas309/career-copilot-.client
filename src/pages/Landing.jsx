import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Profile',
    desc: 'Upload your resume and let AI extract your skills, experience, and strengths automatically.',
  },
  {
    icon: '🗺️',
    title: 'Personalized Roadmap',
    desc: 'Get a custom learning roadmap with weekly goals, resources, and projects tailored to your career goal.',
  },
  {
    icon: '💬',
    title: 'AI Career Mentor',
    desc: 'Chat with an AI mentor who remembers your history, tracks progress, and guides your next steps.',
  },
  {
    icon: '📊',
    title: 'Resume Analysis',
    desc: 'Discover your skill gaps, strengths, weaknesses, and get actionable career recommendations.',
  },
]

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up in seconds. No lengthy forms.' },
  { step: '02', title: 'Upload Resume', desc: 'AI reads your resume and builds your profile automatically.' },
  { step: '03', title: 'Get Your Roadmap', desc: 'Receive a personalized career roadmap in minutes.' },
  { step: '04', title: 'Track & Grow', desc: 'Follow weekly goals, chat with your mentor, and level up.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl">CareerCopilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-950 border border-violet-800 text-violet-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            Your personal AI career copilot
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Upload resume.
            <br />
            <span className="text-violet-400">Get your AI roadmap.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
            CareerCopilot analyzes your resume, understands your goals, and builds a personalized career roadmap — with an AI mentor that remembers everything.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors w-full sm:w-auto"
            >
              Start for free →
            </Link>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-3.5 rounded-xl text-lg transition-colors w-full sm:w-auto"
            >
              Log in
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-6">No credit card required · Takes 2 minutes</p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to accelerate your career</h2>
            <p className="text-gray-400 text-lg">Powered by AI. Built around your goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-800 transition-colors"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400 text-lg">From zero to roadmap in minutes.</p>
          </div>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <span className="text-violet-500 font-bold text-2xl font-mono shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to take control of your career?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of professionals using AI to navigate their career path with confidence.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-sm">
        <p>© 2025 CareerCopilot. Built to help you grow.</p>
      </footer>
    </div>
  )
}
