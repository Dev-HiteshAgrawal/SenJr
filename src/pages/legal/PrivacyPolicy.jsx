import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from 'lucide-react';
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
  { id: 'overview', label: '1. Overview' },
  { id: 'data-collected', label: '2. Information We Collect' },
  { id: 'how-we-use', label: '3. How We Use Your Data' },
  { id: 'data-sharing', label: '4. Data Sharing' },
  { id: 'data-security', label: '5. Data Security' },
  { id: 'cookies', label: '6. Cookies' },
  { id: 'your-rights', label: '7. Your Rights' },
  { id: 'children', label: '8. Children\'s Privacy' },
  { id: 'changes', label: '9. Changes to This Policy' },
  { id: 'contact', label: '10. Contact Us' },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#10b981] py-20 px-4 text-white text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Your Privacy Matters</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            We are committed to protecting your personal information and your right to privacy.
          </p>
          <p className="text-white/50 text-sm mt-4">Last updated: May 17, 2025 &nbsp;·&nbsp; Effective: May 17, 2025</p>
        </FadeIn>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Contents</p>
              <ul className="space-y-1.5">
                {toc.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-gray-500 hover:text-[#10b981] transition-colors block py-0.5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-12">
            <Section id="overview" icon={<Eye className="w-4 h-4" />} title="Overview">
              <p>
                Senjr ("we", "our", "us") operates the platform available at senjr.in and its associated mobile applications. This Privacy Policy describes how we collect, use, store, and share information when you use our services, and your rights regarding that information.
              </p>
              <p>
                By creating an account or using Senjr, you agree to the collection and use of your information in accordance with this policy. If you do not agree, please do not use our platform.
              </p>
              <p>
                This policy is compliant with the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> of India.
              </p>
            </Section>

            <Section id="data-collected" icon={<Database className="w-4 h-4" />} title="Information We Collect">
              <p><strong>Information you provide directly:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Full name, email address, phone number</li>
                <li>Date of birth (to verify age for student accounts)</li>
                <li>Educational background, academic level, subjects of interest</li>
                <li>Profile photo (optional)</li>
                <li>Bank account / UPI ID details (for mentors, stored encrypted)</li>
                <li>Messages exchanged in the Senjr community or AI chat</li>
                <li>Session notes and learning goals you provide</li>
              </ul>

              <p className="mt-3"><strong>Information we collect automatically:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Device type, operating system, browser type</li>
                <li>IP address and approximate geographic location</li>
                <li>Pages visited, features used, time spent on the platform</li>
                <li>Session logs (start time, duration, completion status)</li>
                <li>Crash reports and error logs (anonymized)</li>
              </ul>
            </Section>

            <Section id="how-we-use" icon={<UserCheck className="w-4 h-4" />} title="How We Use Your Data">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Create and manage your Senjr account</li>
                <li>Match students with appropriate mentors based on subject needs</li>
                <li>Process session bookings and payments</li>
                <li>Send booking confirmations, session reminders, and receipts via email/SMS</li>
                <li>Calculate and disburse mentor earnings</li>
                <li>Provide AI Tutor and community features</li>
                <li>Improve platform performance and user experience through analytics</li>
                <li>Prevent fraud, abuse, and violations of our Terms of Service</li>
                <li>Respond to your support inquiries</li>
                <li>Send occasional product updates and educational newsletters (you may opt out anytime)</li>
              </ul>
            </Section>

            <Section id="data-sharing" icon={<Globe className="w-4 h-4" />} title="Data Sharing">
              <p>
                We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
              <p>We may share your data with:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Service providers</strong> — Firebase (Google) for database and authentication; Razorpay for payment processing; LiveKit for video sessions. These are bound by their own privacy policies.</li>
                <li><strong>Law enforcement or legal process</strong> — when required by Indian law, court order, or to protect the rights, property, or safety of Senjr or others.</li>
                <li><strong>Business transfers</strong> — in the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>
              <p>
                Between students and mentors, only your display name, profile photo, subject areas, and rating are visible. Your contact details are never shared directly between users.
              </p>
            </Section>

            <Section id="data-security" icon={<Lock className="w-4 h-4" />} title="Data Security">
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All data is transmitted over HTTPS with TLS 1.2+ encryption</li>
                <li>Passwords are hashed using bcrypt — we never store plaintext passwords</li>
                <li>Payment data (card numbers, UPI IDs) is handled by PCI-DSS compliant processors</li>
                <li>Firebase Firestore security rules restrict data access to the authenticated user</li>
                <li>Server-side API keys are stored in environment variables, never exposed to the client</li>
              </ul>
              <p>
                While we take every reasonable precaution, no method of transmission over the internet is 100% secure. If you suspect unauthorized access to your account, contact us immediately at <a href="mailto:security@senjr.in" className="text-[#10b981] hover:underline">security@senjr.in</a>.
              </p>
            </Section>

            <Section id="cookies" icon={<Shield className="w-4 h-4" />} title="Cookies & Tracking">
              <p>
                Senjr uses cookies and similar tracking technologies to maintain your login session, remember preferences, and analyze usage patterns. We use:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Essential cookies</strong> — required for authentication and platform functionality</li>
                <li><strong>Analytics cookies</strong> — anonymized usage data to improve the product (via Google Analytics)</li>
                <li><strong>Preference cookies</strong> — to remember your settings and theme</li>
              </ul>
              <p>
                You can disable non-essential cookies in your browser settings. Disabling essential cookies may prevent certain features from working correctly.
              </p>
            </Section>

            <Section id="your-rights" icon={<UserCheck className="w-4 h-4" />} title="Your Rights">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Access</strong> — request a copy of all personal data we hold about you</li>
                <li><strong>Correction</strong> — request corrections to inaccurate or incomplete data</li>
                <li><strong>Deletion</strong> — request deletion of your account and associated data (subject to legal retention obligations)</li>
                <li><strong>Portability</strong> — request your data in a machine-readable format</li>
                <li><strong>Opt-out</strong> — unsubscribe from marketing emails at any time via the link in any email</li>
              </ul>
              <p>
                To exercise any of these rights, email us at <a href="mailto:privacy@senjr.in" className="text-[#10b981] hover:underline">privacy@senjr.in</a>. We will respond within 30 days.
              </p>
            </Section>

            <Section id="children" icon={<Shield className="w-4 h-4" />} title="Children's Privacy">
              <p>
                Senjr is designed to be used by students of all ages, including those under 18. If a user is under 13 years of age, we require parental or guardian consent before creating an account.
              </p>
              <p>
                We do not knowingly collect personal data from children under 13 without verifiable parental consent. If you believe a child under 13 has provided us personal information without consent, contact us immediately and we will delete the information promptly.
              </p>
            </Section>

            <Section id="changes" icon={<Globe className="w-4 h-4" />} title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of significant changes by:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Posting the updated policy on this page with a new "Last updated" date</li>
                <li>Sending an email notification to registered users for material changes</li>
                <li>Displaying an in-app banner for 30 days after significant updates</li>
              </ul>
              <p>
                Your continued use of Senjr after the effective date of an updated policy constitutes your acceptance of the changes.
              </p>
            </Section>

            <Section id="contact" icon={<Mail className="w-4 h-4" />} title="Contact Us">
              <p>For privacy-related concerns, please contact our Data Protection Officer:</p>
              <div className="bg-gray-50 rounded-xl p-4 mt-2 space-y-1">
                <p><strong>Senjr Technologies Pvt. Ltd.</strong></p>
                <p>Email: <a href="mailto:privacy@senjr.in" className="text-[#10b981] hover:underline">privacy@senjr.in</a></p>
                <p>Support: <Link to="/contact" className="text-[#10b981] hover:underline">Contact Form</Link></p>
                <p>Office: Bengaluru, Karnataka, India – 560001</p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
