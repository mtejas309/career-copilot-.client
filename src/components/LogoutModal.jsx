import { m as motion } from 'framer-motion'
import { useMotion } from '../hooks/useMotion'

export default function LogoutModal({ onConfirm, onCancel }) {
  const { scaleIn, fadeIn } = useMotion()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        {...fadeIn(0)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      <motion.div
        {...scaleIn(0)}
        className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
      >
        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">👋</span>
        </div>

        <h2 className="text-gray-900 dark:text-white font-bold text-xl text-center mb-2">Log out?</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-8">
          You'll need to sign in again to access your career dashboard and AI mentor.
        </p>

        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors">
            Yes, log me out
          </button>
          <button onClick={onCancel} className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}
