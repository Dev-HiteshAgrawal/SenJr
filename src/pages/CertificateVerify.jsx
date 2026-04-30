import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import './CertificateVerify.css';

export default function CertificateVerify() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchCert() {
      try {
        const q = query(collection(db, 'certificates'), where('certId', '==', certId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setNotFound(true);
        } else {
          setCert({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (certId) fetchCert();
  }, [certId]);

  if (loading) {
    return (
      <div className="verify-page">
        <div className="verify-loading">
          <div className="verify-spinner"></div>
          <p>Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="verify-page">
        <div className="verify-card verify-not-found">
          <div className="verify-icon">❌</div>
          <h1>Certificate Not Found</h1>
          <p>The certificate ID <strong>{certId}</strong> does not exist in our records.</p>
          <p className="verify-muted">This may be an invalid or counterfeit certificate.</p>
          <Link to="/" className="verify-home-link">← Back to Senjr</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-card verify-found">
        <div className="verify-badge">
          <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
            <circle cx="32" cy="32" r="30" stroke="#c9a96e" strokeWidth="2" fill="rgba(201,169,110,0.08)" />
            <path d="M20 33 L28 41 L44 25" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h1>Certificate Verified ✓</h1>
        <p className="verify-subtitle">This certificate is authentic and issued by Senjr.</p>

        <div className="verify-details">
          <div className="verify-row">
            <span className="verify-label">Certificate ID</span>
            <span className="verify-value mono">{cert.certId}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Issued To</span>
            <span className="verify-value">{cert.recipientName || cert.studentName || cert.mentorName || '—'}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Type</span>
            <span className="verify-value capitalize">{cert.type === 'mentor' ? 'Mentor Excellence' : 'Student Completion'}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Programme</span>
            <span className="verify-value">{cert.subject || cert.subjects || '—'}</span>
          </div>
          <div className="verify-divider"></div>

          {cert.mentorName && cert.type === 'student' && (
            <>
              <div className="verify-row">
                <span className="verify-label">Mentor</span>
                <span className="verify-value">{cert.mentorName}</span>
              </div>
              <div className="verify-divider"></div>
            </>
          )}

          <div className="verify-row">
            <span className="verify-label">Date of Issue</span>
            <span className="verify-value">{cert.dateOfIssue || '—'}</span>
          </div>
        </div>

        <div className="verify-footer">
          <p>Verified on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <Link to="/" className="verify-home-link">← Back to Senjr</Link>
        </div>
      </div>
    </div>
  );
}
