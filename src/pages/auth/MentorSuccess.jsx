import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Copy, Share2, ArrowRight } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const MentorSuccess = () => {
  const navigate = useNavigate();
  const { userData } = useAuthContext();
  const username = userData?.username || 'new_mentor';

  return (
    <div className="min-h-screen bg-[#F5F9F7] font-sans text-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-mentor-200/40 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary-200/40 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-sm z-10 flex flex-col items-center text-center">
        
        {/* Trophy Icon */}
        <div className="relative mb-8 mt-12">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-mentor-500/10 border-4 border-white">
            <Trophy className="w-12 h-12 text-mentor-500" strokeWidth={2} />
          </div>
          {/* Confetti particles mock */}
          <div className="absolute -top-4 -right-4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute top-1/2 -left-6 w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="absolute -bottom-2 right-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold leading-tight mb-4 text-gray-900">
          Congratulations!<br/>
          You're a verified<br/>
          <span className="text-mentor-500">mentor.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mb-10 px-2 leading-relaxed">
          Your expertise is ready to be shared. Welcome to the community of top-tier mentors.
        </p>

        {/* Profile Link Box */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-8">
          <div className="text-left overflow-hidden pr-3">
            <span className="block text-xs font-semibold text-gray-500 mb-0.5">Your profile link:</span>
            <span className="block text-sm font-medium text-gray-900 truncate">senjr.com/m/{username}</span>
          </div>
          
          <button className="shrink-0 w-10 h-10 bg-mentor-50 text-mentor-600 rounded-xl flex items-center justify-center hover:bg-mentor-100 transition-colors">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button className="w-full py-4 rounded-2xl bg-mentor-500 text-white font-bold text-base hover:bg-mentor-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-mentor-500/20">
            <Share2 className="w-5 h-5" /> Share Profile
          </button>

          <button 
            onClick={() => navigate('/dashboard/mentor')}
            className="w-full py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 font-bold text-base hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorSuccess;
