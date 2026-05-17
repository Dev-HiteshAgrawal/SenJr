import { calculateLevel, calculateXPProgress } from '../../utils/helpers'

const XPBar = ({ xp = 0 }) => {
  const level = calculateLevel(xp)
  const progress = calculateXPProgress(xp)

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Level {level}</span>
        <span className="text-sm font-medium text-gray-600">{xp} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-400 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {1000 - (xp % 1000)} XP to Level {level + 1}
      </p>
    </div>
  )
}

export default XPBar