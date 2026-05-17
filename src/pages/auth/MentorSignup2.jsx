import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Camera, FileUp, Award, ChevronDown, Lightbulb } from 'lucide-react';

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
    navigate('/signup/mentor/3');
  };

  // Determine if form is "valid" to enable button (mock validation)
  const isValid = formData.upiId.length > 0 && formData.upiId === formData.confirmUpiId;

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative bg-[#F8FAF9]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center z-10 bg-transparent">
          <ArrowLeft className="w-6 h-6 text-[#f97316]" />
        </button>
        <div className="absolute inset-0 flex items-center pl-14 pointer-events-none">
          <span className="text-sm font-bold text-[#f97316]">Become a Mentor</span>
        </div>
      </header>

      <main className="flex-1 px-4">
        <h1 className="text-2xl font-bold font-display mb-4">Verify Your Identity</h1>
        
        {/* Progress Pills */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 border border-gray-900 shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]"></div>
          <div className="flex-1 h-2 rounded-full bg-white border border-gray-900"></div>
          <div className="flex-1 h-2 rounded-full bg-white border border-gray-900"></div>
          <div className="flex-1 h-2 rounded-full bg-white border border-gray-900"></div>
        </div>
        <p className="text-xs font-bold text-gray-600 mb-6">Step 2 of 4</p>

        {/* Info Box */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-lg"></div>
          <div className="relative bg-[#EBF4FF] border-2 border-gray-900 rounded-lg p-4 flex gap-3">
            <Lock className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-gray-900 leading-relaxed">
              Your documents are secure and only used for verification.
            </p>
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          
          {/* Government ID Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-lg"></div>
            <div className="relative bg-white border-2 border-gray-900 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-300">Government ID</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-900">ID Type</label>
                  <div className="relative">
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      className="w-full appearance-none pl-3 pr-10 py-2.5 border-2 border-gray-900 focus:outline-none focus:border-[#f97316] rounded-lg bg-white font-medium text-sm text-gray-900"
                    >
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="block text-[10px] font-bold text-gray-900">Front Side</label>
                    <button type="button" className="w-full h-24 border-2 border-dashed border-[#f97316]/50 bg-[#F4F8FF] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                      <Camera className="w-6 h-6 text-[#f97316]" />
                      <span className="text-[11px] font-bold text-gray-900">Tap to upload</span>
                    </button>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="block text-[10px] font-bold text-gray-900">Back Side</label>
                    <button type="button" className="w-full h-24 border-2 border-dashed border-[#f97316]/50 bg-[#F4F8FF] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                      <Camera className="w-6 h-6 text-[#f97316]" />
                      <span className="text-[11px] font-bold text-gray-900">Tap to upload</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1 pt-1">
                  <span className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center text-[8px]">i</span>
                  Tips: Good lighting, all corners visible
                </p>
              </div>
            </div>
          </div>

          {/* Education Proof Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-lg"></div>
            <div className="relative bg-white border-2 border-gray-900 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-300">Education Proof</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-900">College Degree or Last Marksheet</label>
                  <button type="button" className="w-full h-24 border-2 border-dashed border-[#f97316]/50 bg-[#F4F8FF] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                    <FileUp className="w-6 h-6 text-[#f97316]" />
                    <span className="text-xs font-bold text-gray-900">Tap to select file</span>
                  </button>
                </div>
                <p className="text-[10px] font-medium text-gray-500">
                  Supported: PDF, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Professional Certificate Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-lg"></div>
            <div className="absolute -top-3 -right-2 bg-[#6EE7B7] border-2 border-gray-900 px-3 py-1 text-[10px] font-bold text-gray-900 rounded-md z-10 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] flex items-center gap-1">
              <span className="text-white">☆</span> +10 XP
            </div>
            <div className="relative bg-white border-2 border-gray-900 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-300">Professional Certificate</h3>
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-900">Any certification (optional but recommended)</label>
                <button type="button" className="w-full h-24 mt-2 border-2 border-dashed border-[#f97316]/50 bg-[#F4F8FF] rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                  <Award className="w-6 h-6 text-[#f97316]" />
                  <span className="text-xs font-bold text-gray-900">Tap to select file</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-lg"></div>
            <div className="relative bg-white border-2 border-gray-900 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-300">Payment Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-900">UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="name@upi"
                    className="w-full px-3 py-2.5 border-2 border-gray-900 focus:outline-none focus:border-[#f97316] rounded-lg placeholder-gray-500 text-sm font-medium"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-900">Confirm UPI ID</label>
                  <input
                    type="text"
                    name="confirmUpiId"
                    value={formData.confirmUpiId}
                    onChange={handleChange}
                    placeholder="name@upi"
                    className="w-full px-3 py-2.5 border-2 border-gray-900 focus:outline-none focus:border-[#f97316] rounded-lg placeholder-gray-500 text-sm font-medium"
                  />
                </div>
                
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  This is where your earnings will be sent
                </p>
              </div>
            </div>
          </div>

        </form>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F8FAF9] z-50">
        <div className="p-4 border-t border-gray-200">
          {isValid ? (
             <button 
             onClick={handleContinue}
             className="w-full group relative block"
           >
             <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-lg transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
             <div className="relative bg-[#f97316] border-2 border-gray-900 text-white text-center py-3.5 font-bold text-lg rounded-lg flex items-center justify-center transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
               Continue
             </div>
           </button>
          ) : (
            <button 
             disabled
             className="w-full bg-[#E5E7EB] text-gray-400 border-2 border-gray-300 text-center py-3.5 font-bold text-lg rounded-lg flex items-center justify-center cursor-not-allowed"
           >
             Continue
           </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSignup2;