import { Calendar, Clock, Video, User } from 'lucide-react'
import { formatDateTime } from '../../utils/helpers'

const SessionCard = ({ session, onJoin, onCancel }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
              {session.status}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800">{session.subject}</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>{session.mentorName || session.studentName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDateTime(session.dateTime)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{session.duration} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {session.status === 'confirmed' && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onJoin?.(session.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Video className="h-4 w-4" />
            Join
          </button>
          <button
            onClick={() => onCancel?.(session.id)}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default SessionCard