import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star } from 'lucide-react'
import { getDocuments, whereClause, orderByClause } from '../../firebase/firestore'
import { SUBJECTS } from '../../utils/constants'
import MentorCard from '../../components/mentor/MentorCard'
import Loader from '../../components/common/Loader'

const FindMentor = () => {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  useEffect(() => {
    loadMentors()
  }, [])

  const loadMentors = async () => {
    try {
      const data = await getDocuments('users', [
        whereClause('role', '==', 'mentor'),
        orderByClause('rating', 'desc')
      ])
      setMentors(data)
    } catch (error) {
      console.error('Error loading mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || mentor.expertise?.includes(selectedSubject)
    return matchesSearch && matchesSubject
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-gray-900">Find a Mentor</h1>
          <p className="text-gray-600 mt-2">Discover expert mentors to guide your learning journey</p>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Subjects</option>
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject('')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedSubject === ''
                  ? 'bg-primary-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-500'
              }`}
            >
              All
            </button>
            {SUBJECTS.slice(0, 6).map(subject => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedSubject === subject
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-500'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader />
          ) : filteredMentors.length > 0 ? (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">No mentors found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default FindMentor