import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Toast from './components/common/Toast'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleRoute from './components/common/RoleRoute'
import Loader from './components/common/Loader'

// Eagerly-loaded auth pages (tiny, needed immediately)
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import StudentSignup1 from './pages/auth/StudentSignup1'
import StudentSignup2 from './pages/auth/StudentSignup2'
import StudentSignup3 from './pages/auth/StudentSignup3'
import StudentSignup4 from './pages/auth/StudentSignup4'
import MentorSignup1 from './pages/auth/MentorSignup1'
import MentorSignup2 from './pages/auth/MentorSignup2'
import MentorSignup3 from './pages/auth/MentorSignup3'
import MentorSignup4 from './pages/auth/MentorSignup4'
import MentorSuccess from './pages/auth/MentorSuccess'

// Lazy-loaded routes for performance optimization
const RoleSelection = React.lazy(() => import('./pages/auth/RoleSelection'))
const StudentDashboard = React.lazy(() => import('./pages/dashboard/StudentDashboard'))
const MentorDashboard = React.lazy(() => import('./pages/dashboard/MentorDashboard'))
const StudentProfile = React.lazy(() => import('./pages/profile/StudentProfile'))
const MentorProfile = React.lazy(() => import('./pages/profile/MentorProfile'))
const FindMentor = React.lazy(() => import('./pages/features/FindMentor'))
const BookSession = React.lazy(() => import('./pages/features/BookSession'))
const WarRoom = React.lazy(() => import('./pages/features/WarRoom'))
const AITutor = React.lazy(() => import('./pages/features/AITutor'))
const AdminPanel = React.lazy(() => import('./pages/features/AdminPanel'))
const AIChat = React.lazy(() => import('./pages/features/AIChat'))
const AvailabilitySettings = React.lazy(() => import('./pages/features/AvailabilitySettings'))
const Courses = React.lazy(() => import('./pages/features/Courses'))
const Sessions = React.lazy(() => import('./pages/features/Sessions'))
const Community = React.lazy(() => import('./pages/features/Community'))
const MentorEarnings = React.lazy(() => import('./pages/features/MentorEarnings'))
const Payment = React.lazy(() => import('./pages/features/Payment'))
const VideoCall = React.lazy(() => import('./pages/features/VideoCall'))
const HelpCenter = React.lazy(() => import('./pages/legal/HelpCenter'))
const ContactUs = React.lazy(() => import('./pages/legal/ContactUs'))
const PrivacyPolicy = React.lazy(() => import('./pages/legal/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('./pages/legal/TermsOfService'))

const DashboardRedirect = React.lazy(() => import('./components/common/DashboardRedirect'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
              <Suspense fallback={<Loader fullScreen />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/join" element={<RoleSelection />} />

                  {/* Smart dashboard redirect */}
                  <Route path="/dashboard" element={<DashboardRedirect />} />

                  {/* Legal & Support pages */}
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />

                  {/* Student signup flow */}
                  <Route path="/signup/student/1" element={<StudentSignup1 />} />
                  <Route path="/signup/student/2" element={<StudentSignup2 />} />
                  <Route path="/signup/student/3" element={<StudentSignup3 />} />
                  <Route path="/signup/student/4" element={<StudentSignup4 />} />

                  {/* Mentor signup flow */}
                  <Route path="/signup/mentor/1" element={<MentorSignup1 />} />
                  <Route path="/signup/mentor/2" element={<MentorSignup2 />} />
                  <Route path="/signup/mentor/3" element={<MentorSignup3 />} />
                  <Route path="/signup/mentor/4" element={<MentorSignup4 />} />
                  <Route path="/signup/mentor/success" element={<MentorSuccess />} />

                  {/* Protected dashboards */}
                  <Route path="/dashboard/student" element={
                    <RoleRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </RoleRoute>
                  } />
                  <Route path="/dashboard/mentor" element={
                    <RoleRoute allowedRoles={['mentor']}>
                      <MentorDashboard />
                    </RoleRoute>
                  } />

                  {/* Profiles */}
                  <Route path="/profile/student/:id" element={
                    <RoleRoute allowedRoles={['student', 'mentor']}>
                      <StudentProfile />
                    </RoleRoute>
                  } />
                  <Route path="/profile/mentor/:id" element={
                    <RoleRoute allowedRoles={['student', 'mentor']}>
                      <MentorProfile />
                    </RoleRoute>
                  } />

                  {/* Student features */}
                  <Route path="/find-mentor" element={
                    <RoleRoute allowedRoles={['student']}>
                      <FindMentor />
                    </RoleRoute>
                  } />
                  <Route path="/book/:mentorId" element={
                    <RoleRoute allowedRoles={['student']}>
                      <BookSession />
                    </RoleRoute>
                  } />
                  <Route path="/war-room" element={
                    <RoleRoute allowedRoles={['student']}>
                      <WarRoom />
                    </RoleRoute>
                  } />
                  <Route path="/ai-tutor" element={
                    <RoleRoute allowedRoles={['student']}>
                      <AITutor />
                    </RoleRoute>
                  } />
                  <Route path="/chat/ai" element={
                    <RoleRoute allowedRoles={['student']}>
                      <AIChat />
                    </RoleRoute>
                  } />
                  <Route path="/courses" element={
                    <RoleRoute allowedRoles={['student']}>
                      <Courses />
                    </RoleRoute>
                  } />
                  <Route path="/pay/:sessionId" element={
                    <RoleRoute allowedRoles={['student']}>
                      <Payment />
                    </RoleRoute>
                  } />

                  {/* Mentor features */}
                  <Route path="/mentor/availability" element={
                    <RoleRoute allowedRoles={['mentor']}>
                      <AvailabilitySettings />
                    </RoleRoute>
                  } />
                  <Route path="/mentor/earnings" element={
                    <RoleRoute allowedRoles={['mentor']}>
                      <MentorEarnings />
                    </RoleRoute>
                  } />

                  {/* Shared protected routes */}
                  <Route path="/sessions" element={
                    <ProtectedRoute>
                      <Sessions />
                    </ProtectedRoute>
                  } />
                  <Route path="/community" element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  } />
                  <Route path="/video-call/:roomName" element={
                    <ProtectedRoute>
                      <VideoCall />
                    </ProtectedRoute>
                  } />

                  {/* Admin */}
                  <Route path="/admin" element={
                    <RoleRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </RoleRoute>
                  } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Toast />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App