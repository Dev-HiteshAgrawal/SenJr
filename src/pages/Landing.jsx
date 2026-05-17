import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Users,
  Video,
  Brain,
  Shield,
  Clock,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react'

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Connect with verified professionals from top companies'
    },
    {
      icon: Video,
      title: 'Live Sessions',
      description: 'Interactive 1-on-1 video sessions from anywhere'
    },
    {
      icon: Brain,
      title: 'AI Tutor',
      description: 'Get instant help from our smart AI assistant'
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All mentors are background checked'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your timetable'
    },
    {
      icon: Sparkles,
      title: 'XP & Rewards',
      description: 'Earn points and unlock achievements'
    }
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Student',
      content: 'Senjr helped me crack my coding interviews! The mentors are amazing.',
      rating: 5
    },
    {
      name: 'Rahul Verma',
      role: 'GATE Aspirant',
      content: 'The AI tutor is incredibly helpful for quick doubt resolution.',
      rating: 5
    },
    {
      name: 'Ananya Gupta',
      role: 'College Student',
      content: 'Flexible scheduling makes it easy to balance studies and mentoring.',
      rating: 4
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1ZjdmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-600 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                India's #1 Learning Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
                Master Any Subject with{' '}
                <span className="text-primary-500">Expert Mentors</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Connect with verified mentors, attend live sessions, and accelerate your learning journey.
                Join thousands of students achieving their goals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/find-mentor"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Find a Mentor
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                    <span className="ml-1 text-sm font-medium">5.0</span>
                  </div>
                  <p className="text-sm text-gray-500">10,000+ students</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Live Session</h3>
                    <p className="text-sm text-gray-500">Python Fundamentals</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Students Attending</span>
                    <span className="font-medium text-gray-800">24</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Session Rating</span>
                    <span className="font-medium text-green-600">4.9 ★</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-medium text-gray-800">60 mins</span>
                  </div>
                </div>
                <div className="mt-6 flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="Student"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                    +19
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              Why Choose Senjr?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience with cutting-edge features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              What Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join thousands of students and mentors on Senjr today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup?role=student"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              I'm a Student
            </Link>
            <Link
              to="/signup?role=mentor"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing