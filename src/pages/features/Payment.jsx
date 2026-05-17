import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, CheckCircle2, Clock, Calendar, User, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Payment = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [txnId, setTxnId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        if (sessionId.startsWith('war-room-')) {
          // It's a war room package
          const pkgId = sessionId.replace('war-room-', '');
          const pkgRef = doc(db, 'warRoomPackages', pkgId);
          const pkgSnap = await getDoc(pkgRef);
          
          if (pkgSnap.exists()) {
            const pkg = pkgSnap.data();
            setSessionData({
              id: sessionId,
              isWarRoom: true,
              mentorName: pkg.mentorName || 'Senjr Admin',
              mentorAvatar: 'https://ui-avatars.com/api/?name=Senjr&background=ECFDF5&color=10b981',
              subject: pkg.title,
              date: 'Rolling Enrollment',
              time: 'Flexible',
              duration: pkg.durationDays ? `${pkg.durationDays} Days` : '30 Days',
              amount: pkg.price,
              mentorUpiId: import.meta.env.VITE_ADMIN_UPI || 'senjr@ybl', // Fallback to admin UPI for packages
            });
          } else {
            setError('War Room package not found');
          }
        } else {
          // It's a standard mentor session
          const sessionRef = doc(db, 'sessions', sessionId);
          const sessionSnap = await getDoc(sessionRef);
          
          if (sessionSnap.exists()) {
            const sess = sessionSnap.data();
            
            setSessionData({
              id: sessionId,
              isWarRoom: false,
              mentorName: sess.mentorName || 'Mentor',
              mentorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sess.mentorName || 'M')}&background=ECFDF5&color=10b981`,
              studentName: sess.studentName,
              subject: sess.topic || sess.subject || 'Mentorship Session',
              date: sess.date,
              time: sess.time,
              duration: sess.duration,
              amount: sess.amount,
              mentorUpiId: sess.mentorUpiId || 'mentor@ybl',
            });
          } else {
            setError('Session not found');
          }
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchPaymentDetails();
  }, [sessionId]);

  const qrUrl = sessionData ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(sessionData.mentorUpiId)}&pn=Senjr&am=${sessionData.amount}&cu=INR` : '';

  const copyUpi = () => {
    if (!sessionData) return;
    navigator.clipboard.writeText(sessionData.mentorUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!txnId.trim() || !sessionData) return;
    setSubmitting(true);
    
    try {
      if (sessionData.isWarRoom) {
        // Handle War Room purchase (e.g. save to a purchases collection or user's enrolledCourses)
        await new Promise(r => setTimeout(r, 1000));
      } else {
        // Update session with transaction ID
        const sessionRef = doc(db, 'sessions', sessionData.id);
        await updateDoc(sessionRef, {
          transactionId: txnId,
          paymentStatus: 'pending', // Pending manual verification by mentor/admin
        });
      }
      setSuccess(true);
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert('Failed to submit payment details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
        <p className="text-sm font-bold text-gray-500">Initializing secure payment...</p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Error</h2>
        <p className="text-sm font-medium text-gray-500 mb-8">{error || 'Payment details not found'}</p>
        <button onClick={() => navigate(-1)} className="bg-white border border-gray-200 shadow-sm text-gray-800 px-8 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-colors">Go Back</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-primary-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Payment Submitted!</h2>
        <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed max-w-sm">
          Your transaction ID has been recorded securely. The payment will be verified shortly by your mentor.
        </p>
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-5 mb-8 w-full max-w-sm">
          <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Transaction ID</p>
          <p className="font-bold text-gray-900 text-lg break-all">{txnId}</p>
        </div>
        <button
          onClick={() => navigate('/sessions')}
          className="w-full max-w-sm bg-primary-500 text-white py-4 rounded-2xl font-bold text-base shadow-md shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
        >
          View My Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col pb-24">

      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 flex-1">Complete Payment</h1>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-5">

        {/* Session Summary */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm shrink-0">
              <img src={sessionData.mentorAvatar} alt={sessionData.mentorName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base truncate mb-0.5">{sessionData.mentorName}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{sessionData.subject}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-5 relative z-10">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2 flex-1 min-w-[120px]">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-700">{sessionData.date}</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2 flex-1 min-w-[120px]">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-700">{sessionData.time}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Amount</span>
            <span className="text-3xl font-black text-primary-500">₹{sessionData.amount}</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-5">Scan & Pay with Any UPI App</p>
          
          <div className="w-48 h-48 border-4 border-primary-500 rounded-2xl overflow-hidden p-2 mb-5 shadow-lg shadow-primary-500/10">
            <img
              src={qrUrl}
              alt="UPI QR Code"
              className="w-full h-full rounded-xl object-contain"
            />
          </div>

          <div className="flex gap-4 items-center justify-center mb-5 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-4 object-contain" />
            <div className="w-px h-4 bg-gray-300"></div>
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Google-Pay-Logo.png" alt="GPay" className="h-4 object-contain" />
            <div className="w-px h-4 bg-gray-300"></div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-3.5 object-contain" />
          </div>

          {/* UPI ID */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 w-full hover:border-primary-200 transition-colors group">
            <span className="flex-1 text-sm font-bold text-gray-800 text-left truncate">{sessionData.mentorUpiId}</span>
            <button
              onClick={copyUpi}
              className="shrink-0 text-primary-500 active:scale-95 transition-transform bg-primary-50 p-2 rounded-xl group-hover:bg-primary-100"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Transaction ID Input */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <p className="font-bold text-gray-900">After Paying</p>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-4 pl-8">
            Send the exact amount, then enter your UPI Transaction ID (UTR) below to confirm.
          </p>
          <div className="pl-8">
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. 30219840291"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold placeholder-gray-400 transition-all shadow-sm"
            />
          </div>
        </div>

      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-5 pb-[env(safe-area-inset-bottom)] z-50">
        <button
          onClick={handleConfirmPayment}
          disabled={!txnId.trim() || submitting}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            txnId.trim() && !submitting
              ? 'bg-gray-900 text-white active:scale-[0.98] shadow-lg hover:bg-gray-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            <><CheckCircle2 className="w-5 h-5" /> I've Paid – Confirm Payment</>
          )}
        </button>
      </div>

    </div>
  );
};

export default Payment;
