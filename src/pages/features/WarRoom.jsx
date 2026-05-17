import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, CheckCircle2, Medal, GraduationCap, TrendingUp, Trophy, Landmark, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';

const IconMap = {
  Medal: <Medal className="w-5 h-5 text-primary-500" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-[#B45309]" />,
  Landmark: <Landmark className="w-5 h-5 text-[#4F46E5]" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-[#BE123C]" />,
};

const WarRoom = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const queryOptions = useMemo(() => ({ sort: ['order', 'asc'], limitCount: 10 }), []);
  const { data: packages, loading, error } = useFirestoreQuery('warRoomPackages', queryOptions);

  const handleEnroll = (pkg) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const confirmEnrollment = () => {
    setShowModal(false);
    navigate(`/pay/war-room-${selectedPkg.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900">Exam War Room</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-6">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-wider">
            Intensive Prep
          </span>
          <h2 className="text-2xl font-black mb-2 leading-tight">The War Room</h2>
          <p className="text-sm font-medium text-gray-300 max-w-[200px] leading-relaxed">
            30-day intensive with a verified senior who just cleared your exam.
          </p>
        </div>

        {/* Packages Grid */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Failed to load packages: {error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-primary-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold text-sm">Loading War Room packages...</p>
          </div>
        )}

        {!loading && !error && packages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-800">No active packages</p>
            <p className="text-sm font-medium text-gray-500 mt-1">Check back later for new intensives.</p>
          </div>
        )}

        {!loading && !error && packages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm flex flex-col relative h-full hover:border-primary-200 transition-colors">
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl z-10 uppercase tracking-wider">
                    Popular
                  </div>
                )}
                
                <div className={`w-12 h-12 ${pkg.iconBg || 'bg-primary-50'} rounded-2xl flex items-center justify-center border ${pkg.iconBorder || 'border-primary-100'} mb-4`}>
                  {IconMap[pkg.iconName] || <Medal className="w-6 h-6 text-primary-400" />}
                </div>
                
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{pkg.title}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-black text-gray-900 text-xl">₹{pkg.price}</span>
                  <span className="text-[10px] text-gray-400 line-through font-medium">₹{pkg.originalPrice}</span>
                </div>
                
                <div className="space-y-2 mb-5 mt-auto">
                  {(pkg.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] text-gray-600 font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleEnroll(pkg)}
                  className="w-full bg-primary-50 text-primary-600 font-bold py-3 rounded-xl active:scale-[0.98] hover:bg-primary-100 transition-all text-xs"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Enrollment Modal */}
      {showModal && selectedPkg && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[400px] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-300">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Confirm Enrollment</h3>
            <p className="text-sm font-medium text-gray-500 mb-6">You're about to enroll in the {selectedPkg.title} War Room intensive.</p>
            
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Package</span>
                <span className="text-sm font-bold text-gray-900">{selectedPkg.title}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</span>
                <span className="text-sm font-bold text-gray-900">{selectedPkg.durationDays || 30} Days</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total to Pay</span>
                <span className="text-2xl font-black text-primary-500">₹{selectedPkg.price}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-2xl active:scale-[0.98] hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmEnrollment}
                className="flex-1 px-4 py-3.5 bg-gray-900 text-white font-bold rounded-2xl active:scale-[0.98] hover:bg-gray-800 transition-all shadow-md"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WarRoom;