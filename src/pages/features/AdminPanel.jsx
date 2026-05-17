import React, { useState, useMemo } from 'react';
import { Menu, ShieldAlert, CheckCircle, XCircle, FileText, IndianRupee, ExternalLink, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, userData, loading: authLoading } = useAuthContext();
  const [activeTab, setActiveTab] = useState('Mentors');
  const [actionLoading, setActionLoading] = useState(null);

  // Queries for pending items
  const mentorQueryOpts = useMemo(() => ({
    filters: [['verificationStatus', '==', 'pending']],
    sort: ['createdAt', 'desc']
  }), []);

  const paymentQueryOpts = useMemo(() => ({
    filters: [['paymentStatus', '==', 'pending']],
    sort: ['createdAt', 'desc']
  }), []);

  const { data: pendingMentors, loading: mentorsLoading, error: mentorsError } = useFirestoreQuery('users', mentorQueryOpts);
  const { data: pendingPayments, loading: paymentsLoading, error: paymentsError } = useFirestoreQuery('sessions', paymentQueryOpts);

  // Protect Route (if adminEmail env var doesn't match, or role is not admin)
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
  if (authLoading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#10b981]" /></div>;
  if (!user || user.email !== adminEmail) {
    return <Navigate to="/dashboard/student" replace />;
  }

  const handleApproveMentor = async (id) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'users', id), {
        verificationStatus: 'verified'
      });
    } catch (err) {
      console.error('Failed to approve mentor:', err);
      alert('Error updating mentor status');
    }
    setActionLoading(null);
  };

  const handleRejectMentor = async (id) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'users', id), {
        verificationStatus: 'rejected'
      });
    } catch (err) {
      console.error('Failed to reject mentor:', err);
      alert('Error updating mentor status');
    }
    setActionLoading(null);
  };

  const handleConfirmPayment = async (id) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'sessions', id), {
        paymentStatus: 'verified',
        status: 'upcoming' // Move from payment pending to upcoming session
      });
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      alert('Error confirming payment');
    }
    setActionLoading(null);
  };

  const handleRejectPayment = async (id) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, 'sessions', id), {
        paymentStatus: 'rejected',
        status: 'cancelled'
      });
    } catch (err) {
      console.error('Failed to reject payment:', err);
      alert('Error rejecting payment');
    }
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-black tracking-tight">Admin Console</h1>
        </div>
        <button onClick={() => window.location.reload()} className="p-1 active:rotate-180 transition-transform">
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
          Pending Mentors {!mentorsLoading && `(${pendingMentors.length})`}
        </button>
        <button
          onClick={() => setActiveTab('Payments')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
            activeTab === 'Payments' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-gray-500'
          }`}
        >
          Pending Payments {!paymentsLoading && `(${pendingPayments.length})`}
        </button>
      </div>

      <main className="flex-1 px-4 py-6 space-y-4">
        
        {activeTab === 'Mentors' && (
          <div className="space-y-4">
            {mentorsError && <div className="text-red-500 text-sm font-bold">{mentorsError}</div>}
            {mentorsLoading && <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#10b981]" /></div>}
            
            {!mentorsLoading && !mentorsError && pendingMentors.map((mentor) => (
              <div key={mentor.id} className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm ${actionLoading === mentor.id ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{mentor.displayName || 'Unknown'}</h3>
                    <p className="text-sm font-medium text-gray-600">{mentor.college || 'No college listed'}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Pending
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Subjects</p>
                  <div className="flex gap-2 flex-wrap">
                    {(mentor.subjects || []).map(s => (
                      <span key={s} className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md">{s}</span>
                    ))}
                    {(!mentor.subjects || mentor.subjects.length === 0) && (
                      <span className="text-xs text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div className="mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Uploaded Documents</p>
                  <div className="space-y-2">
                    {(mentor.docs || []).map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{doc.name || 'Document'}</span>
                        </div>
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                    {(!mentor.docs || mentor.docs.length === 0) && (
                      <p className="text-xs text-gray-500">No documents uploaded.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRejectMentor(mentor.id)} 
                    disabled={actionLoading === mentor.id}
                    className="flex-1 py-2.5 border-2 border-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 active:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApproveMentor(mentor.id)} 
                    disabled={actionLoading === mentor.id}
                    className="flex-1 py-2.5 bg-[#10b981] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:bg-emerald-600 shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            ))}
            
            {!mentorsLoading && pendingMentors.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-medium">No pending mentors.</div>
            )}
          </div>
        )}

        {activeTab === 'Payments' && (
          <div className="space-y-4">
            {paymentsError && <div className="text-red-500 text-sm font-bold">{paymentsError}</div>}
            {paymentsLoading && <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#10b981]" /></div>}

            {!paymentsLoading && !paymentsError && pendingPayments.map((payment) => (
              <div key={payment.id} className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm ${actionLoading === payment.id ? 'opacity-50' : ''}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Amount Paid</p>
                      <p className="font-black text-gray-900 text-lg leading-tight">₹{payment.amount || 0}</p>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Unverified
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-500">Student</span>
                    <span className="text-xs font-bold text-gray-900">{payment.studentName || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-gray-500">Mentor</span>
                    <span className="text-xs font-bold text-gray-900">{payment.mentorName || 'Unknown'}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Transaction ID (UTR)</span>
                    <span className="text-sm font-black text-blue-600 font-mono tracking-wider">{payment.transactionId || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRejectPayment(payment.id)} 
                    disabled={actionLoading === payment.id}
                    className="flex-1 py-2.5 border-2 border-red-100 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 active:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleConfirmPayment(payment.id)} 
                    disabled={actionLoading === payment.id}
                    className="flex-1 py-2.5 bg-[#10b981] text-white font-bold rounded-xl flex items-center justify-center gap-2 active:bg-emerald-600 shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm
                  </button>
                </div>
              </div>
            ))}

            {!paymentsLoading && pendingPayments.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-medium">No pending payments.</div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;