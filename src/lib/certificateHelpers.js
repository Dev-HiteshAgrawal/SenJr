import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createDocument } from './firestore';

/** Format: SENJR-YEAR-RANDOMNUMBER (6-digit random suffix) */
function generateCertificateId() {
  const year = new Date().getFullYear();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `SENJR-${year}-${n}`;
}

/**
 * Format a date as "DD Month YYYY"
 */
function formatDateLong(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Build the premium certificate HTML string
 */
function buildCertificateHTML({
  recipientName,
  programmeName,
  mentorName,
  issueDate,
  duration,
  sessionsCompleted,
  sessionsTotal,
  certId,
  verificationUrl,
  type
}) {
  const bodyText = type === 'mentor'
    ? `has demonstrated exceptional commitment to nurturing student growth on the <span class="highlight">Senjr</span> platform, guiding learners through personalized mentorship sessions with dedication, patience, and expertise.`
    : `has successfully completed all requirements of the mentorship programme on the <span class="highlight">Senjr</span> platform, demonstrating commitment, curiosity, and consistent growth throughout the journey. This achievement reflects dedication to learning and the transformative power of guided mentorship.`;

  const titleText = type === 'mentor' ? 'Certificate of Excellence' : 'Certificate of Completion';
  const eyebrowText = type === 'mentor' ? 'This is to honour' : 'This is to certify that';
  const presentedText = type === 'mentor' ? 'Proudly awarded to' : 'Proudly presented to';
  const badgeLabelText = type === 'mentor' ? 'Programme Mentored' : 'Programme Completed';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Cinzel:wght@400;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 1056px; height: 748px; overflow: hidden; font-family: 'DM Sans', sans-serif; }
    .cert-wrap { width: 1056px; height: 748px; position: relative; overflow: hidden; background: #faf8f2; }
    .cert-wrap::before { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); background-size: 400px 400px; pointer-events: none; z-index: 0; }
    .corner { position: absolute; width: 88px; height: 88px; z-index: 2; }
    .corner svg { width: 100%; height: 100%; }
    .corner.tl { top: 18px; left: 18px; }
    .corner.tr { top: 18px; right: 18px; transform: scaleX(-1); }
    .corner.bl { bottom: 18px; left: 18px; transform: scaleY(-1); }
    .corner.br { bottom: 18px; right: 18px; transform: scale(-1,-1); }
    .border-outer { position: absolute; inset: 14px; border: 1.5px solid #c9a96e; z-index: 1; }
    .border-inner { position: absolute; inset: 22px; border: .5px solid rgba(201,169,110,.45); z-index: 1; }
    .side-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 7px; background: linear-gradient(180deg, #b8892e 0%, #e8c96b 30%, #c9a040 60%, #f0d878 80%, #b8892e 100%); z-index: 3; }
    .cert-body { position: absolute; inset: 0; display: flex; z-index: 5; }
    .left-col { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding: 46px 28px 36px 40px; border-right: .5px solid rgba(201,169,110,.3); }
    .logo-mark { width: 64px; height: 64px; background: linear-gradient(135deg, #1a1a18 60%, #2e2b24); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2px #c9a96e, 0 0 0 5px rgba(201,169,110,.15), 0 8px 24px rgba(0,0,0,.22); margin-bottom: 10px; }
    .logo-mark svg { width: 34px; height: 34px; }
    .brand-name { font-family: 'Cinzel', serif; font-size: 18px; letter-spacing: .22em; color: #1a1a18; font-weight: 600; margin-bottom: 4px; }
    .brand-tagline { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: #8a7a5a; margin-bottom: 32px; }
    .divider { width: 80%; height: .5px; background: linear-gradient(90deg, transparent, #c9a96e, transparent); margin: 0 auto 28px; }
    .meta-block { width: 100%; margin-bottom: 20px; }
    .meta-label { font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: #c9a96e; margin-bottom: 4px; }
    .meta-value { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #1a1a18; line-height: 1.35; word-break: break-word; hyphens: auto; }
    .left-footer { margin-top: auto; width: 100%; text-align: center; }
    .cert-id-label { font-size: 7.5px; letter-spacing: .15em; text-transform: uppercase; color: #b0a080; margin-bottom: 3px; }
    .cert-id-value { font-size: 9px; color: #6b5e3e; font-family: 'DM Sans', monospace; letter-spacing: .08em; word-break: break-word; }
    .right-col { flex: 1; display: flex; flex-direction: column; padding: 44px 48px 36px 40px; }
    .cert-header { text-align: center; margin-bottom: 8px; }
    .cert-eyebrow { font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: #c9a96e; margin-bottom: 10px; }
    .cert-title { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 400; color: #1a1a18; letter-spacing: .08em; line-height: 1.1; margin-bottom: 14px; }
    .cert-subtitle-line { width: 120px; height: 1px; background: linear-gradient(90deg, transparent, #c9a96e, transparent); margin: 0 auto 18px; }
    .presented-to { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: #8a7a5a; margin-bottom: 6px; text-align: center; }
    .recipient-name { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 700; font-style: normal; color: #1a1a18; text-align: center; line-height: 1.1; letter-spacing: .02em; margin-bottom: 18px; word-break: break-word; hyphens: auto; }
    .cert-body-text { font-size: 11.5px; color: #4a4232; line-height: 1.7; text-align: center; max-width: 480px; margin: 0 auto 22px; }
    .highlight { color: #1a1a18; font-weight: 500; }
    .programme-badge { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, rgba(201,169,110,.12), rgba(201,169,110,.04)); border: .75px solid rgba(201,169,110,.4); border-radius: 4px; padding: 12px 18px; margin: 0 auto 24px; max-width: 460px; width: 100%; }
    .badge-icon { width: 32px; height: 32px; flex-shrink: 0; }
    .badge-label { font-size: 7.5px; letter-spacing: .18em; text-transform: uppercase; color: #c9a96e; margin-bottom: 2px; }
    .badge-programme { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: #1a1a18; font-weight: 600; line-height: 1.2; word-break: break-word; hyphens: auto; }
    .signatures { display: flex; gap: 28px; margin-top: auto; }
    .sig-block { flex: 1; text-align: center; }
    .sig-line { height: .75px; background: linear-gradient(90deg, transparent 5%, #c9a96e 40%, #c9a96e 60%, transparent 95%); margin-bottom: 6px; }
    .sig-name { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-style: italic; color: #1a1a18; margin-bottom: 2px; word-break: break-word; hyphens: auto; }
    .sig-role { font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: #8a7a5a; }
    .seal { position: absolute; bottom: 60px; right: 52px; width: 90px; height: 90px; opacity: .07; z-index: 4; }
    .dots { position: absolute; z-index: 3; }
    .dots.top-center { top: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; align-items: center; }
    .dots.bottom-center { bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; align-items: center; }
    .dot { width: 4px; height: 4px; background: #c9a96e; border-radius: 50%; }
    .dot.lg { width: 6px; height: 6px; }
  </style>
</head>
<body>
<div class="cert-wrap">
  <div class="border-outer"></div><div class="border-inner"></div><div class="side-bar"></div>
  <div class="corner tl"><svg viewBox="0 0 88 88" fill="none"><path d="M4 84 L4 4 L84 4" stroke="#c9a96e" stroke-width="1.5" fill="none"/><path d="M10 78 L10 10 L78 10" stroke="#c9a96e" stroke-width=".5" fill="none" opacity=".5"/><circle cx="4" cy="4" r="3" fill="#c9a96e"/><path d="M16 4 Q28 4 28 16" stroke="#c9a96e" stroke-width=".8" fill="none" opacity=".6"/><circle cx="28" cy="28" r="2.5" fill="none" stroke="#c9a96e" stroke-width=".8" opacity=".7"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 88 88" fill="none"><path d="M4 84 L4 4 L84 4" stroke="#c9a96e" stroke-width="1.5" fill="none"/><path d="M10 78 L10 10 L78 10" stroke="#c9a96e" stroke-width=".5" fill="none" opacity=".5"/><circle cx="4" cy="4" r="3" fill="#c9a96e"/><path d="M16 4 Q28 4 28 16" stroke="#c9a96e" stroke-width=".8" fill="none" opacity=".6"/><circle cx="28" cy="28" r="2.5" fill="none" stroke="#c9a96e" stroke-width=".8" opacity=".7"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 88 88" fill="none"><path d="M4 84 L4 4 L84 4" stroke="#c9a96e" stroke-width="1.5" fill="none"/><path d="M10 78 L10 10 L78 10" stroke="#c9a96e" stroke-width=".5" fill="none" opacity=".5"/><circle cx="4" cy="4" r="3" fill="#c9a96e"/><path d="M16 4 Q28 4 28 16" stroke="#c9a96e" stroke-width=".8" fill="none" opacity=".6"/><circle cx="28" cy="28" r="2.5" fill="none" stroke="#c9a96e" stroke-width=".8" opacity=".7"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 88 88" fill="none"><path d="M4 84 L4 4 L84 4" stroke="#c9a96e" stroke-width="1.5" fill="none"/><path d="M10 78 L10 10 L78 10" stroke="#c9a96e" stroke-width=".5" fill="none" opacity=".5"/><circle cx="4" cy="4" r="3" fill="#c9a96e"/><path d="M16 4 Q28 4 28 16" stroke="#c9a96e" stroke-width=".8" fill="none" opacity=".6"/><circle cx="28" cy="28" r="2.5" fill="none" stroke="#c9a96e" stroke-width=".8" opacity=".7"/></svg></div>
  <div class="dots top-center"><div class="dot"></div><div class="dot lg"></div><div class="dot"></div></div>
  <div class="dots bottom-center"><div class="dot"></div><div class="dot lg"></div><div class="dot"></div></div>
  <div class="seal"><svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="46" stroke="#8a6a2e" stroke-width="2.5"/><circle cx="50" cy="50" r="38" stroke="#8a6a2e" stroke-width="1"/><text x="50" y="44" text-anchor="middle" font-family="Cinzel, serif" font-size="9" fill="#8a6a2e" letter-spacing="2">SENJR</text><text x="50" y="57" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="6" fill="#8a6a2e" letter-spacing="1">CERTIFIED</text><path d="M20 64 Q50 80 80 64" stroke="#8a6a2e" stroke-width="1" fill="none"/></svg></div>
  <div class="cert-body">
    <div class="left-col">
      <div class="logo-mark"><svg viewBox="0 0 34 34" fill="none"><path d="M10 8 C10 8 24 8 24 14 C24 20 10 20 10 26 C10 26 10 26 24 26" stroke="#c9a96e" stroke-width="2.2" stroke-linecap="round" fill="none"/><circle cx="10" cy="8" r="2" fill="#c9a96e"/><circle cx="24" cy="26" r="2" fill="#c9a96e"/></svg></div>
      <div class="brand-name">Senjr</div><div class="brand-tagline">SENJR · Mentorship Platform</div><div class="divider"></div>
      <div class="meta-block"><div class="meta-label">Date Issued</div><div class="meta-value">${issueDate}</div></div>
      <div class="meta-block"><div class="meta-label">Duration</div><div class="meta-value">${duration || 'N/A'}</div></div>
      <div class="meta-block"><div class="meta-label">Mentor</div><div class="meta-value">${mentorName}</div></div>
      <div class="meta-block"><div class="meta-label">Sessions Completed</div><div class="meta-value">${sessionsCompleted ?? '–'}${sessionsTotal != null ? ` of ${sessionsTotal}` : ''}</div></div>
      <div class="meta-block"><div class="meta-label">Verification</div><div class="meta-value" style="font-size:12px;line-height:1.4">${verificationUrl || ''}</div></div>
      <div class="left-footer"><div class="divider" style="margin-bottom:14px"></div><div class="cert-id-label">Certificate ID</div><div class="cert-id-value">${certId}</div></div>
    </div>
    <div class="right-col">
      <div class="cert-header"><div class="cert-eyebrow">${eyebrowText}</div><h1 class="cert-title">${titleText}</h1><div class="cert-subtitle-line"></div></div>
      <div class="presented-to">${presentedText}</div><div class="recipient-name">${recipientName}</div>
      <div class="programme-badge"><svg class="badge-icon" viewBox="0 0 32 32" fill="none"><path d="M16 3 L20 12 L30 13.5 L23 20 L24.7 30 L16 25.5 L7.3 30 L9 20 L2 13.5 L12 12 Z" fill="rgba(201,169,110,.2)" stroke="#c9a96e" stroke-width="1.2"/><circle cx="16" cy="16" r="4" fill="#c9a96e" opacity=".7"/></svg><div class="badge-text"><div class="badge-label">${badgeLabelText}</div><div class="badge-programme">${programmeName}</div></div></div>
      <div class="cert-body-text">${bodyText}</div>
      <div class="signatures"><div class="sig-block"><div class="sig-line"></div><div class="sig-name">${mentorName}</div><div class="sig-role">Mentor</div></div><div class="sig-block"><div class="sig-line"></div><div class="sig-name">Senjr Team</div><div class="sig-role">Platform Authority</div></div><div class="sig-block"><div class="sig-line"></div><div class="sig-name">${issueDate}</div><div class="sig-role">Date of Issue</div></div></div>
    </div>
  </div>
</div>
</body>
</html>`;
}

/**
 * Generate and download a premium certificate as PDF
 *
 * @param {Object} opts
 * @param {'student'|'mentor'} opts.type
 * @param {string} opts.studentName
 * @param {string} opts.mentorName
 * @param {string} opts.subject          Programme / subject name
 * @param {string} opts.duration          e.g. "1 Month"
 * @param {string} opts.dateOfIssue
 * @param {string} opts.mentorCollege
 * @param {number} opts.studentCount      For mentor certs
 * @param {string} opts.subjects          For mentor certs
 * @param {string} opts.userId
 * @param {boolean} opts.persist          Save record to Firestore
 * @param {string} opts.certificateId     Optional pre-generated ID
 */
export async function generateAndDownloadCertificate({
  type = 'student',
  studentName,
  mentorName,
  mentorId,
  studentId,
  subject,
  duration,
  dateOfIssue,
  mentorCollege,
  studentCount,
  sessionsCompleted: providedSessionsCompleted,
  sessionsTotal: providedSessionsTotal,
  subjects,
  userId,
  persist = true,
  certificateId,
}) {
  const certId = certificateId || generateCertificateId();
  const issueDate = dateOfIssue || formatDateLong(new Date());
  const verificationUrl = `https://senjr.vercel.app/verify/${certId}`;

  const recipientName = type === 'mentor' ? mentorName : studentName;
  const programmeName = type === 'mentor'
    ? (subjects || subject || 'Mentorship Programme')
    : (subject || 'Mentorship Programme');

  const sessionsCompleted = providedSessionsCompleted ?? (type === 'mentor' ? (studentCount || '–') : '–');
  const sessionsTotal = providedSessionsTotal ?? (type === 'mentor' ? (studentCount || '–') : '–');

  const htmlString = buildCertificateHTML({
    recipientName,
    programmeName,
    mentorName: mentorName || 'Senjr Mentor',
    issueDate,
    duration: duration || (type === 'mentor' ? 'Ongoing' : null),
    sessionsCompleted,
    sessionsTotal,
    certId,
    verificationUrl,
    type,
  });

  // Create an off-screen container to render the certificate
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;z-index:-1;';
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  const certElement = container.querySelector('.cert-wrap');

  try {
    // Render to canvas using html2canvas
    const canvas = await html2canvas(certElement, {
      width: 1056,
      height: 748,
      scale: 2,
      useCORS: true,
      backgroundColor: '#faf8f2',
      logging: false,
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1056, 748],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 1056, 748);

    // Save certificate record to Firestore
    if (persist) {
      try {
        const generatedAt = new Date().toISOString();
        const certRecord =
          type === 'student'
            ? {
                certificateId: certId,
                certId,
                studentId: studentId || userId || null,
                studentName: studentName || recipientName || null,
                mentorId: mentorId || null,
                mentorName: mentorName || null,
                subject: subject || programmeName || null,
                sessionsCompleted: typeof sessionsCompleted === 'number' ? sessionsCompleted : sessionsCompleted ?? null,
                generatedAt,
                isValid: true,
                verificationUrl,
                type,
                dateOfIssue: issueDate,
              }
            : {
                certificateId: certId,
                certId,
                mentorId: userId || null,
                mentorName: mentorName || recipientName || null,
                subject: subjects || subject || programmeName || null,
                sessionsCompleted: studentCount || null,
                generatedAt,
                isValid: true,
                verificationUrl,
                type,
                dateOfIssue: issueDate,
              };
        await createDocument('certificates', certRecord);
      } catch (err) {
        console.error('Failed to save certificate record:', err);
      }
    }

    // Trigger download
    const filename = `Senjr-Certificate-${certId}.pdf`;
    pdf.save(filename);

    return certId;
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
}
