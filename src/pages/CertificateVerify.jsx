import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import './CertificateVerify.css';

export default function CertificateVerify() {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchCert() {
      if (!certificateId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const qNew = query(collection(db, 'certificates'), where('certificateId', '==', certificateId));
        let snapshot = await getDocs(qNew);

        if (snapshot.empty) {
          const qLegacy = query(collection(db, 'certificates'), where('certId', '==', certificateId));
          snapshot = await getDocs(qLegacy);
        }

        if (snapshot.empty) {
          setNotFound(true);
        } else {
          const docSnap = snapshot.docs[0];
          const data = { id: docSnap.id, ...docSnap.data() };
          if (data.isValid === false) {
            setNotFound(true);
          } else {
            setCert(data);
          }
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCert();
  }, [certificateId]);

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

  if (notFound || !cert) {
    return (
      <div className="verify-page">
        <div className="verify-card verify-not-found">
          <div className="verify-icon">❌</div>
          <h1>Invalid Certificate</h1>
          <p>
            The certificate ID <strong>{certificateId}</strong> could not be verified.
          </p>
          <p className="verify-muted">This may be an invalid, revoked, or counterfeit certificate.</p>
          <Link to="/" className="verify-home-link">← Back to Senjr</Link>
        </div>
      </div>
    );
  }

  const displayId = cert.certificateId || cert.certId || certificateId;
  const issuedTo = cert.studentName || cert.recipientName || cert.mentorName || '—';
  const programme = cert.subject || cert.subjects || '—';
  const mentorLabel = cert.mentorName || '—';
  const issuedOn = cert.generatedAt
    ? new Date(cert.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : cert.dateOfIssue || '—';

  return (
    <div className="verify-page">
      <div className="verify-card verify-found">
        <div className="verify-badge">
          <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
            <circle cx="32" cy="32" r="30" stroke="#c9a96e" strokeWidth="2" fill="rgba(201,169,110,0.08)" />
            <path d="M20 33 L28 41 L44 25" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h1>Verified ✓</h1>
        <p className="verify-subtitle">This Senjr certificate is authentic.</p>

        <div className="verify-details">
          <div className="verify-row">
            <span className="verify-label">Certificate ID</span>
            <span className="verify-value mono">{displayId}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Student</span>
            <span className="verify-value">{issuedTo}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Mentor</span>
            <span className="verify-value">{mentorLabel}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Subject / Programme</span>
            <span className="verify-value">{programme}</span>
          </div>
          <div className="verify-divider"></div>

          <div className="verify-row">
            <span className="verify-label">Date</span>
            <span className="verify-value">{issuedOn}</span>
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
