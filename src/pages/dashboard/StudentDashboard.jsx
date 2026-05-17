import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { getDocuments, whereClause, orderByClause, limitClause } from '../../firebase/firestore'
import { BookOpen, Calendar, TrendingUp, Video, Search, Brain } from 'lucide-react'
import XPBar from '../../components/dashboard/XPBar'
import StreakCard from '../../components/dashboard/StreakCard'
import SessionCard from '../../components/dashboard/SessionCard'
import StatsCard from '../../components/dashboard/StatsCard'
import Loader from '../../components/common/Loader'

const StudentDashboard = () => {
  const { user, userData } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  const loadSessions = async () => {
    try {
      const data = await getDocuments('sessions', [
        whereClause('studentId', '==', user.uid),
        orderByClause('dateTime', 'desc'),
        limitClause(5)
      ])
      setSessions(data)
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return <Loader fullScreen />
  }

  const stats = [
    { title: 'Total Sessions', value: userData.sessionsCompleted || 0, icon: Video, color: 'primary' },
    { title: 'Subjects Learning', value: userData.subjects?.length || 0, icon: BookOpen, color: 'secondary' },
    { title: 'Current Streak', value: userData.streak || 0, icon: TrendingUp, color: 'accent' },
    { title: 'Upcoming', value: sessions.filter(s => s.status === 'confirmed').length, icon: Calendar, color: 'primary' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-display font-bold">
                Welcome back, {userData.name?.split(' ')[0]}! 👋
              </h1>
              <p className="mt-2 text-primary-100">Ready to continue your learning journey?</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <XPBar xp={userData.xp || 0} />
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/find-mentor"
                  className="p-4 bg-primary-50 rounded-xl text-center hover:bg-primary-100 transition-colors"
                >
                  <Search className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-800">Find Mentor</span>
                </Link>
                <Link
                  to="/ai-tutor"
                  className="p-4 bg-secondary-50 rounded-xl text-center hover:bg-secondary-100 transition-colors"
                >
                  <Brain className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-800">AI Tutor</span>
                </Link>
                <Link
                  to="/war-room"
                  className="p-4 bg-accent-50 rounded-xl text-center hover:bg-accent-100 transition-colors"
                >
                  <Video className="h-8 w-8 text-accent-500 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-800">War Room</span>
                </Link>
                <Link
                  to="/book-session"
                  className="p-4 bg-gray-100 rounded-xl text-center hover:bg-gray-200 transition-colors"
                >
                  <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-800">Book Session</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h2>
                <Link to="/sessions" className="text-primary-500 text-sm hover:underline">View All</Link>
              </div>
              {loading ? (
                <Loader />
              ) : sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.slice(0, 3).map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming sessions</p>
                  <Link to="/find-mentor" className="text-primary-500 hover:underline mt-2 inline-block">
                    Book your first session
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <StreakCard streak={userData.streak || 0} lastActive={userData.lastActive} />

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Your Interests</h3>
              <div className="flex flex-wrap gap-2">
                {userData.subjects?.map(subject => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-primary-100 text-primary-600 text-sm rounded-full"
                  >
                    {subject}
                  </span>
                )) || (
                  <p className="text-gray-500 text-sm">No subjects selected yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard