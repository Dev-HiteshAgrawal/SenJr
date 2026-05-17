import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { GraduationCap, Loader, Briefcase } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateDocument } from '../../firebase/firestore'
import { SUBJECTS, EDUCATION_LEVELS } from '../../utils/constants'
import StepProgress from '../../components/auth/StepProgress'

const MentorSignup2 = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    expertise: [],
    experience: '',
    hourlyRate: '',
    educationLevel: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(subject)
        ? prev.expertise.filter(s => s !== subject)
        : [...prev.expertise, subject]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in first')
      return navigate('/signup')
    }

    if (formData.expertise.length === 0) {
      toast.error('Please select at least one subject')
      return
    }

    setLoading(true)
    try {
      await updateDocument('users', user.uid, {
        title: formData.title,
        expertise: formData.expertise,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        educationLevel: formData.educationLevel
      })
      toast.success('Expertise saved!')
      navigate('/mentor/signup/step3')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <GraduationCap className="h-10 w-10 text-secondary-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Mentor Registration</h2>
            <p className="text-gray-500 mt-2">Step 2: Expertise</p>
          </div>

          <StepProgress currentStep={2} totalSteps={4} labels={['Basic', 'Expertise', 'Profile', 'Complete']} />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects You Can Teach *</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.slice(0, 8).map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.expertise.includes(subject)
                        ? 'bg-secondary-500 text-white border-secondary-500'
                        : 'border-gray-300 text-gray-600 hover:border-secondary-500'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                required
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹) *</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="e.g., 500"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              >
                <option value="">Select education</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-500 text-white py-3 rounded-xl font-medium hover:bg-secondary-600 transition-colors disabled:opacity-50 flex items-center justify-center mt-4"
            >
              {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Continue'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default MentorSignup2