import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineRecoveryBar from './components/OfflineRecoveryBar';
import AnalyticsLayer from './components/AnalyticsLayer';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Signup = lazy(() => import('./pages/Signup'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const MentorSetup = lazy(() => import('./pages/MentorSetup'));
const MentorProfile = lazy(() => import('./pages/MentorProfile'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const FindMentors = lazy(() => import('./pages/FindMentors'));
const FreeCourses = lazy(() => import('./pages/FreeCourses'));
const AITutor = lazy(() => import('./pages/AITutor'));
const AITutorChat = lazy(() => import('./pages/AITutorChat'));
const Profile = lazy(() => import('./pages/Profile'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Community = lazy(() => import('./pages/Community'));
const ChatRoom = lazy(() => import('./pages/ChatRoom'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const StudyRooms = lazy(() => import('./pages/StudyRooms'));
const CertificateVerify = lazy(() => import('./pages/CertificateVerify'));

function RouteFallback() {
  return (
    <main className="page-container route-fallback" aria-busy="true">
      <div className="skeleton-card card">
        <div className="skeleton-line wide" />
        <div className="skeleton-line" />
        <div className="skeleton-grid">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <AnalyticsLayer />
            <OfflineRecoveryBar />
            <Navbar />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student', 'admin']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><MentorDashboard /></ProtectedRoute>} />
                <Route path="/mentor-setup" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><MentorSetup /></ProtectedRoute>} />
                <Route path="/mentor/:mentorId" element={<MentorProfile />} />
                <Route path="/student/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
                <Route path="/find-mentors" element={<FindMentors />} />
                <Route path="/free-courses" element={<FreeCourses />} />
                <Route path="/ai-tutor" element={<AITutor />} />
                <Route path="/ai-tutor/:subject" element={<AITutorChat />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/study-rooms" element={<ProtectedRoute><StudyRooms /></ProtectedRoute>} />
                <Route path="/chatroom" element={<ProtectedRoute><StudyRooms /></ProtectedRoute>} />
                <Route path="/chat/:chatId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
                <Route path="/verify/:certId" element={<CertificateVerify />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
