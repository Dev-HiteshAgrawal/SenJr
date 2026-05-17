import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CheckCircle2, Search, ArrowRight } from 'lucide-react';

const StudentSignup3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    educationLevel: '',
    collegeName: 'ITM College Aligarh',
    university: 'AKTU',
    city: '',
    state: 'Uttar Pradesh',
    yearOfStudy: '1st',
    graduationYear: '2026'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/signup/student/4');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center px-4 py-4 relative bg-white border-b-2 border-gray-900">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border-2 border-gray-900 flex items-center justify-center z-10 bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold tracking-wide">Education Details</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200"></div>
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200"></div>
          <div className="w-8 h-1.5 rounded-full border border-gray-900 bg-primary-500"></div>
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200"></div>
        </div>

        <form className="space-y-5" onSubmit={handleContinue}>
          
          {/* Education Level */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Education Level</label>
            <div className="relative">
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none bg-white font-medium"
              >
                <option value="" disabled>Select Level</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">College Name</label>
            <div className="relative">
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter college name"
                className="w-full pl-4 pr-10 py-3 border-2 border-gray-900 bg-green-50 focus:outline-none focus:border-primary-500 rounded-none font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <CheckCircle2 className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </div>

          {/* University (Auto-filled style) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              readOnly
              className="w-full pl-4 pr-4 py-3 border-2 border-dashed border-gray-400 bg-[#E8F5EE] text-gray-600 rounded-none font-medium cursor-not-allowed"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">City</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Search city..."
                className="w-full pl-10 pr-10 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </div>

          {/* State (Auto-filled style) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              readOnly
              className="w-full pl-4 pr-4 py-3 border-2 border-dashed border-gray-400 bg-[#E8F5EE] text-gray-600 rounded-none font-medium cursor-not-allowed"
            />
          </div>

          {/* Year of Study */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Year of Study</label>
            <div className="flex flex-wrap gap-3">
              {['1st', '2nd', '3rd', 'Final'].map(year => (
                <button
                  type="button"
                  key={year}
                  onClick={() => setFormData({...formData, yearOfStudy: year})}
                  className={`px-5 py-2 rounded-2xl border-2 border-gray-900 font-bold text-sm transition-all ${
                    formData.yearOfStudy === year
                      ? 'bg-primary-500 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] text-gray-900' 
                      : 'bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Graduation Year */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="e.g. 2026"
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none font-medium"
            />
          </div>

        </form>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-900 z-50">
        <button 
          onClick={handleContinue}
          className="w-full group relative block"
        >
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0"></div>
          <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
            Continue <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentSignup3;