import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MentorSetup from './pages/MentorSetup';
import MentorProfile from './pages/MentorProfile';
import FindMentors from './pages/FindMentors';
import FreeCourses from './pages/FreeCourses';
import AITutor from './pages/AITutor';
import AITutorChat from './pages/AITutorChat';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import ChatRoom from './pages/ChatRoom';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student', 'admin']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><MentorDashboard /></ProtectedRoute>} />
          <Route path="/mentor-setup" element={<ProtectedRoute allowedRoles={['mentor', 'admin']}><MentorSetup /></ProtectedRoute>} />
          <Route path="/mentor/:mentorId" element={<MentorProfile />} />
          <Route path="/find-mentors" element={<FindMentors />} />
          <Route path="/free-courses" element={<FreeCourses />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/ai-tutor/:subject" element={<AITutorChat />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/chat/:chatId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
