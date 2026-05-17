import { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Users, MessageSquare, Plus, Play } from 'lucide-react'

const WarRoom = () => {
  const [rooms, setRooms] = useState([
    { id: 1, title: 'GATE CSE 2026 Prep', participants: 45, subject: 'Computer Science', active: true },
    { id: 2, title: 'JEE Advanced Discussion', participants: 32, subject: 'Physics', active: true },
    { id: 3, title: 'JavaScript Bootcamp', participants: 28, subject: 'Programming', active: true },
    { id: 4, title: 'Data Structures Practice', participants: 22, subject: 'Computer Science', active: false }
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">War Room</h1>
              <p className="text-gray-600 mt-2">Join live study sessions and learn together</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              <Plus className="h-5 w-5" />
              Create Room
            </button>
          </div>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary-500 to-primary-400"></div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{room.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{room.subject}</p>
                    </div>
                    {room.active && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Live
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{room.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Active</span>
                    </div>
                  </div>

                  <button
                    className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
                      room.active
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!room.active}
                  >
                    {room.active ? (
                      <span className="flex items-center justify-center gap-2">
                        <Play className="h-4 w-4" />
                        Join Now
                      </span>
                    ) : (
                      'Coming Soon'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">What is War Room?</h2>
              <p className="text-primary-100 mb-6">
                War Room is a collaborative learning space where students join live video sessions 
                to study together. Share screens, discuss topics, and stay motivated with your peers.
              </p>
              <ul className="space-y-3 text-primary-100">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Real-time video collaboration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Screen sharing for problem-solving
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Group study with XP rewards
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WarRoom