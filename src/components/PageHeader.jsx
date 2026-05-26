export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}
