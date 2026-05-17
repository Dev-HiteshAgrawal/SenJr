import { Flame } from 'lucide-react'

const StreakCard = ({ streak = 0, lastActive }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">Current Streak</p>
          <p className="text-4xl font-bold mt-1">{streak}</p>
          <p className="text-white/70 text-sm mt-1">days</p>
        </div>
        <div className="bg-white/20 p-4 rounded-full">
          <Flame className="h-10 w-10" />
        </div>
      </div>
      {lastActive && (
        <p className="text-white/70 text-xs mt-4">
          Last active: {new Date(lastActive).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

export default StreakCard