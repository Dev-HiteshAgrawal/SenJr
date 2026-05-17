import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ArrowRight } from 'lucide-react';

const StudentSignup3 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    educationLevel: '',
    collegeName: '',
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
    // Merge step 3 data into sessionStorage
    const existing = JSON.parse(sessionStorage.getItem('senjr_signup') || '{}');
    sessionStorage.setItem('senjr_signup', JSON.stringify({
      ...existing,
      educationLevel: formData.educationLevel,
      college: formData.collegeName,
      city: formData.city,
      state: formData.state,
      yearOfStudy: formData.yearOfStudy,
      graduationYear: formData.graduationYear,
    }));
    navigate('/signup/student/4');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 relative bg-white border-b-2 border-gray-900">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border-2 border-gray-900 flex items-center justify-center z-10 bg-white shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold tracking-wide">Education Details</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200" />
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200" />
          <div className="w-8 h-1.5 rounded-full border border-gray-900 bg-primary-500" />
          <div className="w-6 h-1.5 rounded-full border border-gray-900 bg-gray-200" />
        </div>

        <form className="space-y-5" onSubmit={handleContinue}>
          {/* Education Level */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Education Level</label>
            <div className="relative">
              <select
                name="educationLevel" value={formData.educationLevel} onChange={handleChange} required
                className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none bg-white font-medium"
              >
                <option value="" disabled>Select Level</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="12th">Class 12th / Intermediate</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">College / School Name</label>
            <input
              type="text" name="collegeName" value={formData.collegeName} onChange={handleChange}
              placeholder="e.g. Delhi University" required
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none font-medium placeholder-gray-400"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">City</label>
            <input
              type="text" name="city" value={formData.city} onChange={handleChange}
              placeholder="e.g. Delhi" required
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none font-medium placeholder-gray-400"
            />
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">State</label>
            <div className="relative">
              <select
                name="state" value={formData.state} onChange={handleChange} required
                className="w-full appearance-none pl-4 pr-10 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none bg-white font-medium"
              >
                <option value="" disabled>Select State</option>
                {['Uttar Pradesh','Delhi','Maharashtra','Karnataka','Tamil Nadu','Rajasthan','Gujarat','West Bengal','Bihar','Madhya Pradesh','Andhra Pradesh','Telangana','Kerala','Punjab','Haryana','Jharkhand','Odisha','Other'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </div>

          {/* Year of Study */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-900">Year of Study</label>
            <div className="flex flex-wrap gap-3">
              {['1st', '2nd', '3rd', 'Final', 'Graduated'].map(year => (
                <button
                  type="button" key={year}
                  onClick={() => setFormData({ ...formData, yearOfStudy: year })}
                  className={`px-5 py-2 rounded-2xl border-2 border-gray-900 font-bold text-sm transition-all ${
                    formData.yearOfStudy === year
                      ? 'bg-primary-500 shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]'
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
            <label className="block text-sm font-bold text-gray-900">Expected Graduation Year</label>
            <input
              type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange}
              min="2024" max="2035" placeholder="e.g. 2027"
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-900 focus:outline-none focus:border-primary-500 rounded-none font-medium"
            />
          </div>
        </form>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-900 z-50">
        <button onClick={handleContinue} className="w-full group relative block">
          <div className="absolute inset-0 bg-gray-900 translate-y-1.5 translate-x-1.5 rounded-none transition-transform group-active:translate-x-0 group-active:translate-y-0" />
          <div className="relative bg-primary-500 border-2 border-gray-900 text-gray-900 text-center py-3.5 font-bold text-lg flex items-center justify-center gap-2 transition-transform group-active:translate-x-1.5 group-active:translate-y-1.5">
            Continue <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentSignup3;