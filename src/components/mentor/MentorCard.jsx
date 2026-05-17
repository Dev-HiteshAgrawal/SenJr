import { Star, Clock, BookOpen } from 'lucide-react'
import { getInitials } from '../../utils/helpers'
import VerifiedBadge from './VerifiedBadge'

const MentorCard = ({ mentor, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(mentor)}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          {mentor.avatar ? (
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary-600">
                {getInitials(mentor.name)}
              </span>
            </div>
          )}
          {mentor.isVerified && (
            <div className="absolute -bottom-1 -right-1">
              <VerifiedBadge size="sm" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{mentor.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">{mentor.title}</p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium ml-1">{mentor.rating || 0}</span>
              <span className="text-sm text-gray-400 ml-1">({mentor.reviewsCount || 0})</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{mentor.sessionsCompleted || 0} sessions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mentor.subjects?.slice(0, 3).map((subject, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
          >
            {subject}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{mentor.experience || 0} years exp</span>
        </div>
        <span className="text-lg font-bold text-primary-600">
          ₹{mentor.hourlyRate || 0}/hr
        </span>
      </div>
    </div>
  )
}

export default MentorCard