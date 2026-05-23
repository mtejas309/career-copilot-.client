import { useState, useEffect, useRef } from 'react'
import { sendMessage, getChatHistory, clearChatHistory } from '../api/chat'
import { useAuth } from '../context/AuthContext'

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-sm mr-3 shrink-0 mt-0.5">
          ⚡
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-violet-600 text-white rounded-br-sm'
            : 'bg-gray-800 text-gray-200 rounded-bl-sm'
        }`}
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm ml-3 shrink-0 mt-0.5">
          👤
        </div>
      )}
    </div>
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
      // response is the assistant message object: { id, role, content, createdAt }
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
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-700 rounded-full flex items-center justify-center">
            <span>⚡</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Career Mentor</p>
            <p className="text-green-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
              Online · Remembers your history
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
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
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-white font-semibold text-xl mb-2">
              Hey {user?.name?.split(' ')[0] || 'there'}, I&apos;m your AI Career Mentor
            </h2>
            <p className="text-gray-400 text-sm max-w-sm mb-8">
              I know your resume, skills, roadmap, and goals. Ask me anything — I remember our conversations.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-full border border-gray-700 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={msg.id ?? i} msg={msg} />
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center text-sm mr-3 shrink-0">
              ⚡
            </div>
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-6 py-4 bg-gray-950">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your career mentor anything…"
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-violet-500 transition-colors"
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
        <p className="text-gray-600 text-xs text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
