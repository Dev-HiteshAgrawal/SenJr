import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Calendar, Clock, Video, DollarSign, Loader, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getDocument, createDocument } from '../../firebase/firestore'
import CalendarComponent from '../../components/booking/Calendar'
import TimeSlotPicker from '../../components/booking/TimeSlotPicker'
import { SESSION_DURATIONS } from '../../utils/constants'

const BookSession = () => {
  const navigate = useNavigate()
  const { mentorId } = useParams()
  const { user } = useAuth()

  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({
    date: null,
    time: '',
    duration: 60,
    subject: '',
    notes: ''
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (mentorId) {
      loadMentor()
    } else {
      setLoading(false)
    }
  }, [mentorId])

  const loadMentor = async () => {
    try {
      const data = await getDocument('users', mentorId)
      setMentor(data)
    } catch (error) {
      toast.error('Failed to load mentor')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = async () => {
    if (!booking.date || !booking.time || !booking.subject) {
      toast.error('Please fill all required fields')
      return
    }

    if (!user) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    setProcessing(true)
    try {
      const sessionDate = new Date(booking.date)
      const [time, period] = booking.time.split(' ')
      const [hours, minutes] = time.split(':')
      let hour = parseInt(hours)
      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0
      sessionDate.setHours(hour, parseInt(minutes), 0, 0)

      await createDocument('sessions', {
        studentId: user.uid,
        mentorId: mentor?.uid,
        mentorName: mentor?.name,
        studentName: user.displayName || user.email,
        subject: booking.subject,
        dateTime: sessionDate,
        duration: booking.duration,
        status: 'pending',
        amount: mentor?.hourlyRate * (booking.duration / 60),
        notes: booking.notes,
        createdAt: new Date()
      })

      toast.success('Session booked successfully!')
      navigate('/student/dashboard')
    } catch (error) {
      toast.error('Failed to book session')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h1 className="text-2xl font-display font-bold text-gray-900">Book a Session</h1>
          
          {mentor && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">{mentor.name?.[0]}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{mentor.name}</h3>
                <p className="text-sm text-gray-500">{mentor.title}</p>
                <p className="text-sm text-primary-600">₹{mentor.hourlyRate}/hr</p>
              </div>
            </div>
          )}

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <CalendarComponent
                selectedDate={booking.date}
                onSelectDate={(date) => setBooking(prev => ({ ...prev, date }))}
              />
            </div>

            <div className="space-y-6">
              <TimeSlotPicker
                selectedTime={booking.time}
                onSelectTime={(time) => setBooking(prev => ({ ...prev, time }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {SESSION_DURATIONS.map(duration => (
                    <button
                      key={duration.value}
                      onClick={() => setBooking(prev => ({ ...prev, duration: duration.value }))}
                      className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                        booking.duration === duration.value
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-gray-200 text-gray-600 hover:border-primary-500'
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  value={booking.subject}
                  onChange={(e) => setBooking(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select subject</option>
                  {mentor?.expertise?.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any specific topics to cover?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {booking.date && booking.time && (
                <div className="p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-600 mb-2">
                    <DollarSign className="h-5 w-5" />
                    <span className="font-medium">Session Fee</span>
                  </div>
                  <p className="text-2xl font-bold text-primary-600">
                    ₹{Math.round(mentor?.hourlyRate * (booking.duration / 60))}
                  </p>
                </div>
              )}

              <button
                onClick={handleBookSession}
                disabled={processing || !booking.date || !booking.time || !booking.subject}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {processing ? <Loader className="animate-spin h-5 w-5" /> : (
                  <>
                    <Video className="h-5 w-5 mr-2" />
                    Book Session
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookSession