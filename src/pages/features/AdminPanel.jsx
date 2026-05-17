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
  
  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>;
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">
      
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 z-50 bg-gray-900 text-white shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="text-xl font-black tracking-tight">Admin Console</h1>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 bg-gray-800 rounded-full active:rotate-180 transition-transform border border-gray-700">
          <RefreshCw className="w-4 h-4 text-gray-300" />
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white px-5 pt-4 border-b border-gray-100 flex gap-6 sticky top-[72px] z-40 shadow-sm">
        <button
          onClick={() => setActiveTab('Mentors')}
          className={`pb-4 font-bold text-sm transition-colors border-b-2 relative ${
            activeTab === 'Mentors' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Pending Mentors 
          {!mentorsLoading && pendingMentors.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingMentors.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('Payments')}
          className={`pb-4 font-bold text-sm transition-colors border-b-2 relative ${
            activeTab === 'Payments' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Pending Payments
          {!paymentsLoading && pendingPayments.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingPayments.length}</span>
          )}
        </button>
      </div>

      <main className="flex-1 px-5 pt-6 space-y-5">
        
        {activeTab === 'Mentors' && (
          <div className="space-y-4">
            {mentorsError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold">{mentorsError}</span>
              </div>
            )}
            
            {mentorsLoading && <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>}
            
            {!mentorsLoading && !mentorsError && pendingMentors.map((mentor) => (
              <div key={mentor.id} className={`bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ${actionLoading === mentor.id ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{mentor.displayName || 'Unknown'}</h3>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">{mentor.college || 'No college listed'}</p>
                  </div>
                  <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Pending
                  </span>
                </div>
                
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Subjects</p>
                  <div className="flex gap-2 flex-wrap">
                    {(mentor.subjects || []).map(s => (
                      <span key={s} className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-xl">{s}</span>
                    ))}
                    {(!mentor.subjects || mentor.subjects.length === 0) && (
                      <span className="text-xs font-medium text-gray-400 italic">None specified</span>
                    )}
                  </div>
                </div>

                <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Uploaded Documents</p>
                  <div className="space-y-3">
                    {(mentor.docs || []).map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{doc.name || 'Document'}</span>
                        </div>
                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-500 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                    {(!mentor.docs || mentor.docs.length === 0) && (
                      <p className="text-xs font-medium text-gray-400">No documents uploaded.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRejectMentor(mentor.id)} 
                    disabled={actionLoading === mentor.id}
                    className="flex-1 py-3.5 bg-red-50 text-red-600 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-100"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApproveMentor(mentor.id)} 
                    disabled={actionLoading === mentor.id}
                    className="flex-1 py-3.5 bg-primary-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-primary-500/20 hover:bg-primary-600"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            ))}
            
            {!mentorsLoading && pendingMentors.length === 0 && (
              <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm px-6">
                <CheckCircle className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                <p className="text-lg font-bold text-gray-900">All caught up!</p>
                <p className="text-sm font-medium text-gray-500">No pending mentors to review.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Payments' && (
          <div className="space-y-4">
            {paymentsError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold">{paymentsError}</span>
              </div>
            )}
            
            {paymentsLoading && <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>}

            {!paymentsLoading && !paymentsError && pendingPayments.map((payment) => (
              <div key={payment.id} className={`bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all ${actionLoading === payment.id ? 'opacity-50 pointer-events-none' : ''}`}>
                
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-center shadow-sm">
                      <IndianRupee className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount Paid</p>
                      <p className="font-black text-gray-900 text-xl leading-tight">₹{payment.amount || 0}</p>
                    </div>
                  </div>
                  <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Unverified
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student</span>
                    <span className="text-sm font-bold text-gray-900">{payment.studentName || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</span>
                    <span className="text-sm font-bold text-gray-900">{payment.mentorName || 'Unknown'}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Transaction ID (UTR)</span>
                    <span className="text-base font-black text-blue-600 font-mono tracking-wider break-all bg-blue-50 p-2 rounded-lg border border-blue-100 mt-1">{payment.transactionId || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRejectPayment(payment.id)} 
                    disabled={actionLoading === payment.id}
                    className="flex-1 py-3.5 bg-red-50 text-red-600 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-100"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleConfirmPayment(payment.id)} 
                    disabled={actionLoading === payment.id}
                    className="flex-1 py-3.5 bg-primary-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-primary-500/20 hover:bg-primary-600"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirm
                  </button>
                </div>
              </div>
            ))}

            {!paymentsLoading && pendingPayments.length === 0 && (
              <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm px-6">
                <CheckCircle className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                <p className="text-lg font-bold text-gray-900">All caught up!</p>
                <p className="text-sm font-medium text-gray-500">No pending payments to review.</p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;