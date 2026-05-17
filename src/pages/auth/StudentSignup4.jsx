import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { GraduationCap, CheckCircle, Loader, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import StepProgress from '../../components/auth/StepProgress'

const StudentSignup4 = () => {
  const navigate = useNavigate()
  const { user, userData, loading: authLoading } = useAuth()
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signup')
    }
  }, [user, authLoading, navigate])

  const handleComplete = () => {
    setCompleting(true)
    setTimeout(() => {
      toast.success('Welcome to Senjr! 🎉')
      navigate('/student/dashboard')
    }, 1000)
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin h-8 w-8 text-primary-500" /></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <StepProgress currentStep={4} totalSteps={4} labels={['Basic', 'Education', 'Goals', 'Complete']} />

          <div className="my-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">You're All Set!</h2>
            <p className="text-gray-500 mt-2">Your account has been created successfully</p>
          </div>

          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-primary-600 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Starting Bonus</span>
            </div>
            <p className="text-3xl font-bold text-primary-600">+100 XP</p>
            <p className="text-sm text-primary-500">Begin your learning journey</p>
          </div>

          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Access to expert mentors</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>AI Tutor access</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Join the War Room</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Earn XP and unlock achievements</span>
            </div>
          </div>

          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {completing ? <Loader className="animate-spin h-5 w-5" /> : 'Start Learning'}
          </button>

          <p className="text-gray-500 text-sm mt-4">
            Need help? Contact support@senjr.com
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentSignup4