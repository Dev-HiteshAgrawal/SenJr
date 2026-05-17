import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ArrowRight, CheckCircle2, Search } from 'lucide-react';

const StudentSignup3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    educationLevel: '',
    collegeName: '',
    university: '',
    city: '',
    state: '',
    yearOfStudy: '1st',
    graduationYear: new Date().getFullYear() + 2,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const existing = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    sessionStorage.setItem('senjr_signup', JSON.stringify({
      ...existing,
      educationLevel: formData.educationLevel,
      college: formData.collegeName,
      university: formData.university,
      city: formData.city,
      state: formData.state,
      yearOfStudy: formData.yearOfStudy,
      graduationYear: formData.graduationYear,
    }));
    navigate('/signup/student/4');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-28">
      {/* Header */}
      <header className="flex items-center px-5 py-4 relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center z-10 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold">Education Details</h1>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex justify-center items-center gap-1.5 mt-1 mb-6 px-5">
        <div className="w-2 h-2 rounded-full bg-primary-500" />
        <div className="w-10 h-1.5 rounded-full bg-primary-500" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-6 h-1.5 rounded-full bg-gray-300" />
      </div>

      <div className="border-t border-gray-100 mb-6" />

      <main className="flex-1 px-5">
        <form className="space-y-6" onSubmit={handleContinue}>
          {/* Education Level */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Education Level</label>
            <div className="relative">
              <select
                name="educationLevel" value={formData.educationLevel} onChange={handleChange} required
                className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm font-medium"
              >
                <option value="" disabled>Select Level</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="12th">Class 12th / Intermediate</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">College Name</label>
            <div className="relative">
              <input
                type="text" name="collegeName" value={formData.collegeName} onChange={handleChange}
                placeholder="e.g. ITM College Aligarh" required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
              />
              {formData.collegeName.length > 3 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                </div>
              )}
            </div>
          </div>

          {/* University */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">University</label>
            <input
              type="text" name="university" value={formData.university} onChange={handleChange}
              placeholder="e.g. AKTU"
              className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">City</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text" name="city" value={formData.city} onChange={handleChange}
                placeholder="Search city..." required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">State</label>
            <input
              type="text" name="state" value={formData.state} onChange={handleChange}
              placeholder="e.g. Uttar Pradesh" required
              className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium placeholder-gray-400"
            />
          </div>

          {/* Year of Study */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Year of Study</label>
            <div className="flex gap-2">
              {['1st', '2nd', '3rd', 'Final'].map(year => (
                <button
                  type="button" key={year}
                  onClick={() => setFormData({ ...formData, yearOfStudy: year })}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    formData.yearOfStudy === year
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Graduation Year */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Graduation Year</label>
            <input
              type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange}
              min="2024" max="2035" placeholder="e.g. 2026"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium"
            />
          </div>
        </form>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-50">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-primary-500 text-white text-center font-bold text-base hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StudentSignup3;