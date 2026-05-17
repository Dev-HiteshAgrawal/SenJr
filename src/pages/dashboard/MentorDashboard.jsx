import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { getDocuments, whereClause, orderByClause, limitClause } from '../../firebase/firestore'
import { DollarSign, Users, Star, Calendar, Settings, TrendingUp, Clock } from 'lucide-react'
import XPBar from '../../components/dashboard/XPBar'
import StreakCard from '../../components/dashboard/StreakCard'
import SessionCard from '../../components/dashboard/SessionCard'
import StatsCard from '../../components/dashboard/StatsCard'
import Loader from '../../components/common/Loader'

const MentorDashboard = () => {
  const { user, userData } = useAuth()
  const [sessions, setSessions] = useState([])
  const [earnings, setEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const sessionData = await getDocuments('sessions', [
        whereClause('mentorId', '==', user.uid),
        orderByClause('dateTime', 'desc'),
        limitClause(5)
      ])
      setSessions(sessionData)
      
      const totalEarnings = sessionData
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + (s.amount || 0), 0)
      setEarnings(totalEarnings)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return <Loader fullScreen />
  }

  const stats = [
    { title: 'Total Earnings', value: `₹${earnings}`, icon: DollarSign, color: 'primary' },
    { title: 'Students Taught', value: userData.sessionsCompleted || 0, icon: Users, color: 'secondary' },
    { title: 'Rating', value: userData.rating?.toFixed(1) || 'New', icon: Star, color: 'accent' },
    { title: 'Upcoming', value: sessions.filter(s => s.status === 'confirmed').length, icon: Calendar, color: 'primary' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-display font-bold">
                Welcome, {userData.name?.split(' ')[0]}! 🎓
              </h1>
              <p className="mt-2 text-secondary-100">
                {userData.isVerified ? 'Verified Mentor' : 'Pending Verification'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link
                to="/settings"
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {userData.expertise?.map(subject => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-secondary-100 text-secondary-600 text-sm rounded-full"
                  >
                    {subject}
                  </span>
                )) || (
                  <p className="text-gray-500 text-sm">Add your expertise in profile settings</p>
                )}
              </div>
              {userData.hourlyRate && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Hourly Rate: </span>
                  <span className="font-semibold text-gray-800">₹{userData.hourlyRate}/hr</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Sessions</h2>
                <Link to="/sessions" className="text-secondary-500 text-sm hover:underline">View All</Link>
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
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <StreakCard streak={userData.streak || 0} lastActive={userData.lastActive} />

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Mentor Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Students</span>
                  <span className="font-medium text-gray-800">{userData.sessionsCompleted || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Avg. Rating</span>
                  <span className="font-medium text-gray-800">{userData.rating?.toFixed(1) || 'New'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Profile Views</span>
                  <span className="font-medium text-gray-800">{userData.profileViews || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Verification Status</h3>
              <p className="text-secondary-100 text-sm mb-4">
                {userData.isVerified 
                  ? 'Your profile is verified and visible in search results.'
                  : 'Complete your profile to get verified.'}
              </p>
              {!userData.isVerified && (
                <Link
                  to="/profile"
                  className="inline-block px-4 py-2 bg-white text-secondary-600 rounded-lg text-sm font-medium hover:bg-secondary-50"
                >
                  Complete Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorDashboard