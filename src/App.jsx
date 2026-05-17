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
import StudentDashboard from './pages/dashboard/StudentDashboard'
import MentorDashboard from './pages/dashboard/MentorDashboard'
import StudentProfile from './pages/profile/StudentProfile'
import MentorProfile from './pages/profile/MentorProfile'
import FindMentor from './pages/features/FindMentor'
import BookSession from './pages/features/BookSession'
import WarRoom from './pages/features/WarRoom'
import AITutor from './pages/features/AITutor'
import AdminPanel from './pages/features/AdminPanel'

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
                
                <Route path="/signup" element={<StudentSignup1 />} />
                <Route path="/student/signup/step2" element={<StudentSignup2 />} />
                <Route path="/student/signup/step3" element={<StudentSignup3 />} />
                <Route path="/student/signup/step4" element={<StudentSignup4 />} />
                
                <Route path="/mentor/signup" element={<MentorSignup1 />} />
                <Route path="/mentor/signup/step2" element={<MentorSignup2 />} />
                <Route path="/mentor/signup/step3" element={<MentorSignup3 />} />
                <Route path="/mentor/signup/step4" element={<MentorSignup4 />} />

                <Route path="/student/dashboard" element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/mentor/dashboard" element={
                  <ProtectedRoute>
                    <MentorDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                } />

                <Route path="/find-mentor" element={<FindMentor />} />
                <Route path="/book-session/:mentorId?" element={
                  <ProtectedRoute>
                    <BookSession />
                  </ProtectedRoute>
                } />
                <Route path="/war-room" element={
                  <ProtectedRoute>
                    <WarRoom />
                  </ProtectedRoute>
                } />
                <Route path="/ai-tutor" element={
                  <ProtectedRoute>
                    <AITutor />
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