import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocuments, updateUser, where } from '../lib/firestore';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

export default function AdminPanel() {
  const { currentUser, userProfile } = useAuth();
  const [pendingMentors, setPendingMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const isAdmin = Boolean(currentUser) && (userProfile?.role === 'admin' || (ADMIN_EMAIL && currentUser.email === ADMIN_EMAIL));

  useEffect(() => {
    if (isAdmin) {
      fetchPendingMentors();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchPendingMentors = async () => {
    try {
      const mentors = await getDocuments(
        'users',
        where('role', '==', 'mentor'),
        where('verificationStatus', '==', 'pending')
      );
      setPendingMentors(mentors);
    } catch (err) {
      console.error('Error fetching pending mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (mentorId) => {
    try {
      await updateUser(mentorId, { verificationStatus: 'verified', verificationRejectionReason: '' });
      setPendingMentors((prev) => prev.filter((mentor) => mentor.id !== mentorId));
      alert('Mentor approved successfully.');
    } catch (err) {
      console.error('Error approving mentor:', err);
      alert('Failed to approve mentor.');
    }
  };

  const handleReject = async (mentorId) => {
    try {
      await updateUser(mentorId, {
        verificationStatus: 'unverified',
        verificationRejectionReason: rejectReason.trim(),
      });
      setPendingMentors((prev) => prev.filter((mentor) => mentor.id !== mentorId));
      setRejectingId(null);
      setRejectReason('');
      alert('Mentor rejected.');
    } catch (err) {
      console.error('Error rejecting mentor:', err);
      alert('Failed to reject mentor.');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-container animate-fade-in-up" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '4rem' }}>
      <h1 className="page-title text-center">Admin Panel</h1>
      <p className="page-subtitle text-center mb-4">Mentor verification queue</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : pendingMentors.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {pendingMentors.map((mentor) => (
            <div key={mentor.id} className="card" style={{ display: 'flex', gap: '2rem', padding: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{mentor.displayName}</h3>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>
                  {mentor.college || 'No college specified'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button className="btn-primary" onClick={() => handleApprove(mentor.id)} style={{ background: '#10b981' }}>
                    Approve
                  </button>
                  {rejectingId === mentor.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="glass-input"
                        placeholder="Reason for rejection..."
                        value={rejectReason}
                        onChange={(event) => setRejectReason(event.target.value)}
                        style={{ padding: '0.5rem' }}
                      />
                      <button
                        className="btn-secondary"
                        onClick={() => handleReject(mentor.id)}
                        style={{ color: '#ff5c5c', borderColor: 'rgba(255,92,92,0.3)' }}
                      >
                        Confirm Reject
                      </button>
                      <button className="btn-secondary" onClick={() => setRejectingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn-secondary" onClick={() => setRejectingId(mentor.id)}>
                      Reject
                    </button>
                  )}
                </div>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Document Preview</h4>
                {mentor.verificationDocumentUrl ? (
                  <a
                    href={mentor.verificationDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                  >
                    <span>📄</span> View Full Document
                  </a>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No document found.</p>
                )}
                {mentor.verificationDocumentUrl && mentor.verificationDocumentUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000' }}>
                    <img src={mentor.verificationDocumentUrl} alt="Document" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ) : mentor.verificationDocumentUrl ? (
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>PDF or another file type. Open it using the link above.</p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="empty-state-icon" style={{ fontSize: '3rem' }}>✨</div>
          <h3>All caught up!</h3>
          <p>No mentors are currently pending verification.</p>
        </div>
      )}
    </div>
  );
}
