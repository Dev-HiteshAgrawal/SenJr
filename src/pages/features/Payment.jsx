import React, { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle2, Clock, Calendar, User, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Mock session data — replace with Firestore lookup via useParams().sessionId
const mockSession = {
  id: 'sess-001',
  mentorName: 'Rahul Sharma',
  mentorAvatar: 'https://i.pravatar.cc/100?img=11',
  studentName: 'Hitesh Agrawal',
  subject: 'UP Police Prep – General Awareness',
  date: 'Today, 17 May 2026',
  time: '4:00 PM',
  duration: 60,
  amount: 200,
  mentorUpiId: 'rahul.sharma@okicici',
};

const Payment = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [txnId, setTxnId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(mockSession.mentorUpiId)}&pn=Senjr&am=${mockSession.amount}&cu=INR`;

  const copyUpi = () => {
    navigator.clipboard.writeText(mockSession.mentorUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!txnId.trim()) return;
    setSubmitting(true);
    // TODO: Update Firestore session doc with transactionId and paymentStatus: 'pending'
    await new Promise(r => setTimeout(r, 1500)); // simulate API call
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] font-sans flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Submitted!</h2>
        <p className="text-sm text-gray-500 mb-2 leading-relaxed max-w-xs">
          Your transaction ID has been recorded. The mentor will confirm once the payment is verified.
        </p>
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-6 w-full max-w-xs">
          <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
          <p className="font-bold text-gray-800 text-sm">{txnId}</p>
        </div>
        <button
          onClick={() => navigate('/sessions')}
          className="w-full max-w-xs bg-[#10b981] text-white py-3.5 rounded-xl font-bold text-sm"
        >
          View My Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans text-gray-900 flex flex-col pb-24">

      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Complete Payment</h1>
        </div>
      </header>

      <main className="flex-1 px-4 pt-5 space-y-4">

        {/* Session Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={mockSession.mentorAvatar} alt={mockSession.mentorName} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{mockSession.mentorName}</p>
              <p className="text-xs text-gray-500">{mockSession.subject}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{mockSession.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{mockSession.time} · {mockSession.duration} minutes</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
            <span className="text-3xl font-black text-[#10b981]">₹{mockSession.amount}</span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Scan & Pay with Any UPI App</p>
          
          <div className="w-52 h-52 border-4 border-[#10b981] rounded-2xl overflow-hidden p-1 mb-4">
            <img
              src={qrUrl}
              alt="UPI QR Code"
              className="w-full h-full rounded-xl"
            />
          </div>

          <div className="flex gap-2 items-center justify-center mb-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-5 object-contain" />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Google-Pay-Logo.png" alt="GPay" className="h-5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-4 object-contain" />
          </div>

          {/* UPI ID */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full">
            <span className="flex-1 text-sm font-bold text-gray-800 text-left">{mockSession.mentorUpiId}</span>
            <button
              onClick={copyUpi}
              className="shrink-0 text-[#10b981] active:scale-95 transition-transform"
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Transaction ID Input */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-800 mb-1">After Paying</p>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Send the exact amount, then enter your UPI Transaction ID (UTR) below to confirm.
          </p>
          <input
            type="text"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Enter Transaction ID (UTR)"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] font-medium"
          />
        </div>

      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
        <button
          onClick={handleConfirmPayment}
          disabled={!txnId.trim() || submitting}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            txnId.trim() && !submitting
              ? 'bg-[#10b981] text-white active:bg-emerald-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> I've Paid – Confirm</>
          )}
        </button>
      </div>

    </div>
  );
};

export default Payment;
