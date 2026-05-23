import { useState, useEffect, useRef, memo } from 'react'
import { sendMessage, getChatHistory, clearChatHistory } from '../api/chat'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Trash2, Send } from 'lucide-react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { SkeletonChatMessage } from './Skeleton'
import { useMotion } from '../hooks/useMotion'

function Message({ msg }) {
  const isUser = msg.role === 'user'
  const { springs, reduced } = useMotion()
  return (
    <motion.div
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : springs.chat}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
        isUser ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}>
        {isUser ? 'U' : '⚡'}
      </div>

      <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
        isUser
          ? 'bg-violet-600 text-white rounded-tr-sm'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-tl-sm'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  )
}

const STARTERS = [
  'What should I focus on?',
  'Review my progress',
  'My skill gaps',
  'Suggest resources',
]

const AiPanel = memo(function AiPanel() {
  const { user } = useAuth()
  const { scaleIn, fadeUp, springs, reduced } = useMotion()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    getChatHistory()
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]))
      .finally(() => setHistoryLoaded(true))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    setMessages((prev) => [...prev, { role: 'user', content, id: Date.now() }])
    setLoading(true)

    try {
      const res = await sendMessage(content)
      setMessages((prev) => [...prev, res.data])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Try again.', id: Date.now() + 1 },
      ])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleClear = async () => {
    await clearChatHistory()
    setMessages([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const firstName = user?.name?.split(' ')[0] || 'there'
  const isEmpty = historyLoaded && messages.length === 0

  return (
    <div className="fixed top-0 right-0 h-screen w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col z-30 transition-colors duration-300">

      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-linear-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold leading-none">AI Mentor</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-500 dark:text-green-400 text-xs">Online</span>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!historyLoaded && (
          <div className="space-y-3 pt-2">
            <SkeletonChatMessage />
            <SkeletonChatMessage isUser />
            <SkeletonChatMessage />
            <SkeletonChatMessage isUser />
          </div>
        )}

        {isEmpty && (
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduced ? { duration: 0 } : springs.card}
            className="flex flex-col items-center text-center pt-6"
          >
            <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={22} className="text-violet-500 dark:text-violet-400" />
            </div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold mb-1">Hey {firstName}!</p>
            <p className="text-gray-500 text-xs leading-relaxed mb-5">
              I know your goals, skills, and roadmap. Ask me anything.
            </p>
            <div className="flex flex-col gap-2 w-full">
              {STARTERS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={reduced ? { duration: 0 } : { ...springs.card, delay: i * 0.06 }}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2.5 rounded-xl transition-all"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <Message key={msg.id ?? i} msg={msg} />
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 text-xs">⚡</div>
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-violet-500 rounded-xl px-3 py-2 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your mentor…"
            rows={1}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs resize-none focus:outline-none leading-relaxed"
            style={{ maxHeight: '80px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-7 h-7 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center shrink-0 transition-colors mb-0.5"
          >
            <Send size={12} />
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-600 text-xs text-center mt-1.5">Enter to send · Shift+Enter new line</p>
      </div>
    </div>
  )
})

export default AiPanel
