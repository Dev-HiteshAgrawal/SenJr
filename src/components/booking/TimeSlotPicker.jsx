const TimeSlotPicker = ({ selectedTime, onSelectTime, availableSlots = [] }) => {
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ]

  const filteredSlots = availableSlots.length > 0 
    ? timeSlots.filter(slot => availableSlots.includes(slot))
    : timeSlots

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">Select Time</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {filteredSlots.map((time) => (
          <button
            key={time}
            onClick={() => onSelectTime(time)}
            className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
              selectedTime === time
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-500'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlotPicker