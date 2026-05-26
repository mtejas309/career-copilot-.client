export default function Tag({ label, colorClass }) {
  return (
    <span className={`inline-block border text-xs px-2.5 py-1 rounded-full font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
