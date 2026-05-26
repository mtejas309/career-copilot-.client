const PROVIDERS = {
  gemini:     { label: 'Gemini',     color: '#4285F4' },
  openrouter: { label: 'OpenRouter', color: '#7C3AED' },
  groq:       { label: 'Groq',       color: '#F97316' },
}

export default function ProviderBadge({ provider, prefix = 'Powered by' }) {
  const p = PROVIDERS[provider]
  if (!p) return null
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full opacity-60"
      style={{ backgroundColor: `${p.color}18`, color: p.color, border: `1px solid ${p.color}40` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
      {prefix} {p.label}
    </span>
  )
}
