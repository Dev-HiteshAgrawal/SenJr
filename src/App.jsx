import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Toast from './components/common/Toast'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleRoute from './components/common/RoleRoute'

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
import StudentDashboard from './pages/dashboard/StudentDashboard'
import MentorDashboard from './pages/dashboard/MentorDashboard'
import StudentProfile from './pages/profile/StudentProfile'
import MentorProfile from './pages/profile/MentorProfile'
import FindMentor from './pages/features/FindMentor'
import BookSession from './pages/features/BookSession'
import WarRoom from './pages/features/WarRoom'
import AITutor from './pages/features/AITutor'
import AdminPanel from './pages/features/AdminPanel'
import AIChat from './pages/features/AIChat'
import AvailabilitySettings from './pages/features/AvailabilitySettings'
import Courses from './pages/features/Courses'
import Sessions from './pages/features/Sessions'
import Community from './pages/features/Community'
import MentorEarnings from './pages/features/MentorEarnings'
import Payment from './pages/features/Payment'
import VideoCall from './pages/features/VideoCall'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/signup/student/1" element={<StudentSignup1 />} />
                <Route path="/signup/student/2" element={<StudentSignup2 />} />
                <Route path="/signup/student/3" element={<StudentSignup3 />} />
                <Route path="/signup/student/4" element={<StudentSignup4 />} />
                
                <Route path="/signup/mentor/1" element={<MentorSignup1 />} />
                <Route path="/signup/mentor/2" element={<MentorSignup2 />} />
                <Route path="/signup/mentor/3" element={<MentorSignup3 />} />
                <Route path="/signup/mentor/4" element={<MentorSignup4 />} />
                <Route path="/signup/mentor/success" element={<MentorSuccess />} />

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
                <Route path="/mentor/availability" element={
                  <RoleRoute allowedRoles={['mentor']}>
                    <AvailabilitySettings />
                  </RoleRoute>
                } />
                <Route path="/courses" element={
                  <RoleRoute allowedRoles={['student']}>
                    <Courses />
                  </RoleRoute>
                } />
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
                <Route path="/mentor/earnings" element={
                  <RoleRoute allowedRoles={['mentor']}>
                    <MentorEarnings />
                  </RoleRoute>
                } />
                <Route path="/pay/:sessionId" element={
                  <RoleRoute allowedRoles={['student']}>
                    <Payment />
                  </RoleRoute>
                } />
                <Route path="/video-call/:roomName" element={
                  <ProtectedRoute>
                    <VideoCall />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </RoleRoute>
                } />
              </Routes>
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