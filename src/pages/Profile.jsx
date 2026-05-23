import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../api/profile'
import { useAuth } from '../context/AuthContext'
import { m as motion } from 'framer-motion'
import { SkeletonProfileSection } from '../components/Skeleton'

const SKILL_SUGGESTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'TypeScript',
  'AWS', 'Docker', 'Machine Learning', 'Data Analysis', 'Java', 'Go',
]

export default function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: '',
    education: '',
    skills: [],
    interests: [],
    careerGoal: '',
    salaryGoal: '',
    dailyStudyHours: '',
  })
  const [skillInput, setSkillInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getProfile()
      .then((res) => {
        const d = res.data
        setForm({
          name: user?.name || '',
          education: d.education || '',
          skills: d.skills || [],
          interests: d.interests || [],
          careerGoal: d.careerGoal || '',
          salaryGoal: d.salaryGoal || '',
          dailyStudyHours: d.dailyStudyHours || '',
        })
      })
      .catch(() => setForm((prev) => ({ ...prev, name: user?.name || '' })))
      .finally(() => setLoading(false))
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const addTag = (field, value, setter) => {
    const v = value.trim()
    if (v && !form[field].includes(v)) {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], v] }))
    }
    setter('')
    setSaved(false)
  }

  const removeTag = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((s) => s !== value) }))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProfile({
        education: form.education,
        skills: form.skills,
        interests: form.interests,
        careerGoal: form.careerGoal,
        salaryGoal: form.salaryGoal ? Number(form.salaryGoal) : undefined,
        dailyStudyHours: form.dailyStudyHours ? Number(form.dailyStudyHours) : undefined,
      })
      setUser((prev) => ({ ...prev, name: form.name }))
      setSaved(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
  const cardClass = "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
  const headingClass = "text-gray-900 dark:text-white font-medium"

  if (loading) {
    return (
      <div className="p-8 max-w-2xl space-y-6">
        <SkeletonProfileSection />
        <SkeletonProfileSection />
        <SkeletonProfileSection />
        <SkeletonProfileSection />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-gray-500 dark:text-gray-400">Your AI mentor uses this to personalize everything. Keep it updated.</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 text-sm px-4 py-3 rounded-lg mb-6"
        >
          Profile saved successfully ✓
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={`${cardClass} space-y-5`}>
          <h2 className={headingClass}>Basic Info</h2>
          <div>
            <label className={labelClass}>Education</label>
            <input
              type="text"
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science, MIT"
              className={inputClass}
            />
          </div>
        </div>

        {/* Skills */}
        <div className={cardClass}>
          <h2 className={`${headingClass} mb-4`}>Current Skills</h2>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {form.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-violet-900/50 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-200 text-xs px-3 py-1.5 rounded-full">
                  {skill}
                  <button type="button" onClick={() => removeTag('skills', skill)} className="text-violet-400 hover:text-violet-700 dark:hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag('skills', skillInput, setSkillInput) } }}
            placeholder="Type a skill and press Enter"
            className={inputClass}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).slice(0, 8).map((s) => (
              <button key={s} type="button" onClick={() => addTag('skills', s, setSkillInput)} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className={cardClass}>
          <h2 className={`${headingClass} mb-4`}>Interests</h2>
          {form.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {form.interests.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-200 text-xs px-3 py-1.5 rounded-full">
                  {item}
                  <button type="button" onClick={() => removeTag('interests', item)} className="text-blue-400 hover:text-blue-700 dark:hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag('interests', interestInput, setInterestInput) } }}
            placeholder="e.g. AI, Web Dev, Open Source"
            className={inputClass}
          />
        </div>

        {/* Career Goals */}
        <div className={`${cardClass} space-y-5`}>
          <h2 className={headingClass}>Career Goals</h2>
          <div>
            <label className={labelClass}>Career Goal</label>
            <input
              type="text"
              name="careerGoal"
              value={form.careerGoal}
              onChange={handleChange}
              placeholder="e.g. Senior Full-Stack Engineer at a product company"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Salary Goal (₹ / $)</label>
              <input
                type="number"
                name="salaryGoal"
                value={form.salaryGoal}
                onChange={handleChange}
                placeholder="e.g. 1200000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Daily Study Hours</label>
              <select
                name="dailyStudyHours"
                value={form.dailyStudyHours}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                {[0.5, 1, 1.5, 2, 2.5, 3, 4, 5].map((h) => (
                  <option key={h} value={h}>{h} hr{h === 1 ? '' : 's'}/day</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
