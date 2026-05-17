import { Star } from 'lucide-react'
import { getInitials, formatRelativeTime } from '../../utils/helpers'

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.studentName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600">
              {getInitials(review.studentName)}
            </span>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">{review.studentName}</h4>
            <span className="text-sm text-gray-400">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard