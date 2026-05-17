import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { GraduationCap, Mail, Lock, User, Loader } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { createDocument } from '../../firebase/firestore'
import FormInput from '../../components/auth/FormInput'
import StepProgress from '../../components/auth/StepProgress'

const StudentSignup1 = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const userCredential = await register(formData.email, formData.password)
      await createDocument('users', {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        role: 'student',
        createdAt: new Date(),
        xp: 0,
        streak: 0,
        level: 1
      })
      toast.success('Account created!')
      navigate('/student/signup/step2')
    } catch (error) {
      toast.error(error.message || 'Registration failed')
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
            <p className="text-gray-500 mt-2">Step 1: Basic Information</p>
          </div>

          <StepProgress currentStep={1} totalSteps={4} labels={['Basic', 'Education', 'Goals', 'Complete']} />

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
              icon={User}
              required
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              icon={Mail}
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Create a password"
              icon={Lock}
              required
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              icon={Lock}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center mt-4"
            >
              {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Continue'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-primary-500 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentSignup1