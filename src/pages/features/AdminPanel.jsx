import React, { useState } from 'react';
import { Menu, ShieldAlert, CheckCircle, XCircle, FileText, IndianRupee, ExternalLink, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('Mentors');
  const [loading, setLoading] = useState(false);

  // Hardcode check based on env var (In reality, ProtectedRoute/RoleRoute handles this, but good to have fallback)
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  // If we really wanted strict checking here:
  // if (currentUser?.email !== adminEmail) return <div className="p-8 text-center text-red-500 font-bold">Access Denied</div>;

  // Mock Data — pending verification mentors
  const pendingMentors = [
    {
      id: 'm1',
      name: 'Rohan Gupta',
      college: 'Delhi University',
      subjects: ['SSC CGL', 'Mathematics'],
      docs: ['Aadhaar', 'Degree Certificate'],
    },
    {
      id: 'm2',
      name: 'Sneha Singh',
      college: 'Amity University',
      subjects: ['BBA Entrance', 'English'],
      docs: ['PAN Card', 'Marksheet'],
    }
  ];

  // Mock Data — pending payments
  const pendingPayments = [
    {
      id: 'p1',
      student: 'Hitesh A.',
      mentor: 'Rahul Sir',
      amount: 200,
      txnId: 'UTR9876543210',
    },
    {
      id: 'p2',
      student: 'Amit K.',
      mentor: 'Priya Verma',
      amount: 250,
      txnId: 'UTR1234567890',
    }
  ];

  const handleApproveMentor = (id) => {
    // API Call to set verificationStatus = 'verified'
    console.log('Approved mentor', id);
  };

  const handleRejectMentor = (id) => {
    // API Call to set verificationStatus = 'rejected'
    console.log('Rejected mentor', id);
  };

  const handleConfirmPayment = (id) => {
    // API Call to set paymentStatus = 'paid'
    console.log('Confirmed payment', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-black tracking-tight">Admin Console</h1>
        </div>
        <button onClick={() => window.location.reload()} className="p-1">
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white px-4 pt-4 border-b border-gray-200 flex gap-4 sticky top-[60px] z-40">
        <button
          onClick={() => setActiveTab('Mentors')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'Mentors' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-gray-500'
          }`}
        >
          Pending Mentors ({pendingMentors.length})
        </button>
        <button
          onClick={() => setActiveTab('Payments')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'Payments' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-gray-500'
          }`}
        >
          Pending Payments ({pendingPayments.length})
        </button>
      </div>

      <main className="flex-1 px-4 py-6 space-y-4">
        
        {activeTab === 'Mentors' && (
          <div className="space-y-4">
            {pendingMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{mentor.name}</h3>
                    <p className="text-sm font-medium text-gray-600">{mentor.college}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Pending
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Subjects</p>
                  <div className="flex gap-2 flex-wrap">
                    {mentor.subjects.map(s => (
                      <span key={s} className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Uploaded Documents</p>
                  <div className="space-y-2">
                    {mentor.docs.map(doc => (
                      <div key={doc} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">{doc}</span>
                        </div>
                        <button className="text-blue-600">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleRejectMentor(mentor.id)} className="flex-1 py-2.5 border-2 border-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 active:bg-red-50">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => handleApproveMentor(mentor.id)} className="flex-1 py-2.5 bg-[#10b981] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:bg-emerald-600 shadow-sm">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            ))}
            
            {pendingMentors.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-medium">No pending mentors.</div>
            )}
          </div>
        )}

        {activeTab === 'Payments' && (
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div key={payment.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Amount Paid</p>
                      <p className="font-black text-gray-900 text-lg leading-tight">₹{payment.amount}</p>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Unverified
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-500">Student</span>
                    <span className="text-xs font-bold text-gray-900">{payment.student}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-500">Mentor</span>
                    <span className="text-xs font-bold text-gray-900">{payment.mentor}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Transaction ID (UTR)</span>
                    <span className="text-sm font-black text-blue-600 font-mono tracking-wider">{payment.txnId}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 border-2 border-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 active:bg-red-50">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => handleConfirmPayment(payment.id)} className="flex-1 py-2.5 bg-[#10b981] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:bg-emerald-600 shadow-sm">
                    <CheckCircle className="w-4 h-4" /> Confirm
                  </button>
                </div>
              </div>
            ))}

            {pendingPayments.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-medium">No pending payments.</div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;