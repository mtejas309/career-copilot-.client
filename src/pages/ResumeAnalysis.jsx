import { useState, useRef } from 'react'
import { uploadResume, getResumeAnalysis } from '../api/resume'
import { m as motion } from 'framer-motion'

function Tag({ label, colorClass }) {
  return (
    <span className={`inline-block border text-xs px-2.5 py-1 rounded-full font-medium ${colorClass}`}>
      {label}
    </span>
  )
}

export default function ResumeAnalysis() {
  const [analysis, setAnalysis] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX file.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await uploadResume(formData)
      setAnalysis(res.data.analysisJson)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-gray-500 dark:text-gray-400">Upload your resume and get AI-powered career insights instantly.</p>
      </div>

      {/* Upload Zone */}
      {!analysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
              : 'border-gray-300 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 bg-white dark:bg-gray-900'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Analyzing your resume with AI…</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">This may take 15–30 seconds</p>
            </div>
          ) : (
            <>
              <div className="text-5xl mb-4">📄</div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Drop your resume here</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">or click to browse files</p>
              <span className="text-xs text-gray-400 dark:text-gray-600">Supports PDF and DOCX · Max 10 MB</span>
            </>
          )}
        </motion.div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Results</h2>
            <button
              onClick={() => { setAnalysis(null); setError('') }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
            >
              Upload New Resume
            </button>
          </div>

          {analysis.experience && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">Experience</h3>
              <p className="text-gray-900 dark:text-white leading-relaxed">{analysis.experience}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.skills?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Skills Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((s) => (
                    <Tag key={s} label={s} colorClass="bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" />
                  ))}
                </div>
              </div>
            )}

            {analysis.missingSkills?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Skill Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((s) => (
                    <Tag key={s} label={s} colorClass="bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.strengths?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-green-600 dark:text-green-300 text-sm flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.weaknesses?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-4">Areas to Improve</h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-yellow-600 dark:text-yellow-300 text-sm flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">△</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {analysis.recommendations?.length > 0 && (
            <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-6">
              <h3 className="text-violet-600 dark:text-violet-300 text-xs font-medium uppercase tracking-wide mb-4">AI Career Recommendations</h3>
              <ul className="space-y-3">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="text-violet-700 dark:text-violet-200 text-sm flex items-start gap-2">
                    <span className="text-violet-400 mt-0.5 shrink-0">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
