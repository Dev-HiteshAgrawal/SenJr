import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, CheckCircle2, Medal, GraduationCap, TrendingUp, Trophy, Landmark, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';

// Map icon strings from DB to actual components
const IconMap = {
  Medal: <Medal className="w-5 h-5 text-[#10b981]" />,
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
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Exam War Room</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1">
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 space-y-5">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
            Intensive Prep
          </span>
          <h2 className="text-2xl font-black mb-2 leading-tight">Exam War Room</h2>
          <p className="text-sm font-medium text-gray-300 max-w-[200px] leading-relaxed">
            30-day intensive with a verified senior who just cleared your exam.
          </p>
        </div>

        {/* 2x2 Grid of Exam Packages */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Failed to load packages: {error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#10b981]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold text-sm">Loading War Room packages...</p>
          </div>
        )}

        {!loading && !error && packages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-800">No active packages</p>
            <p className="text-sm text-gray-500 mt-1">Check back later for new intensives.</p>
          </div>
        )}

        {!loading && !error && packages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm flex flex-col relative h-full">
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-[#f97316] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl z-10">
                    Popular
                  </div>
                )}
                
                <div className={`w-10 h-10 ${pkg.iconBg || 'bg-gray-100'} rounded-xl flex items-center justify-center border ${pkg.iconBorder || 'border-gray-200'} mb-3`}>
                  {IconMap[pkg.iconName] || <Medal className="w-5 h-5 text-gray-400" />}
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{pkg.title}</h3>
                
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="font-black text-gray-900 text-lg">₹{pkg.price}</span>
                  <span className="text-[10px] text-gray-400 line-through font-medium">₹{pkg.originalPrice}</span>
                </div>
                
                <div className="space-y-1.5 mb-4 mt-auto">
                  {(pkg.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#10b981] mt-0.5 shrink-0" />
                      <span className="text-[10px] text-gray-600 font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleEnroll(pkg)}
                  className="w-full bg-[#10b981] text-white font-bold py-2.5 rounded-xl active:bg-emerald-600 transition-colors text-xs"
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
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-300">
            <h3 className="text-xl font-black text-gray-900 mb-1">Confirm Enrollment</h3>
            <p className="text-sm text-gray-500 mb-5">You're about to enroll in the {selectedPkg.title} War Room.</p>
            
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Package</span>
                <span className="text-sm font-bold text-gray-900">{selectedPkg.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Duration</span>
                <span className="text-sm font-bold text-gray-900">{selectedPkg.durationDays || 30} Days</span>
              </div>
              <div className="h-px bg-gray-200 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total to Pay</span>
                <span className="text-xl font-black text-[#10b981]">₹{selectedPkg.price}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl active:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmEnrollment}
                className="flex-1 px-4 py-3 bg-[#10b981] text-white font-bold rounded-xl active:bg-emerald-600 shadow-sm"
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