import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Camera, FileUp, Award, ChevronDown, Lightbulb, ArrowRight, Info } from 'lucide-react';

const MentorSignup2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idType: 'Aadhaar',
    upiId: '',
    confirmUpiId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const existing = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    sessionStorage.setItem('senjr_signup', JSON.stringify({
      ...existing,
      upiId: formData.upiId,
      idType: formData.idType,
    }));
    navigate('/signup/mentor/3');
  };

  const isValid = formData.upiId.length > 0 && formData.upiId === formData.confirmUpiId;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base font-bold">Verify Your Identity</h1>
        </div>
      </header>

      {/* Progress */}
      <div className="flex justify-center gap-1.5 mt-1 mb-2 px-5">
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-mentor-500" />
        <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
        <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
      </div>
      <p className="text-center text-xs text-gray-500 font-medium mb-5">Step 2 of 4</p>

      <main className="flex-1 px-5">
        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-sm font-medium text-gray-700">Your documents are secure and only used for verification.</p>
        </div>

        <div className="space-y-6">
          {/* Government ID */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white">
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Government ID</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">ID Type</label>
                <div className="relative">
                  <select name="idType" value={formData.idType} onChange={handleChange}
                    className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 bg-white font-medium text-sm">
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Passport">Passport</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Front Side</label>
                  <button type="button" className="w-full h-24 border-2 border-dashed border-mentor-300 bg-mentor-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-mentor-50 transition-colors">
                    <Camera className="w-5 h-5 text-mentor-500" />
                    <span className="text-[11px] font-semibold text-gray-600">Tap to upload</span>
                  </button>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700">Back Side</label>
                  <button type="button" className="w-full h-24 border-2 border-dashed border-mentor-300 bg-mentor-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-mentor-50 transition-colors">
                    <Camera className="w-5 h-5 text-mentor-500" />
                    <span className="text-[11px] font-semibold text-gray-600">Tap to upload</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Good lighting, all corners visible
              </p>
            </div>
          </div>

          {/* Education Proof */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white">
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Education Proof</h3>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">College Degree or Last Marksheet</label>
              <button type="button" className="w-full h-24 border-2 border-dashed border-mentor-300 bg-mentor-50/50 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-mentor-50 transition-colors">
                <FileUp className="w-5 h-5 text-mentor-500" />
                <span className="text-xs font-semibold text-gray-600">Tap to select file</span>
              </button>
              <p className="text-[11px] text-gray-500">Supported: PDF, JPG, PNG (max 5MB)</p>
            </div>
          </div>

          {/* Professional Certificate */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white relative">
            <span className="absolute -top-2.5 right-4 bg-primary-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">⭐ +10 XP</span>
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Professional Certificate</h3>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">Any certification (optional but recommended)</label>
              <button type="button" className="w-full h-24 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors">
                <Award className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">Tap to select file</span>
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-white">
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Payment Details</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">UPI ID</label>
                <input type="text" name="upiId" value={formData.upiId} onChange={handleChange}
                  placeholder="name@upi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 placeholder-gray-400 text-sm font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Confirm UPI ID</label>
                <input type="text" name="confirmUpiId" value={formData.confirmUpiId} onChange={handleChange}
                  placeholder="name@upi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mentor-500 placeholder-gray-400 text-sm font-medium" />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> This is where your earnings will be sent
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button onClick={handleContinue} disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-center font-bold text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-mentor-500 text-white hover:bg-mentor-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}>
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MentorSignup2;