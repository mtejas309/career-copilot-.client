import { useState, useEffect, useRef } from 'react'
import { sendMessage, getChatHistory, clearChatHistory } from '../api/chat'
import { useAuth } from '../context/AuthContext'
import { m as motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import ProviderBadge from '../components/ProviderBadge'

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-sm mr-3 shrink-0 mt-0.5">
          ⚡
        </div>
      )}
      <div className="flex flex-col items-start max-w-[75%]">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed w-full ${
            isUser
              ? 'bg-violet-600 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
          }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                code: ({ inline, children }) =>
                  inline
                    ? <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                    : <pre className="bg-gray-200 dark:bg-gray-700 rounded p-2 text-xs font-mono overflow-x-auto my-2"><code>{children}</code></pre>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:opacity-80">{children}</a>
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && msg.provider && <ProviderBadge provider={msg.provider} />}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm ml-3 shrink-0 mt-0.5">
          👤
        </div>
      )}
    </motion.div>
  )
}

const STARTER_PROMPTS = [
  'What should I focus on this week?',
  'Review my roadmap progress',
  'What are my biggest skill gaps?',
  'Suggest resources for my goal',
]

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const bottomRef = useRef()

  useEffect(() => {
    getChatHistory()
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]))
      .finally(() => setHistoryLoading(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content, id: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await sendMessage(content)
      setMessages((prev) => [...prev, res.data])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', id: Date.now() + 1 },
      ])
    } finally {
      setLoading(false)
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

  const isEmpty = !historyLoading && messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-700 rounded-full flex items-center justify-center">
            <span>⚡</span>
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm">AI Career Mentor</p>
            <p className="text-green-500 dark:text-green-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
              Online · Remembers your history
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {historyLoading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-gray-900 dark:text-white font-semibold text-xl mb-2">
              Hey {user?.name?.split(' ')[0] || 'there'}, I&apos;m your AI Career Mentor
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-8">
              I know your resume, skills, roadmap, and goals. Ask me anything — I remember our conversations.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTER_PROMPTS.map((p, i) => (
                <motion.button
                  key={p}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleSend(p)}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  {p}
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
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-sm mr-3 shrink-0">
              ⚡
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your career mentor anything…"
            rows={1}
            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500 transition-colors"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition-colors shrink-0"
          >
            <span className="text-lg">→</span>
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-600 text-xs text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
