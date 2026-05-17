import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Copy, Share2 } from 'lucide-react';

const MentorSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F9FB] font-sans text-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Dots Pattern (Mockup approximation) */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#6EE7B7 2px, transparent 2px), radial-gradient(#FDBA74 2px, transparent 2px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />

      <div className="w-full max-w-sm z-10 flex flex-col items-center text-center">
        
        {/* Trophy Icon */}
        <div className="relative mb-8 mt-12">
          <div className="absolute inset-0 bg-gray-900 translate-y-2 translate-x-2 rounded-full"></div>
          <div className="relative w-32 h-32 bg-[#6EE7B7] rounded-full flex items-center justify-center border-2 border-gray-900">
            <Trophy className="w-12 h-12 text-gray-900" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold font-display leading-tight mb-4 px-4">
          🎉 Congratulations!<br/>
          You're now a verified<br/>
          mentor!
        </h1>

        {/* Subtitle */}
        <p className="text-sm font-medium text-gray-600 mb-12 px-6">
          Your expertise is ready to be shared. Welcome to the Expert Peer community.
        </p>

        {/* Profile Link Box */}
        <div className="w-full relative group mb-8">
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none"></div>
          <div className="relative bg-white border-2 border-gray-900 rounded-none p-4 flex items-center justify-between">
            <div className="text-left overflow-hidden">
              <span className="block text-[10px] font-bold text-gray-500 mb-1">Your profile link:</span>
              <span className="block text-sm font-medium text-gray-900 truncate">senjr.com/mentor/@userna...</span>
            </div>
            
            <button className="relative shrink-0 ml-2">
              <div className="absolute inset-0 bg-gray-900 translate-y-1 translate-x-1 rounded-none"></div>
              <div className="relative bg-[#EBF4FF] border-2 border-gray-900 w-10 h-10 flex items-center justify-center active:translate-x-1 active:translate-y-1 transition-transform">
                <Copy className="w-5 h-5 text-gray-900" />
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          {/* Share Button */}
          <button className="w-full relative block group">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-[#f97316] border-2 border-gray-900 text-gray-900 py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              <Share2 className="w-4 h-4" /> Share
            </div>
          </button>

          {/* Go to Dashboard Button */}
          <button 
            onClick={() => navigate('/dashboard/mentor')}
            className="w-full relative block group"
          >
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
            <div className="relative bg-white border-2 border-gray-900 text-gray-900 py-3.5 font-bold text-sm flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
              Go to Dashboard
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default MentorSuccess;
