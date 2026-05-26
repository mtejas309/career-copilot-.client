import { useState } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { startInterview, evaluateAnswer, getInterviewSummary } from '../api/agents'
import Tag from '../components/Tag'
import ProviderBadge from '../components/ProviderBadge'

function TypeBadge({ type }) {
  const map = {
    technical:  'bg-blue-900/40 border-blue-700 text-blue-300',
    behavioral: 'bg-violet-900/40 border-violet-700 text-violet-300',
    gap:        'bg-orange-900/40 border-orange-700 text-orange-300',
  }
  return <Tag label={type} colorClass={map[type] ?? map.technical} />
}

function GradeBadge({ score }) {
  const grade = score >= 9 ? 'A+' : score >= 8 ? 'A' : score >= 7 ? 'B+' : score >= 6 ? 'B' : score >= 5 ? 'C' : 'D'
  const color = score >= 7 ? 'bg-green-900/40 border-green-700 text-green-300' : score >= 5 ? 'bg-yellow-900/40 border-yellow-700 text-yellow-300' : 'bg-red-900/40 border-red-700 text-red-300'
  return <Tag label={grade} colorClass={color} />
}

// Step 1: Start screen
function StartScreen({ onStart, loading }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-96 text-center space-y-6 max-w-lg mx-auto">
      <div className="text-6xl">🎤</div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mock Interview</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          5 questions tailored to your target role. Get scored, get feedback, get hired.
        </p>
      </div>
      <button
        onClick={onStart}
        disabled={loading}
        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Starting…
          </>
        ) : 'Start Mock Interview'}
      </button>
    </div>
  )
}

// Step 2: Single question
function QuestionScreen({ session, qIndex, onNext, onFinish }) {
  const q = session.questions[qIndex]
  const [answer, setAnswer] = useState('')
  const [hintOpen, setHintOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await evaluateAnswer({ question: q.question, answer, role: session.role })
      setEvaluation(res.data)
      // record answer in parent
      onNext(q.question, answer, res.data, false)
    } catch {
      setError('Failed to evaluate answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    const isLast = qIndex === session.questions.length - 1
    onNext(q.question, answer, evaluation, true, isLast)
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Question {qIndex + 1} / {session.questions.length}</span>
        <div className="flex-1 bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((qIndex + 1) / session.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <motion.div
        key={qIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={q.type} />
          {q.topic && (
            <span className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-0.5 rounded-full">{q.topic}</span>
          )}
        </div>
        <p className="text-gray-900 dark:text-white text-base font-medium leading-relaxed">{q.question}</p>

        {q.hint && (
          <div>
            <button
              onClick={() => setHintOpen((p) => !p)}
              className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              {hintOpen ? 'Hide hint' : 'Show hint'}
            </button>
            {hintOpen && (
              <p className="mt-2 text-sm text-yellow-300 bg-yellow-950 border border-yellow-800 rounded-lg px-3 py-2">{q.hint}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Answer textarea */}
      {!evaluation && (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            rows={6}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting || !answer.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluating…
              </>
            ) : 'Submit Answer'}
          </button>
        </div>
      )}

      {/* Evaluation result */}
      {evaluation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Score */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-bold text-white">{evaluation.score}<span className="text-lg text-gray-400">/10</span></span>
              <GradeBadge score={evaluation.score} />
              <ProviderBadge provider={evaluation.provider} prefix="via" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{evaluation.feedback}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {evaluation.strengths?.length > 0 && (
              <div className="bg-green-950 border border-green-800 rounded-xl p-4">
                <p className="text-green-400 text-xs font-medium uppercase tracking-wide mb-2">Strengths</p>
                <ul className="space-y-1">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-green-200 text-xs flex items-start gap-1.5">
                      <span className="shrink-0 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.improvements?.length > 0 && (
              <div className="bg-orange-950 border border-orange-800 rounded-xl p-4">
                <p className="text-orange-400 text-xs font-medium uppercase tracking-wide mb-2">Improvements</p>
                <ul className="space-y-1">
                  {evaluation.improvements.map((s, i) => (
                    <li key={i} className="text-orange-200 text-xs flex items-start gap-1.5">
                      <span className="shrink-0 mt-0.5">△</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {evaluation.modelAnswer && (
            <div>
              <button
                onClick={() => setModelOpen((p) => !p)}
                className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
              >
                {modelOpen ? 'Hide model answer' : 'View model answer'}
              </button>
              {modelOpen && (
                <div className="mt-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 text-sm leading-relaxed">
                  {evaluation.modelAnswer}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            {qIndex === session.questions.length - 1 ? 'See Summary' : 'Next Question →'}
          </button>
        </motion.div>
      )}
    </div>
  )
}

// Step 3: Summary
function SummaryScreen({ summary, onRetake }) {
  const readyColor = summary.readyToInterview
    ? 'bg-green-900/40 border-green-700 text-green-300'
    : 'bg-red-900/40 border-red-700 text-red-300'

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center"
      >
        <p className="text-gray-400 text-sm mb-2">Overall Score</p>
        <p className="text-6xl font-bold text-white mb-1">{summary.overallScore}<span className="text-2xl text-gray-400">/10</span></p>
        <div className="flex justify-center items-center gap-2 mt-3 flex-wrap">
          <Tag label={summary.readyToInterview ? 'Ready to Interview ✓' : 'More Practice Needed'} colorClass={readyColor} />
          <ProviderBadge provider={summary.provider} prefix="via" />
        </div>
        <p className="text-gray-400 text-sm mt-4 leading-relaxed">{summary.summary}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summary.strongAreas?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-950 border border-green-800 rounded-xl p-5"
          >
            <p className="text-green-400 text-xs font-medium uppercase tracking-wide mb-3">Strong Areas</p>
            <div className="flex flex-wrap gap-2">
              {summary.strongAreas.map((s, i) => (
                <Tag key={i} label={s} colorClass="bg-green-900/40 border-green-700 text-green-300" />
              ))}
            </div>
          </motion.div>
        )}
        {summary.weakAreas?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-red-950 border border-red-800 rounded-xl p-5"
          >
            <p className="text-red-400 text-xs font-medium uppercase tracking-wide mb-3">Weak Areas</p>
            <div className="flex flex-wrap gap-2">
              {summary.weakAreas.map((s, i) => (
                <Tag key={i} label={s} colorClass="bg-red-900/40 border-red-700 text-red-300" />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {summary.recommendations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-violet-950 border border-violet-800 rounded-2xl p-6"
        >
          <p className="text-violet-300 text-xs font-medium uppercase tracking-wide mb-4">Top Recommendations</p>
          <ul className="space-y-2">
            {summary.recommendations.map((r, i) => (
              <li key={i} className="text-violet-200 text-sm flex items-start gap-2">
                <span className="text-violet-400 shrink-0 mt-0.5">→</span> {r}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <button
        onClick={onRetake}
        className="border border-gray-700 hover:border-violet-600 text-gray-300 hover:text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
      >
        Retake Interview
      </button>
    </div>
  )
}

export default function MockInterview() {
  const [step, setStep] = useState('start')   // 'start' | 'question' | 'summary'
  const [session, setSession] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState([])    // { question, answer }[]
  const [summary, setSummary] = useState(null)
  const [starting, setStarting] = useState(false)
  const [summarising, setSummarising] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    setStarting(true)
    setError('')
    try {
      const res = await startInterview()
      setSession(res.data)
      setAnswers([])
      setQIndex(0)
      setStep('question')
    } catch {
      setError('Failed to start interview. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  // called from QuestionScreen when navigating forward
  const handleNext = (question, answer, evaluation, advance, isLast) => {
    if (!advance) return  // just recording evaluation, not navigating yet
    const updated = [...answers, { question, answer }]
    setAnswers(updated)

    if (isLast) {
      fetchSummary(updated)
    } else {
      setQIndex((i) => i + 1)
    }
  }

  const fetchSummary = async (allAnswers) => {
    setSummarising(true)
    try {
      const res = await getInterviewSummary({
        questions: allAnswers.map((a) => a.question),
        answers: allAnswers.map((a) => a.answer),
      })
      setSummary(res.data)
      setStep('summary')
    } catch {
      setError('Failed to generate summary. Please try again.')
    } finally {
      setSummarising(false)
    }
  }

  const handleRetake = () => {
    setStep('start')
    setSession(null)
    setAnswers([])
    setQIndex(0)
    setSummary(null)
  }

  return (
    <div className="p-8 min-h-full">
      {error && (
        <div className="mb-4 bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg max-w-2xl">
          {error}
        </div>
      )}

      {summarising && (
        <div className="flex flex-col items-center justify-center gap-4 h-64">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Generating your interview summary…</p>
        </div>
      )}

      {!summarising && (
        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StartScreen onStart={handleStart} loading={starting} />
            </motion.div>
          )}
          {step === 'question' && session && (
            <motion.div key={`q-${qIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuestionScreen
                session={session}
                qIndex={qIndex}
                onNext={handleNext}
                onFinish={fetchSummary}
              />
            </motion.div>
          )}
          {step === 'summary' && summary && (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SummaryScreen summary={summary} onRetake={handleRetake} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
