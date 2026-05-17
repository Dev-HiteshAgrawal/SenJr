import { Check } from 'lucide-react'

const StepProgress = ({ currentStep, totalSteps, labels = [] }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : isCurrent
                    ? 'border-primary-500 text-primary-500'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 transition-all duration-300 ${
                    isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
      {labels.length > 0 && (
        <div className="flex justify-between mt-2 px-1">
          {labels.map((label, index) => (
            <span
              key={index}
              className={`text-xs ${
                index + 1 <= currentStep ? 'text-primary-500' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default StepProgress