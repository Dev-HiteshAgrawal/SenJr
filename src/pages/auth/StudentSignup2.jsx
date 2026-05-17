import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { GraduationCap, Loader } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateDocument } from '../../firebase/firestore'
import { EDUCATION_LEVELS } from '../../utils/constants'
import StepProgress from '../../components/auth/StepProgress'

const StudentSignup2 = () => {
  const navigate = useNavigate()
  const { user, userData } = useAuth()

  const [formData, setFormData] = useState({
    educationLevel: '',
    institution: '',
    grade: '',
    subjects: []
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in first')
      return navigate('/signup')
    }

    setLoading(true)
    try {
      await updateDocument('users', user.uid, {
        educationLevel: formData.educationLevel,
        institution: formData.institution,
        grade: formData.grade,
        subjects: formData.subjects
      })
      toast.success('Education details saved!')
      navigate('/student/signup/step3')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <GraduationCap className="h-10 w-10 text-primary-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Student Registration</h2>
            <p className="text-gray-500 mt-2">Step 2: Education Details</p>
          </div>

          <StepProgress currentStep={2} totalSteps={4} labels={['Basic', 'Education', 'Goals', 'Complete']} />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level *</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select level</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="Enter your school/college"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Year</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g., 12th, 3rd Year"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Interested Subjects</label>
              <div className="flex flex-wrap gap-2">
                {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English'].map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.subjects.includes(subject)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 text-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center mt-4"
            >
              {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Continue'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentSignup2