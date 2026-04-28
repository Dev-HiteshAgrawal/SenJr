const PROVIDER_CLASS_MAP = {
  Google: 'provider-google',
  IBM: 'provider-ibm',
  Microsoft: 'provider-microsoft',
  Harvard: 'provider-harvard',
  MIT: 'provider-mit',
  Meta: 'provider-meta',
  'Amazon AWS': 'provider-aws',
  'IIT NPTEL': 'provider-nptel',
  Cisco: 'provider-cisco',
  Oxford: 'provider-oxford',
  Yale: 'provider-yale',
  Wharton: 'provider-wharton',
  HubSpot: 'provider-hubspot',
  Canva: 'provider-canva',
  Adobe: 'provider-adobe',
  CalArts: 'provider-calarts',
  'Khan Academy': 'provider-khan',
  'British Council': 'provider-british-council',
  Coursera: 'provider-coursera',
  'EF SET': 'provider-efset',
  'LinkedIn Learning': 'provider-linkedin',
  Duke: 'provider-duke',
};

function getCertMeta(label) {
  if (label === 'FREE Certificate') {
    return {
      certType: 'cert-free',
      certText: 'FREE Certificate',
    };
  }

  return {
    certType: 'cert-audit',
    certText: label,
  };
}

function makeCourse(id, provider, title, duration, certLabel, category, url, difficulty) {
  const certMeta = getCertMeta(certLabel);

  return {
    id,
    title,
    provider,
    providerClass: PROVIDER_CLASS_MAP[provider] || 'provider-google',
    category,
    duration,
    difficulty,
    certType: certMeta.certType,
    certText: certMeta.certText,
    url,
  };
}

export const COURSES = [
  makeCourse(
    1,
    'Google',
    'Foundations of Cybersecurity',
    '20 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/learn/foundations-of-cybersecurity',
    'Beginner'
  ),
  makeCourse(
    2,
    'Google',
    'Play It Safe: Manage Security Risks',
    '15 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/learn/manage-security-risks',
    'Beginner'
  ),
  makeCourse(
    3,
    'IBM',
    'Introduction to Artificial Intelligence',
    '8 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/learn/introduction-to-ai',
    'Beginner'
  ),
  makeCourse(
    4,
    'IBM',
    'Python for Data Science',
    '25 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/learn/python-for-applied-data-science-ai',
    'Beginner'
  ),
  makeCourse(
    5,
    'Microsoft',
    'Azure Fundamentals AZ-900',
    '30 hrs',
    'FREE Certificate',
    'Tech',
    'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
    'Beginner'
  ),
  makeCourse(
    6,
    'Microsoft',
    'Power BI Data Analyst',
    '40 hrs',
    'FREE Certificate',
    'Tech',
    'https://learn.microsoft.com/en-us/training/paths/get-transform-data-power-bi/',
    'Intermediate'
  ),
  makeCourse(
    7,
    'Harvard',
    'CS50 Introduction to Computer Science',
    '100 hrs',
    'FREE Certificate',
    'Tech',
    'https://cs50.harvard.edu/x/',
    'Beginner'
  ),
  makeCourse(
    8,
    'Harvard',
    'CS50 Python',
    '50 hrs',
    'FREE Certificate',
    'Tech',
    'https://cs50.harvard.edu/python/',
    'Beginner'
  ),
  makeCourse(
    9,
    'MIT',
    'Introduction to Computer Science with Python',
    '80 hrs',
    'Free (no cert)',
    'Tech',
    'https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/',
    'Beginner'
  ),
  makeCourse(
    10,
    'Google',
    'IT Support Certificate',
    '180 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/professional-certificates/google-it-support',
    'Beginner'
  ),
  makeCourse(
    11,
    'Meta',
    'Introduction to Front-End Development',
    '30 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/learn/introduction-to-front-end-development',
    'Beginner'
  ),
  makeCourse(
    12,
    'Meta',
    'Version Control with Git',
    '14 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/learn/version-control',
    'Beginner'
  ),
  makeCourse(
    13,
    'Amazon AWS',
    'Cloud Practitioner Essentials',
    '6 hrs',
    'FREE Certificate',
    'Tech',
    'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    'Beginner'
  ),
  makeCourse(
    14,
    'IIT NPTEL',
    'Programming in Java',
    '120 hrs',
    'FREE Certificate',
    'Tech',
    'https://onlinecourses.nptel.ac.in/noc23_cs49/preview',
    'Intermediate'
  ),
  makeCourse(
    15,
    'IIT NPTEL',
    'Cloud Computing',
    '80 hrs',
    'FREE Certificate',
    'Tech',
    'https://onlinecourses.nptel.ac.in/noc26_cs29/preview',
    'Intermediate'
  ),
  makeCourse(
    16,
    'Google',
    'Advanced Data Analytics',
    '200 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.coursera.org/professional-certificates/google-advanced-data-analytics',
    'Intermediate'
  ),
  makeCourse(
    17,
    'Cisco',
    'Introduction to Cybersecurity',
    '15 hrs',
    'FREE Certificate',
    'Tech',
    'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity',
    'Beginner'
  ),
  makeCourse(
    18,
    'Google',
    'Digital Marketing and E-Commerce',
    '170 hrs',
    'FREE Certificate',
    'Business',
    'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce',
    'Beginner'
  ),
  makeCourse(
    19,
    'IIT NPTEL',
    'Financial Management',
    '40 hrs',
    'FREE Certificate',
    'Business',
    'https://onlinecourses.nptel.ac.in/noc22_mg08/preview',
    'Intermediate'
  ),
  makeCourse(
    20,
    'IIT NPTEL',
    'Marketing Management',
    '40 hrs',
    'FREE Certificate',
    'Business',
    'https://onlinecourses.nptel.ac.in/noc25_mg115/preview',
    'Beginner'
  ),
  makeCourse(
    21,
    'IIT NPTEL',
    'Entrepreneurship',
    '30 hrs',
    'FREE Certificate',
    'Business',
    'https://onlinecourses.nptel.ac.in/noc22_mg81/preview',
    'Beginner'
  ),
  makeCourse(
    22,
    'Oxford',
    'Entrepreneurship: Funding and Pitching',
    '6 hrs',
    'FREE Certificate',
    'Business',
    'https://www.sbs.ox.ac.uk/programmes/executive-education/online-learning/oxford-entrepreneurship-venture-creation-programme',
    'Intermediate'
  ),
  makeCourse(
    23,
    'Yale',
    'Financial Markets',
    '33 hrs',
    'Free Audit',
    'Business',
    'https://www.coursera.org/learn/financial-markets-global',
    'Intermediate'
  ),
  makeCourse(
    24,
    'Wharton',
    'Introduction to Marketing',
    '15 hrs',
    'Free Audit',
    'Business',
    'https://www.coursera.org/learn/wharton-marketing',
    'Beginner'
  ),
  makeCourse(
    25,
    'IIT NPTEL',
    'Project Management',
    '40 hrs',
    'FREE Certificate',
    'Business',
    'https://onlinecourses.nptel.ac.in/noc25_mg127/preview',
    'Intermediate'
  ),
  makeCourse(
    26,
    'Google',
    'Project Management Certificate',
    '180 hrs',
    'FREE Certificate',
    'Business',
    'https://www.coursera.org/professional-certificates/google-project-management',
    'Beginner'
  ),
  makeCourse(
    27,
    'HubSpot',
    'Inbound Marketing',
    '4.5 hrs',
    'FREE Certificate',
    'Business',
    'https://academy.hubspot.com/courses/inbound-marketing',
    'Beginner'
  ),
  makeCourse(
    28,
    'HubSpot',
    'Social Media Marketing',
    '6 hrs',
    'FREE Certificate',
    'Business',
    'https://academy.hubspot.com/courses/social-media',
    'Beginner'
  ),
  makeCourse(
    29,
    'Google',
    'UX Design Certificate',
    '200 hrs',
    'FREE Certificate',
    'Design',
    'https://www.coursera.org/professional-certificates/google-ux-design',
    'Beginner'
  ),
  makeCourse(
    30,
    'Canva',
    'Canva Design School',
    '5 hrs',
    'FREE Certificate',
    'Design',
    'https://www.canva.com/designschool/',
    'Beginner'
  ),
  makeCourse(
    31,
    'Adobe',
    'Adobe Express Basics',
    '3 hrs',
    'FREE Certificate',
    'Design',
    'https://www.adobe.com/express/learn',
    'Beginner'
  ),
  makeCourse(
    32,
    'IIT NPTEL',
    'Design Thinking',
    '30 hrs',
    'FREE Certificate',
    'Design',
    'https://onlinecourses.nptel.ac.in/noc24_mg72/preview',
    'Beginner'
  ),
  makeCourse(
    33,
    'CalArts',
    'Graphic Design Specialization',
    '120 hrs',
    'Free Audit',
    'Design',
    'https://www.coursera.org/specializations/graphic-design',
    'Beginner'
  ),
  makeCourse(
    34,
    'IIT NPTEL',
    'Engineering Mathematics',
    '80 hrs',
    'FREE Certificate',
    'Science',
    'https://onlinecourses.nptel.ac.in/noc21_ma58/preview',
    'Intermediate'
  ),
  makeCourse(
    35,
    'IIT NPTEL',
    'Physics for Engineers',
    '60 hrs',
    'FREE Certificate',
    'Science',
    'https://onlinecourses.nptel.ac.in/noc24_ph47/preview',
    'Beginner'
  ),
  makeCourse(
    36,
    'IIT NPTEL',
    'Chemistry for Engineers',
    '60 hrs',
    'FREE Certificate',
    'Science',
    'https://onlinecourses.nptel.ac.in/noc24_cy52/preview',
    'Beginner'
  ),
  makeCourse(
    37,
    'MIT',
    'Single Variable Calculus',
    '60 hrs',
    'Free (no cert)',
    'Science',
    'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/',
    'Intermediate'
  ),
  makeCourse(
    38,
    'Khan Academy',
    'AP Chemistry',
    '40 hrs',
    'Free (no cert)',
    'Science',
    'https://www.khanacademy.org/science/ap-chemistry-beta',
    'Intermediate'
  ),
  makeCourse(
    39,
    'Duke',
    'Data Science Math Skills',
    '20 hrs',
    'Free Audit',
    'Science',
    'https://www.coursera.org/learn/datasciencemathskills',
    'Beginner'
  ),
  makeCourse(
    40,
    'British Council',
    'Explore English',
    '24 hrs',
    'FREE Certificate',
    'Language',
    'https://www.futurelearn.com/courses/collections/explore-english',
    'Beginner'
  ),
  makeCourse(
    41,
    'IIT NPTEL',
    'Communication Skills',
    '30 hrs',
    'FREE Certificate',
    'Language',
    'https://onlinecourses.nptel.ac.in/noc25_hs17/preview',
    'Beginner'
  ),
  makeCourse(
    42,
    'Coursera',
    'English for Career Development',
    '30 hrs',
    'Free Audit',
    'Language',
    'https://www.coursera.org/learn/careerdevelopment',
    'Beginner'
  ),
  makeCourse(
    43,
    'Oxford',
    'Academic English: Writing',
    '20 hrs',
    'Free Audit',
    'Language',
    'https://www.lang.ox.ac.uk/academic-english',
    'Intermediate'
  ),
  makeCourse(
    44,
    'EF SET',
    'English Test + Certificate',
    '50 min',
    'FREE Certificate',
    'Language',
    'https://www.efset.org/',
    'Beginner'
  ),
  makeCourse(
    45,
    'Oxford',
    'Mindfulness for Wellbeing',
    '20 hrs',
    'FREE Certificate',
    'Life Skills',
    'https://www.ox.ac.uk/students/welfare/counselling/supportive-resources/mindfulness',
    'Beginner'
  ),
  makeCourse(
    46,
    'Yale',
    'The Science of Well-Being',
    '19 hrs',
    'Free Audit',
    'Life Skills',
    'https://www.coursera.org/learn/the-science-of-well-being',
    'Beginner'
  ),
  makeCourse(
    47,
    'IIT NPTEL',
    'Soft Skills',
    '40 hrs',
    'FREE Certificate',
    'Life Skills',
    'https://onlinecourses.nptel.ac.in/noc24_hs124/preview',
    'Beginner'
  ),
  makeCourse(
    48,
    'LinkedIn Learning',
    'Time Management',
    '4 hrs',
    'FREE Certificate',
    'Life Skills',
    'https://www.linkedin.com/learning/time-management-fundamentals-14548057',
    'Beginner'
  ),
  makeCourse(
    49,
    'Coursera',
    'Learning How to Learn',
    '15 hrs',
    'Free Audit',
    'Life Skills',
    'https://www.coursera.org/learn/learning-how-to-learn',
    'Beginner'
  ),
  makeCourse(
    50,
    'Google',
    'Personal Branding and Digital Presence',
    '10 hrs',
    'FREE Certificate',
    'Life Skills',
    'https://www.coursera.org/specializations/google-digital-customer-engagement',
    'Beginner'
  ),
];
