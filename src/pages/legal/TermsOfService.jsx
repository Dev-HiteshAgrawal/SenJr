import React from 'react';
import { FileText, UserCheck, CreditCard, Shield, AlertTriangle, Globe, Scale, Mail } from 'lucide-react';
import { FadeIn } from '../../components/common/MotionWrapper';
import { Link } from 'react-router-dom';

const Section = ({ id, icon, title, children }) => (
  <section id={id} className="mb-12 scroll-mt-24">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#10b981] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-600 leading-relaxed space-y-3 text-sm">
      {children}
    </div>
  </section>
);

const toc = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'eligibility', label: '2. Eligibility' },
  { id: 'accounts', label: '3. User Accounts' },
  { id: 'student-conduct', label: '4. Student Conduct' },
  { id: 'mentor-conduct', label: '5. Mentor Conduct' },
  { id: 'payments', label: '6. Payments & Fees' },
  { id: 'intellectual-property', label: '7. Intellectual Property' },
  { id: 'prohibited', label: '8. Prohibited Activities' },
  { id: 'disclaimers', label: '9. Disclaimers' },
  { id: 'liability', label: '10. Limitation of Liability' },
  { id: 'termination', label: '11. Termination' },
  { id: 'governing-law', label: '12. Governing Law' },
  { id: 'contact', label: '13. Contact' },
];

const TermsOfService = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <section className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#10b981] py-20 px-4 text-white text-center">
      <FadeIn>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
          <FileText className="w-4 h-4" /> Terms of Service
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Please read these terms carefully before using the Senjr platform.
        </p>
        <p className="text-white/50 text-sm mt-4">Last updated: May 17, 2025 &nbsp;·&nbsp; Effective: May 17, 2025</p>
      </FadeIn>
    </section>

    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* TOC */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Contents</p>
            <ul className="space-y-1.5">
              {toc.map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-gray-500 hover:text-[#10b981] transition-colors block py-0.5">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-12">
          <Section id="acceptance" icon={<FileText className="w-4 h-4" />} title="Acceptance of Terms">
            <p>
              By accessing or using Senjr ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and <strong>Senjr Technologies Pvt. Ltd.</strong> ("Senjr", "we", "us").
            </p>
            <p>
              If you are using Senjr on behalf of an educational institution or organization, you represent that you have the authority to bind that entity to these Terms.
            </p>
            <p>
              If you do not agree to these Terms, you must not access or use the Platform.
            </p>
          </Section>

          <Section id="eligibility" icon={<UserCheck className="w-4 h-4" />} title="Eligibility">
            <p>You must meet the following requirements to use Senjr:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You must be at least 13 years of age. Users under 18 must have parental or guardian consent.</li>
              <li>You must be a resident of India or accessing the platform legally from your jurisdiction.</li>
              <li>You must not have been previously suspended or banned from Senjr.</li>
              <li>You must provide accurate, truthful information when registering.</li>
            </ul>
            <p>
              Mentor accounts are additionally required to provide verifiable proof of their educational qualifications and expertise before activation.
            </p>
          </Section>

          <Section id="accounts" icon={<Shield className="w-4 h-4" />} title="User Accounts">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You must not share your password with any third party. Senjr will never ask for your password via email or phone.
            </p>
            <p>
              You are responsible for all activity that occurs under your account. If you believe your account has been compromised, notify us immediately at <a href="mailto:security@senjr.in" className="text-[#10b981] hover:underline">security@senjr.in</a>.
            </p>
            <p>
              You may not create multiple accounts for the same individual. Accounts may not be sold, transferred, or assigned.
            </p>
          </Section>

          <Section id="student-conduct" icon={<UserCheck className="w-4 h-4" />} title="Student Conduct">
            <p>As a student on Senjr, you agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Attend booked sessions punctually or cancel with adequate notice (minimum 6 hours).</li>
              <li>Treat mentors with respect and professionalism at all times during sessions.</li>
              <li>Use the platform only for legitimate academic and learning purposes.</li>
              <li>Provide honest and accurate feedback and reviews after sessions.</li>
              <li>Not record video sessions without the mentor's explicit consent.</li>
              <li>Not request tutoring for prohibited content (see Section 8).</li>
            </ul>
          </Section>

          <Section id="mentor-conduct" icon={<UserCheck className="w-4 h-4" />} title="Mentor Conduct">
            <p>As a mentor on Senjr, you agree to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Provide accurate information about your qualifications, expertise, and experience.</li>
              <li>Conduct sessions in a professional, respectful, and academically appropriate manner.</li>
              <li>Maintain your availability calendar and honor all confirmed bookings.</li>
              <li>Not solicit payment outside the Senjr platform from students you meet through the platform.</li>
              <li>Not engage in any romantic, sexual, or otherwise inappropriate relationships with students.</li>
              <li>Not share confidential student information with third parties.</li>
              <li>Maintain the quality of sessions. Accounts with consistently low ratings (below 3.0 average) may be reviewed or suspended.</li>
            </ul>
          </Section>

          <Section id="payments" icon={<CreditCard className="w-4 h-4" />} title="Payments & Fees">
            <p><strong>For Students:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Session fees are displayed upfront before booking confirmation.</li>
              <li>Payment is collected at the time of booking and held until session completion.</li>
              <li>Refunds for cancelled sessions are processed within 5–7 business days to the original payment method.</li>
              <li>Sessions cancelled by students within 6 hours of the start time may not be eligible for a full refund.</li>
            </ul>

            <p className="mt-3"><strong>For Mentors:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Mentors receive 85% of the session fee. Senjr retains 15% as a platform fee.</li>
              <li>Earnings are disbursed weekly, every Monday, subject to a minimum balance of ₹500.</li>
              <li>Mentors are solely responsible for reporting and paying applicable taxes on their earnings.</li>
              <li>Senjr may withhold payments if there is a dispute or investigation pending.</li>
            </ul>

            <p className="mt-3">
              All payments are processed by Razorpay, a PCI-DSS compliant payment gateway. By making a payment, you agree to Razorpay's Terms of Service.
            </p>
          </Section>

          <Section id="intellectual-property" icon={<Globe className="w-4 h-4" />} title="Intellectual Property">
            <p>
              All content on the Senjr platform — including the logo, design, code, text, graphics, and AI models — is owned by Senjr Technologies Pvt. Ltd. and is protected under Indian copyright and intellectual property law.
            </p>
            <p>
              Content created by mentors during sessions (notes, recordings with consent, study materials) remains the intellectual property of the mentor, unless explicitly agreed otherwise.
            </p>
            <p>
              You may not copy, reproduce, distribute, or create derivative works of any Senjr content without our prior written consent.
            </p>
          </Section>

          <Section id="prohibited" icon={<AlertTriangle className="w-4 h-4" />} title="Prohibited Activities">
            <p>The following activities are strictly prohibited on Senjr:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Impersonating any person or entity, or misrepresenting your qualifications</li>
              <li>Uploading or sharing content that is obscene, defamatory, illegal, or violates third-party rights</li>
              <li>Using Senjr to facilitate academic dishonesty (e.g., completing assignments or exams for a student)</li>
              <li>Attempting to bypass payment systems or solicit off-platform transactions</li>
              <li>Scraping, data mining, or automated access to the platform</li>
              <li>Using the platform to spread misinformation, hate speech, or discriminatory content</li>
              <li>Uploading malware, viruses, or any harmful code</li>
              <li>Violating any applicable Indian or international law</li>
            </ul>
            <p>
              Violations may result in immediate account termination without refund, and may be reported to relevant law enforcement authorities.
            </p>
          </Section>

          <Section id="disclaimers" icon={<AlertTriangle className="w-4 h-4" />} title="Disclaimers">
            <p>
              Senjr is a marketplace platform that connects students with mentors. We do not guarantee the quality, accuracy, or effectiveness of any specific mentor's teaching.
            </p>
            <p>
              The AI Tutor feature is powered by Google's Gemini AI. Senjr does not guarantee the accuracy of AI-generated responses and encourages users to verify information with qualified instructors.
            </p>
            <p>
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </Section>

          <Section id="liability" icon={<Scale className="w-4 h-4" />} title="Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE INDIAN LAW, SENJR TECHNOLOGIES PVT. LTD. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
            <p>
              IN NO EVENT SHALL SENJR'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE TOTAL AMOUNT PAID BY YOU TO SENJR IN THE THREE (3) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
            </p>
          </Section>

          <Section id="termination" icon={<AlertTriangle className="w-4 h-4" />} title="Termination">
            <p>
              Senjr reserves the right to suspend or terminate your account at any time, with or without notice, for violations of these Terms, fraudulent activity, or behavior that harms other users or the platform.
            </p>
            <p>
              You may terminate your account at any time by going to Profile Settings → Account → "Delete Account". Termination will not relieve you of any obligations incurred prior to termination, including outstanding payments.
            </p>
          </Section>

          <Section id="governing-law" icon={<Scale className="w-4 h-4" />} title="Governing Law & Disputes">
            <p>
              These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of Senjr shall be subject to the exclusive jurisdiction of the courts of <strong>Bengaluru, Karnataka, India</strong>.
            </p>
            <p>
              Before initiating any legal proceeding, you agree to first attempt to resolve disputes by contacting Senjr support at <a href="mailto:legal@senjr.in" className="text-[#10b981] hover:underline">legal@senjr.in</a>. We will make a good-faith effort to resolve the dispute within 30 days.
            </p>
            <p>
              For consumer disputes, you may also approach the relevant consumer forum under the Consumer Protection Act, 2019.
            </p>
          </Section>

          <Section id="contact" icon={<Mail className="w-4 h-4" />} title="Contact">
            <p>For any queries about these Terms, contact us at:</p>
            <div className="bg-gray-50 rounded-xl p-4 mt-2 space-y-1">
              <p><strong>Senjr Technologies Pvt. Ltd.</strong></p>
              <p>Legal: <a href="mailto:legal@senjr.in" className="text-[#10b981] hover:underline">legal@senjr.in</a></p>
              <p>Support: <Link to="/contact" className="text-[#10b981] hover:underline">Contact Form</Link></p>
              <p>Office: Bengaluru, Karnataka, India – 560001</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  </div>
);

export default TermsOfService;
