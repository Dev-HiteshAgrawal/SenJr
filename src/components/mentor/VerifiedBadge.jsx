import { BadgeCheck } from 'lucide-react'

const VerifiedBadge = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className="bg-primary-500 rounded-full p-0.5" title="Verified Mentor">
      <BadgeCheck className={`${sizeClasses[size]} text-white`} />
    </div>
  )
}

export default VerifiedBadge