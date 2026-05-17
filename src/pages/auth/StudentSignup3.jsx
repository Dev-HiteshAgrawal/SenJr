import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { GraduationCap, Loader, Target, BookOpen, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { updateDocument } from '../../firebase/firestore'
import StepProgress from '../../components/auth/StepProgress'

const StudentSignup3 = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    learningGoal: '',
    weeklyHours: '',
    preferredSessionLength: '60',
    currentSkillLevel: 'beginner'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
        learningGoal: formData.learningGoal,
        weeklyHours: formData.weeklyHours,
        preferredSessionLength: formData.preferredSessionLength,
        currentSkillLevel: formData.currentSkillLevel
      })
      toast.success('Learning preferences saved!')
      navigate('/student/signup/step4')
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
            <p className="text-gray-500 mt-2">Step 3: Learning Goals</p>
          </div>

          <StepProgress currentStep={3} totalSteps={4} labels={['Basic', 'Education', 'Goals', 'Complete']} />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 mr-2 text-primary-500" />
                Primary Learning Goal *
              </label>
              <textarea
                name="learningGoal"
                value={formData.learningGoal}
                onChange={handleChange}
                placeholder="What do you want to achieve?"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-primary-500" />
                Weekly Study Hours *
              </label>
              <select
                name="weeklyHours"
                value={formData.weeklyHours}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select hours</option>
                <option value="1-3">1-3 hours</option>
                <option value="4-7">4-7 hours</option>
                <option value="8-12">8-12 hours</option>
                <option value="13+">13+ hours</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 mr-2 text-primary-500" />
                Current Skill Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, currentSkillLevel: level }))}
                    className={`py-2 px-3 rounded-lg border text-sm capitalize transition-colors ${
                      formData.currentSkillLevel === level
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 text-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {level}
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

export default StudentSignup3