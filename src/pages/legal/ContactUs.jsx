import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/common/MotionWrapper';

const contacts = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Email Support',
    value: 'support@senjr.in',
    desc: 'We typically respond within 24 hours',
    color: '#10b981',
    bg: '#D1FAE5',
    href: 'mailto:support@senjr.in'
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    label: 'Live Chat',
    value: 'Available Mon–Sat',
    desc: '9:00 AM – 7:00 PM IST',
    color: '#7C3AED',
    bg: '#F5F3FF',
    href: null
  },
  {
    icon: <Phone className="w-6 h-6" />,
    label: 'Phone Support',
    value: '+91 98765 43210',
    desc: 'Mon–Fri, 10 AM – 6 PM IST',
    color: '#B45309',
    bg: '#FFF7ED',
    href: 'tel:+919876543210'
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: 'Head Office',
    value: 'Bengaluru, Karnataka',
    desc: 'India – 560001',
    color: '#1E40AF',
    bg: '#EFF6FF',
    href: null
  }
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#10b981] py-20 px-4 text-white text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Mail className="w-4 h-4" /> Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Have a question, feedback, or a partnership proposal? We'd love to hear from you.
          </p>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Contact Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16" staggerDelay={0.07}>
          {contacts.map(c => (
            <StaggerItem key={c.label}>
              <HoverCard
                className="p-6 text-left"
                onClick={c.href ? () => window.open(c.href) : undefined}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: c.bg, color: c.color }}>
                  {c.icon}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{c.label}</p>
                <p className="font-bold text-gray-900 text-sm">{c.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <FadeIn delay={0.2}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-500 mb-8">Fill out the form and our team will get back to you as soon as possible.</p>

              {submitted ? (
                <div className="bg-[#D1FAE5] border border-[#10b981] rounded-2xl p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Message Received!</h3>
                  <p className="text-gray-600 text-sm">We'll reply to <strong>{form.email}</strong> within 24 hours on business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Your Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Rahul Sharma"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="rahul@email.com"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] transition-colors"
                    >
                      <option>General Inquiry</option>
                      <option>Session Issue</option>
                      <option>Payment & Billing</option>
                      <option>Mentor Application</option>
                      <option>Technical Problem</option>
                      <option>Partnership / Press</option>
                      <option>Report Abuse</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Before you write — check these first</h3>
                <ul className="space-y-3">
                  {[
                    { text: 'Browse our Help Center for instant answers', href: '/help' },
                    { text: 'Check your Sessions page for booking info', href: '/sessions' },
                    { text: 'Review our Privacy Policy for data questions', href: '/privacy' },
                    { text: 'Read Terms of Service for policy details', href: '/terms' },
                  ].map(item => (
                    <li key={item.text} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
                      <a href={item.href} className="text-sm text-gray-600 hover:text-[#10b981] transition-colors">{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#064E3B] to-[#10b981] rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Response Time Commitment</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between"><span>General Inquiries</span><span className="font-semibold text-white">≤ 24 hours</span></div>
                  <div className="flex justify-between"><span>Payment Issues</span><span className="font-semibold text-white">≤ 12 hours</span></div>
                  <div className="flex justify-between"><span>Technical Problems</span><span className="font-semibold text-white">≤ 6 hours</span></div>
                  <div className="flex justify-between"><span>Abuse Reports</span><span className="font-semibold text-white">≤ 2 hours</span></div>
                </div>
                <p className="text-xs text-white/50 mt-4">*On business days (Mon–Sat). All times IST.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
