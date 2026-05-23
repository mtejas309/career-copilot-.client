function Bone({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
      <Bone className="h-8 w-8 rounded-xl" />
      <Bone className="h-5 w-2/5" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-4/5" />
      <Bone className="h-3 w-3/5" />
    </div>
  )
}

export function SkeletonWeekCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-4 w-20" />
          <Bone className="h-3 w-32" />
        </div>
        <Bone className="h-3 w-8" />
      </div>
      <Bone className="h-1.5 w-full rounded-full" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Bone className="h-5 w-5 rounded shrink-0" />
          <Bone className={`h-3 ${i === 2 ? 'w-3/5' : 'w-4/5'}`} />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <Bone className="h-5 w-16 rounded-full" />
        <Bone className="h-5 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Bone className="h-3 w-24" />
        <Bone className="h-7 w-7 rounded-lg" />
      </div>
      <Bone className="h-9 w-16" />
    </div>
  )
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800/50">
      <td className="px-6 py-4">
        <div className="space-y-2">
          <Bone className="h-3.5 w-32" />
          <Bone className="h-3 w-44" />
        </div>
      </td>
      <td className="px-6 py-4"><Bone className="h-5 w-14 rounded-full" /></td>
      <td className="px-6 py-4"><Bone className="h-3 w-5" /></td>
      <td className="px-6 py-4"><Bone className="h-3 w-5" /></td>
      <td className="px-6 py-4"><Bone className="h-3 w-8" /></td>
      <td className="px-6 py-4"><Bone className="h-3 w-20" /></td>
      <td className="px-6 py-4"><Bone className="h-3 w-28" /></td>
    </tr>
  )
}

export function SkeletonProfileSection() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4">
      <Bone className="h-4 w-24" />
      <Bone className="h-10 w-full rounded-lg" />
    </div>
  )
}

export function SkeletonChatMessage({ isUser = false }) {
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Bone className="w-7 h-7 rounded-lg shrink-0" />
      <Bone className={`h-8 rounded-2xl ${isUser ? 'w-40' : 'w-52'}`} />
    </div>
  )
}
