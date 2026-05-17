const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-50'
    : 'flex items-center justify-center'

  return (
    <div className={containerClass}>
      <div className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-500 ${sizeClasses[size]}`}></div>
    </div>
  )
}

export default Loader