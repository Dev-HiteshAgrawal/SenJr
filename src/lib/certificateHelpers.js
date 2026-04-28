import jsPDF from 'jspdf';
import { createDocument, COLLECTIONS } from './firestore';

// Colors
const COLORS = {
  background: '#0A0E27',
  gold: '#FFD700',
  saffron: '#FF9933',
  white: '#FFFFFF',
  lightGray: '#A0AABF'
};

function generateCertificateId() {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKL-${year}-${randomStr}`;
}

export async function generateAndDownloadCertificate({
  type = 'student', // 'student' or 'mentor'
  studentName,
  mentorName,
  subject,
  duration,
  dateOfIssue,
  mentorCollege,
  studentCount, // for mentor certificate
  subjects, // for mentor certificate
  userId,
  persist = true,
  certificateId,
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Draw background
  doc.setFillColor(COLORS.background);
  doc.rect(0, 0, width, height, 'F');

  // Decorative border - Gold
  doc.setDrawColor(COLORS.gold);
  doc.setLineWidth(2);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner border - Saffron
  doc.setDrawColor(COLORS.saffron);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, width - 30, height - 30);

  // Logo Text
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.white);
  doc.setFontSize(24);
  doc.text('Senjr ⚡', width / 2, 35, { align: 'center' });

  // Title
  doc.setFont('times', 'bold');
  doc.setTextColor(COLORS.gold);
  doc.setFontSize(40);
  doc.text('Certificate of Completion', width / 2, 60, { align: 'center' });

  // Common text settings
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.lightGray);
  doc.setFontSize(16);
  
  if (type === 'student') {
    doc.text('This certifies that', width / 2, 80, { align: 'center' });

    // Student Name
    doc.setFont('times', 'bold');
    doc.setTextColor(COLORS.saffron);
    doc.setFontSize(32);
    doc.text(studentName.toUpperCase(), width / 2, 100, { align: 'center' });

    // Details
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.lightGray);
    doc.setFontSize(16);
    doc.text('has successfully completed a mentorship program in', width / 2, 115, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.white);
    doc.setFontSize(20);
    doc.text(subject, width / 2, 130, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.lightGray);
    doc.setFontSize(16);
    doc.text('under the mentorship of', width / 2, 145, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.gold);
    doc.setFontSize(20);
    const mentorLine = `${mentorName} (${mentorCollege}) ✓`;
    doc.text(mentorLine, width / 2, 160, { align: 'center' });

    if (duration) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.lightGray);
      doc.setFontSize(14);
      doc.text(`Duration: ${duration}`, width / 2, 175, { align: 'center' });
    }
  } else if (type === 'mentor') {
    doc.text('This certifies that', width / 2, 80, { align: 'center' });

    // Mentor Name
    doc.setFont('times', 'bold');
    doc.setTextColor(COLORS.saffron);
    doc.setFontSize(32);
    doc.text(mentorName.toUpperCase(), width / 2, 100, { align: 'center' });

    // Details
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.lightGray);
    doc.setFontSize(16);
    doc.text(`has successfully mentored ${studentCount} students in`, width / 2, 120, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.white);
    doc.setFontSize(20);
    doc.text(subjects, width / 2, 140, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.lightGray);
    doc.setFontSize(16);
    doc.text('through the Senjr platform.', width / 2, 160, { align: 'center' });
  }

  // Bottom section
  const certId = certificateId || generateCertificateId();
  const issueDate = dateOfIssue || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.lightGray);
  doc.setFontSize(12);
  
  // Left side: Date
  doc.text(`Date of Issue: ${issueDate}`, 30, 190);
  
  // Right side: ID
  doc.text(`Certificate ID: ${certId}`, width - 30, 190, { align: 'right' });

  // Tagline
  doc.setFont('times', 'italic');
  doc.setTextColor(COLORS.saffron);
  doc.setFontSize(14);
  doc.text('Senjr — Real Learning from Real Experience', width / 2, 195, { align: 'center' });

  // Save to Firestore
  if (persist) {
    try {
      const certRecord = {
        id: certId,
        userId,
        type,
        studentName: studentName || null,
        mentorName: mentorName || null,
        subject: subject || null,
        subjects: subjects || null,
        studentCount: studentCount || null,
        dateOfIssue: issueDate,
        createdAt: new Date().toISOString()
      };
      await createDocument('certificates', certRecord);
    } catch (err) {
      console.error("Failed to save certificate record:", err);
    }
  }

  // Trigger download
  const filename = type === 'student' ? `${studentName}_Senjr_Certificate.pdf` : `${mentorName}_Senjr_Mentor_Certificate.pdf`;
  doc.save(filename.replace(/\s+/g, '_'));
  
  return certId;
}
