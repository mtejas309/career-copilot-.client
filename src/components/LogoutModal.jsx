export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        {/* Icon */}
        <div className="w-14 h-14 bg-red-900/40 border border-red-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">👋</span>
        </div>

        <h2 className="text-white font-bold text-xl text-center mb-2">Log out?</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          You'll need to sign in again to access your career dashboard and AI mentor.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Yes, log me out
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
