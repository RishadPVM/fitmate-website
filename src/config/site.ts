export interface StoreConfig {
  appStoreUrl: string | null;
  googlePlayUrl: string | null;
}

export interface SocialLinkConfig {
  label: string;
  key: 'instagram' | 'x' | 'linkedin' | 'youtube';
  url: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SITE = {
  brandName: 'FitMate',
  tagline: 'Your Fitness Journey. Better Connected.',
  siteUrl: 'https://fitmate.fit',
  title: 'FitMate — Your Fitness Journey. Better Connected. | Gym & Fitness Platform',
  description:
    'Connect with your gym, track attendance, view membership info, and explore BMI insights. 100% free for gym members on iPhone and Android.',
  keywords: [
    'FitMate Fitness App',
    'Gym Management Platform',
    'Gym Management Software',
    'Fitness App for Gym Members',
    'Gym Attendance App',
    'Gym Membership Management',
    'Fitness Progress Tracking',
    'BMI Calculator',
    'Health Tracking App',
    'Gym Member Management',
  ],
  stores: {
    // Replace null with official published URLs when available; QR code activates automatically once a verified URL is configured.
    appStoreUrl: null,
    googlePlayUrl: null,
  } as StoreConfig,
  contact: {
    placeholderLabel: 'Official FitMate contact channels will be listed here upon public directory release.',
    gymInquiryNote: 'Gym owners & member inquiries: Connect through your participating fitness club or official FitMate support channels once published.',
  },
  socials: [
    { label: 'Instagram', key: 'instagram', url: null },
    { label: 'X (Twitter)', key: 'x', url: null },
    { label: 'LinkedIn', key: 'linkedin', url: null },
    { label: 'YouTube', key: 'youtube', url: null },
  ] as SocialLinkConfig[],
  navLinks: [
    { label: 'Home', href: '#hero', sectionId: 'hero' },
    { label: 'Why FitMate', href: '#why-fitmate', sectionId: 'why-fitmate' },
    { label: 'Benefits', href: '#intro', sectionId: 'intro' },
    { label: 'Health & Progress', href: '#health-bmi', sectionId: 'health-bmi' },
    { label: 'For Gyms', href: '#better-experience', sectionId: 'better-experience' },
    { label: 'About', href: '#about', sectionId: 'about' },
  ],
} as const;

export const HERO_CONTENT = {
  eyebrow: 'Gym & Fitness Companion',
  headlineLines: ['Your Fitness Journey.', 'A Smarter Way Forward.'],
  description:
    'Stay connected with your gym, build consistency, understand your progress, and take control of your fitness journey with FitMate.',
  primaryCta: 'Download FitMate',
  secondaryCta: 'Discover FitMate',
} as const;

export const INTRO_CONTENT = {
  eyebrow: '01 · Brand Philosophy',
  headline: 'More Than Just a Fitness App.',
  description: [
    'Fitness is not just about lifting weights or counting workouts. It is about consistency, discipline, understanding your body, and making progress every day.',
    'FitMate brings a more connected and organized experience to your fitness journey.',
  ],
  highlights: [
    {
      number: '01',
      title: 'Stay Connected',
      description: 'Stay connected with your gym and your fitness routine.',
    },
    {
      number: '02',
      title: 'Build Consistency',
      description: 'Make regular attendance and workout habits part of your lifestyle.',
    },
    {
      number: '03',
      title: 'Understand Your Progress',
      description: 'Get a better understanding of your body through meaningful health insights.',
    },
  ],
} as const;

export const WHY_FITMATE_CONTENT = {
  eyebrow: '02 · Why FitMate',
  headline: 'Why Choose FitMate?',
  subheadline: 'Built around clarity, daily rhythm, and a stronger link between you and the gym you train at.',
  benefits: [
    {
      id: 'organized-experience',
      title: 'A More Organized Gym Experience',
      description: 'Keep your essential training schedule, club connection, and routine details cleanly structured in one calm space.',
      accentLabel: 'Clarity',
      featured: true,
    },
    {
      id: 'gym-information',
      title: 'Convenient Access to Gym Information',
      description: 'Find key details connected to your fitness club effortlessly without digging through scattered messages.',
      accentLabel: 'Access',
      featured: false,
    },
    {
      id: 'attendance-tracking',
      title: 'Easy Attendance Tracking',
      description: 'Follow every check-in and build momentum as individual gym sessions turn into dependable weekly streaks.',
      accentLabel: 'Momentum',
      featured: false,
    },
    {
      id: 'membership-visibility',
      title: 'Membership Visibility',
      description: 'Stay informed about your membership status and essential plan dates with clear, anytime visibility.',
      accentLabel: 'Transparency',
      featured: false,
    },
    {
      id: 'fitness-consistency',
      title: 'Better Fitness Consistency',
      description: 'Turn short-term motivation into an enduring habit by keeping your training rhythm front and center.',
      accentLabel: 'Habit',
      featured: false,
    },
    {
      id: 'health-awareness',
      title: 'Personal Health Awareness',
      description: 'Explore helpful body measurements and foundational metrics that keep you grounded in real personal awareness.',
      accentLabel: 'Awareness',
      featured: false,
    },
    {
      id: 'progress-habits',
      title: 'Progress-Oriented Fitness Habits',
      description: 'Focus on steady movement forward rather than guesswork, helping every session feel purposeful.',
      accentLabel: 'Direction',
      featured: false,
    },
    {
      id: 'connected-experience',
      title: 'A Connected Member & Gym Experience',
      description: 'Bridge the gap between fitness clubs and the people who train inside them every single week.',
      accentLabel: 'Connection',
      featured: true,
    },
  ],
} as const;

export const ATTENDANCE_CONTENT = {
  eyebrow: '03 · Routine & Rhythm',
  headline: 'Consistency Is the Real Secret.',
  description: [
    'Every workout matters. Every visit brings you one step closer to your goals.',
    'FitMate helps you stay connected with your gym attendance and encourages you to build a consistent fitness routine.',
  ],
  sampleTag: 'Illustrative Sample Schedule · Demonstration View',
  sampleDisclaimer: 'Shown with fictional demonstration data to illustrate how weekly training habits appear in FitMate.',
  weeklySchedule: [
    { day: 'Monday', short: 'Mon', status: 'Completed', focus: 'Strength Foundation' },
    { day: 'Tuesday', short: 'Tue', status: 'Completed', focus: 'Conditioning & Core' },
    { day: 'Wednesday', short: 'Wed', status: 'Completed', focus: 'Upper Body Focus' },
    { day: 'Thursday', short: 'Thu', status: 'Completed', focus: 'Lower Body & Mobility' },
    { day: 'Friday', short: 'Fri', status: 'Upcoming', focus: 'Scheduled Session' },
  ],
  monthlyPattern: [
    1, 1, 0, 1, 1, 0, 0,
    1, 1, 1, 0, 1, 1, 0,
    1, 0, 1, 1, 1, 0, 0,
    1, 1, 1, 1, 2, 0, 0,
  ], // 0 = rest day, 1 = completed demo visit, 2 = upcoming demo session
} as const;

export const BMI_CATEGORIES = [
  {
    key: 'underweight',
    label: 'Underweight',
    range: 'Below 18.5',
    min: 0,
    max: 18.499,
    summary: 'A BMI below 18.5 falls into the underweight screening range for adults.',
    colorVar: 'var(--bmi-underweight)',
  },
  {
    key: 'normal',
    label: 'Normal range',
    range: '18.5–24.9',
    min: 18.5,
    max: 24.999,
    summary: 'A BMI between 18.5 and 24.9 falls within the standard adult normal screening range.',
    colorVar: 'var(--bmi-normal)',
  },
  {
    key: 'overweight',
    label: 'Overweight',
    range: '25–29.9',
    min: 25,
    max: 29.999,
    summary: 'A BMI between 25.0 and 29.9 falls into the overweight screening range for adults.',
    colorVar: 'var(--bmi-overweight)',
  },
  {
    key: 'obesity',
    label: 'Obesity',
    range: '30 and above',
    min: 30,
    max: Infinity,
    summary: 'A BMI of 30.0 or above falls within the obesity screening range for adults.',
    colorVar: 'var(--bmi-obesity)',
  },
] as const;

export const SHOWCASE_SCREENS = [
  {
    id: 'dashboard',
    label: 'Fitness Dashboard',
    title: 'Your Daily Training Hub',
    caption: 'A calm overview uniting club connection, attendance rhythm, and personal wellness in one clear glance.',
  },
  {
    id: 'attendance',
    label: 'Attendance Overview',
    title: 'Track Every Visit',
    caption: 'Visual weekly and monthly attendance markers keep consistency front and center without clutter.',
  },
  {
    id: 'membership',
    label: 'Membership Info',
    title: 'Clear Plan Visibility',
    caption: 'Review your connected gym membership details and active standing whenever you need them.',
  },
  {
    id: 'bmi',
    label: 'BMI Insights',
    title: 'Understand Your Body',
    caption: 'Explore Body Mass Index calculations alongside clear educational context and range indicators.',
  },
  {
    id: 'metrics',
    label: 'Health Metrics',
    title: 'Measurements Over Time',
    caption: 'Observe body measurement changes gracefully so progress feels informed and sustainable.',
  },
  {
    id: 'progress',
    label: 'Personal Progress',
    title: 'Make Every Workout Count',
    caption: 'Connect attendance habits with body awareness to stay motivated week after week.',
  },
] as const;

export const FAQS: FaqItem[] = [
  {
    question: 'What is FitMate?',
    answer:
      'FitMate is a modern Gym & Fitness Management Platform designed to connect gyms and their members. It gives gym members a clean companion experience to stay connected with their gym, keep track of attendance, check membership information, and explore personal health and BMI insights.',
  },
  {
    question: 'Is FitMate free for gym members?',
    answer:
      'Yes. FitMate is 100% free for individual gym members—there is no FitMate subscription fee for members. Gyms pay for the FitMate platform so their members can enjoy the FitMate experience free of charge. Note that your regular gym membership fees are set separately by your gym.',
  },
  {
    question: 'Do I need to pay to download FitMate?',
    answer:
      'No. Downloading and using the FitMate companion app does not cost members anything. There is no FitMate membership or app fee charged to individual gym members.',
  },
  {
    question: 'Is FitMate available on Android?',
    answer:
      'Yes, FitMate is built for Android devices and distributed through Google Play. Official store download buttons on this page connect directly to Google Play once the published store link is active.',
  },
  {
    question: 'Is FitMate available on iPhone?',
    answer:
      'Yes, FitMate is designed for iPhone and available through the Apple App Store. Official download buttons on this website link directly to the App Store as soon as the published store link is configured.',
  },
  {
    question: 'How does gym attendance work?',
    answer:
      'FitMate keeps your gym visits organized in a clear attendance overview so you can follow your training days, maintain weekly consistency, and stay motivated over time alongside your connected gym.',
  },
  {
    question: 'Can I view my membership information?',
    answer:
      'Yes. FitMate gives connected members convenient visibility into their gym membership information so essential details stay accessible right from their phone.',
  },
  {
    question: 'What is BMI?',
    answer:
      'BMI (Body Mass Index) is a widely used general screening measurement calculated from your height and weight using the formula BMI = Weight (kg) / Height (m)². While BMI helps indicate broad weight categories for adults, it does not directly measure body fat and is not a medical diagnosis—individual interpretation can vary.',
  },
  {
    question: 'Can FitMate help me understand my fitness progress?',
    answer:
      'Yes. By bringing together regular attendance tracking, workout consistency, and helpful body measurement insights like BMI, FitMate helps you stay aware of your routine and understand how your habits evolve over time.',
  },
  {
    question: 'How can my gym get started with FitMate?',
    answer:
      'Gyms partner directly with FitMate to offer a smarter, more organized experience for their members. Gym owners and managers can reach out through our official FitMate contact channels once published, or connect with us as onboarding opens.',
  },
];
