import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Users, BookOpen, DollarSign, TrendingUp, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { getDocuments, updateDocument } from '../../firebase/firestore'
import Loader from '../../components/common/Loader'

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const usersData = await getDocuments('users')
      const sessionsData = await getDocuments('sessions')
      setUsers(usersData)
      setSessions(sessionsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const verifyMentor = async (userId) => {
    try {
      await updateDocument('users', userId, { isVerified: true })
      toast.success('Mentor verified!')
      loadData()
    } catch (error) {
      toast.error('Failed to verify mentor')
    }
  }

  const stats = {
    totalUsers: users.length,
    totalMentors: users.filter(u => u.role === 'mentor').length,
    totalStudents: users.filter(u => u.role === 'student').length,
    totalSessions: sessions.length,
    totalRevenue: sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.amount || 0), 0)
  }

  const pendingMentors = users.filter(u => u.role === 'mentor' && !u.isVerified)

  if (loading) return <Loader fullScreen />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Panel</h1>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Mentors</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalMentors}</p>
                </div>
                <BookOpen className="h-8 w-8 text-secondary-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalSessions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-100">
              <nav className="flex gap-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('mentors')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'mentors'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mentors
                </button>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'sessions'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sessions
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {pendingMentors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Pending Mentor Verifications
                      </h3>
                      <div className="space-y-3">
                        {pendingMentors.map(mentor => (
                          <div key={mentor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{mentor.name}</p>
                              <p className="text-sm text-gray-500">{mentor.email}</p>
                              <p className="text-sm text-gray-500">{mentor.expertise?.join(', ')}</p>
                            </div>
                            <button
                              onClick={() => verifyMentor(mentor.id)}
                              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                            >
                              Verify
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sessions</h3>
                    <div className="space-y-3">
                      {sessions.slice(0, 5).map(session => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{session.subject}</p>
                            <p className="text-sm text-gray-500">{session.mentorName} → {session.studentName}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            session.status === 'completed' ? 'bg-green-100 text-green-700' :
                            session.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'mentors' && (
                <div className="space-y-3">
                  {users.filter(u => u.role === 'mentor').map(mentor => (
                    <div key={mentor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                          {mentor.name}
                          {mentor.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </p>
                        <p className="text-sm text-gray-500">{mentor.email}</p>
                        <p className="text-sm text-gray-500">{mentor.expertise?.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Rating: {mentor.rating?.toFixed(1) || 'New'}</p>
                        <p className="text-sm text-gray-600">Sessions: {mentor.sessionsCompleted || 0}</p>
                        {!mentor.isVerified && (
                          <button
                            onClick={() => verifyMentor(mentor.id)}
                            className="text-sm text-primary-500 hover:underline"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{session.subject}</p>
                        <p className="text-sm text-gray-500">{session.mentorName} → {session.studentName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">₹{session.amount || 0}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.status === 'completed' ? 'bg-green-100 text-green-700' :
                          session.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPanel