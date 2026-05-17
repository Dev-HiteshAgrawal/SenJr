import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle2, Link as LinkIcon, MessageSquare } from 'lucide-react';

const StudentSignup4 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'senjr_student',
    bio: '',
    linkedin: ''
  });
  const [useWhatsapp, setUseWhatsapp] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleComplete = (e) => {
    e.preventDefault();
    navigate('/dashboard/student');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative bg-white border-b-2 border-gray-900">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border-2 border-gray-900 flex items-center justify-center z-10 bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold tracking-wide">Complete Profile</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6">
        {/* Progress Dots */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex justify-center gap-2 mb-2 w-full max-w-[200px]">
            <div className="flex-1 h-1.5 rounded-full border border-gray-900 bg-primary-500"></div>
            <div className="flex-1 h-1.5 rounded-full border border-gray-900 bg-primary-500"></div>
            <div className="flex-1 h-1.5 rounded-full border border-gray-900 bg-primary-500"></div>
            <div className="flex-1 h-1.5 rounded-full border border-gray-900 bg-primary-500"></div>
          </div>
          <span className="text-xs font-bold text-gray-900">Step 4 of 4</span>
        </div>

        {/* XP Banner */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-xl"></div>
          <div className="relative bg-gradient-to-r from-[#E8F5EE] to-[#FFF0E5] border-2 border-gray-900 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 border-2 border-gray-900 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white text-xl">⭐</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Complete profile to earn +50 XP!</h3>
              <div className="inline-flex items-center bg-orange-500 border border-gray-900 rounded-full px-2 py-0.5 text-white">
                <span className="text-[10px] font-bold">🏆 Level 1 Newcomer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex justify-center mb-8">
          <button className="relative w-28 h-28 border-2 border-dashed border-gray-900 rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors group">
            <Camera className="w-8 h-8 text-gray-500 group-hover:text-gray-900 transition-colors" />
            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Tap to upload</span>
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleComplete}>
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-900">
                <span className="font-bold text-lg">@</span>
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="senjr_student"
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-900 bg-white focus:outline-none focus:border-primary-500 rounded-none font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Bio</label>
            <div className="relative border-2 border-gray-900 bg-white">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the community a bit about yourself..."
                rows="4"
                maxLength="200"
                className="w-full p-3 focus:outline-none focus:ring-0 resize-none font-medium text-sm placeholder-gray-500"
              />
              <div className="absolute bottom-2 right-2 text-xs font-bold text-gray-500">
                {formData.bio.length}/200
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">
              LinkedIn <span className="text-gray-500 font-medium">(Optional)</span>
            </label>
            <div className="relative border-2 border-gray-900 bg-white flex items-center">
              <div className="pl-3 pr-2 flex items-center pointer-events-none">
                <LinkIcon className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="linkedin.com/in/username"
                className="w-full py-3 pr-3 focus:outline-none focus:ring-0 font-medium text-sm placeholder-gray-500"
              />
            </div>
          </div>

          {/* WhatsApp Toggle */}
          <div className="pt-2">
            <label className="relative flex items-center justify-between p-4 border-2 border-gray-900 bg-white rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] cursor-pointer">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary-600" />
                <span className="font-bold text-sm text-gray-900">Use same number for WhatsApp</span>
              </div>
              
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={useWhatsapp}
                  onChange={(e) => setUseWhatsapp(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 border-2 border-gray-900"></div>
              </div>
            </label>
          </div>

        </form>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-900 z-50">
        <button 
          onClick={handleComplete}
          className="w-full group relative block"
        >
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
          <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
            Complete Signup
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentSignup4;