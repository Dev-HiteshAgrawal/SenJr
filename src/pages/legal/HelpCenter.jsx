import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Users, CreditCard, Video, Shield, Zap, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '../../components/common/MotionWrapper';

const faqs = [
  {
    category: 'Getting Started',
    icon: <Zap className="w-5 h-5" />,
    color: '#10b981',
    bg: '#D1FAE5',
    questions: [
      {
        q: 'How do I create a Senjr account?',
        a: 'Click "Get Started" on the homepage and choose whether you\'re a student or a mentor. Students complete a 4-step profile setup covering their grade, subjects, and goals. Mentors go through a 4-step verification process including their expertise and availability.'
      },
      {
        q: 'Is Senjr free to use?',
        a: 'Creating an account is free. Students pay per session based on the mentor\'s hourly rate. Mentors keep 85% of every session fee, with Senjr taking a 15% platform fee to cover infrastructure, support, and payment processing.'
      },
      {
        q: 'What subjects does Senjr cover?',
        a: 'Senjr covers all major Indian curriculum subjects (CBSE, ICSE, State boards) including Mathematics, Physics, Chemistry, Biology, English, Economics, and more. We also have specialized mentors for JEE, NEET, UPSC, SSC, and competitive exams.'
      }
    ]
  },
  {
    category: 'Sessions & Booking',
    icon: <Video className="w-5 h-5" />,
    color: '#7C3AED',
    bg: '#F5F3FF',
    questions: [
      {
        q: 'How do I book a session with a mentor?',
        a: 'Go to "Find a Mentor", search by subject or name, view their profile, then click "Book Session". Choose your preferred date, time slot, and session duration (30/45/60/90 min). Confirm the booking and complete payment to lock your slot.'
      },
      {
        q: 'What happens if a mentor cancels my session?',
        a: 'If a mentor cancels within 24 hours of the scheduled session, you receive a full refund to your original payment method within 3–5 business days. You\'ll also receive a priority voucher to rebook at no extra charge.'
      },
      {
        q: 'Can I reschedule a booked session?',
        a: 'Yes. You can reschedule a session up to 6 hours before the start time without any fee. Rescheduling within 6 hours may incur a 10% convenience fee. Contact support if you have an emergency situation.'
      },
      {
        q: 'How does the video call work?',
        a: 'Sessions are conducted via Senjr\'s built-in video platform (powered by LiveKit). No additional software is needed — just click "Join Session" at the scheduled time. The platform supports HD video, screen sharing, and a shared whiteboard.'
      }
    ]
  },
  {
    category: 'Payments & Refunds',
    icon: <CreditCard className="w-5 h-5" />,
    color: '#B45309',
    bg: '#FFF7ED',
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI (GPay, PhonePe, Paytm), all major debit/credit cards (Visa, Mastercard, RuPay), and net banking. All transactions are secured with 256-bit SSL encryption.'
      },
      {
        q: 'How do I get a refund?',
        a: 'Refund requests can be raised within 48 hours of a completed session if you experienced technical issues or the session quality was unsatisfactory. Go to Sessions → select the session → "Report an Issue". Valid refunds are processed within 5–7 business days.'
      },
      {
        q: 'When do mentors receive their payment?',
        a: 'Mentor earnings are processed every Monday. Payments are transferred directly to the bank account or UPI ID linked in the Mentor Earnings section. The minimum withdrawal threshold is ₹500.'
      }
    ]
  },
  {
    category: 'Mentors',
    icon: <Users className="w-5 h-5" />,
    color: '#1E40AF',
    bg: '#EFF6FF',
    questions: [
      {
        q: 'Who can become a mentor on Senjr?',
        a: 'Anyone with proven expertise can apply — college students, graduates, working professionals, or teachers. You\'ll need to set your subject areas, upload your qualifications, set your hourly rate, and pass a short profile review by our team.'
      },
      {
        q: 'How do I set my availability?',
        a: 'In your Mentor Dashboard, go to "Availability Settings". You can toggle availability for each day of the week and set your active hours. Students will only be able to book sessions during your available slots.'
      },
      {
        q: 'Can I teach multiple subjects?',
        a: 'Yes! You can add up to 5 subject areas to your mentor profile. We recommend specializing in 2–3 subjects where you have the strongest expertise to maintain high session ratings.'
      }
    ]
  },
  {
    category: 'Account & Privacy',
    icon: <Shield className="w-5 h-5" />,
    color: '#065F46',
    bg: '#ECFDF5',
    questions: [
      {
        q: 'How is my personal data protected?',
        a: 'Senjr complies with the Indian IT Act 2000 and follows industry-standard data protection practices. We never sell your personal data to third parties. All data is stored on encrypted servers with restricted access. See our Privacy Policy for full details.'
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Profile Settings → Account → "Delete Account". This will permanently remove your profile, session history, and payment information after a 30-day grace period. Pending payouts will still be processed before deletion is finalized.'
      }
    ]
  }
];

const AccordionItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="text-sm font-semibold text-gray-800 group-hover:text-[#10b981] transition-colors">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#10b981] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#10b981] py-20 px-4 text-white text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" /> Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            How can we help you?
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8">
            Find answers to common questions about sessions, payments, mentors, and more.
          </p>
          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none shadow-lg"
            />
          </div>
        </FadeIn>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        {!searchQuery && (
          <>
            <FadeIn>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Browse by Category</h2>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16" staggerDelay={0.06}>
              {faqs.map(cat => (
                <StaggerItem key={cat.category}>
                  <HoverCard
                    onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                    className={`p-4 text-center cursor-pointer ${activeCategory === cat.category ? 'ring-2 ring-[#10b981]' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: cat.bg, color: cat.color }}>
                      {cat.icon}
                    </div>
                    <p className="text-xs font-bold text-gray-700">{cat.category}</p>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}

        {/* FAQ Sections */}
        <div className="space-y-8">
          {(searchQuery ? filtered : activeCategory ? faqs.filter(c => c.category === activeCategory) : faqs).map(cat => (
            <FadeIn key={cat.category}>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100" style={{ backgroundColor: cat.bg }}>
                  <div style={{ color: cat.color }}>{cat.icon}</div>
                  <h3 className="font-bold text-gray-900">{cat.category}</h3>
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60" style={{ color: cat.color }}>
                    {cat.questions.length} articles
                  </span>
                </div>
                <div className="px-6">
                  {cat.questions.map((faq, i) => (
                    <AccordionItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Still need help? */}
        <FadeIn delay={0.3}>
          <div className="mt-16 text-center bg-gradient-to-r from-[#064E3B] to-[#10b981] rounded-3xl p-10 text-white">
            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-white/70 mb-6">Our support team responds within 24 hours on business days.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#064E3B] font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" /> Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default HelpCenter;
