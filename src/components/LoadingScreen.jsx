export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-2 border-gray-800 flex items-center justify-center">
          {/* Spinning arc */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-500/50 animate-spin" />
          {/* Icon */}
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
        </div>
      </div>

      <h2 className="text-white font-semibold text-lg mb-2">CareerCopilot</h2>
      <p className="text-gray-500 text-sm">Loading your workspace…</p>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
