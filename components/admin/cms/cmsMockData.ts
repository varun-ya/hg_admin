import type { CmsPage, CmsBlock, CmsMedia, PageAnalytics, SeoAuditItem } from "./cmsTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const cmsKPIs: KPIItem[] = [
  { label: "Published Pages", value: "24", change: "+2 this week", changeType: "up", icon: null },
  { label: "Draft Pages", value: "7", change: "3 pending review", changeType: "neutral", icon: null },
  { label: "Avg SEO Score", value: "84", change: "+3 vs last month", changeType: "up", icon: null },
  { label: "Total Page Views (30d)", value: "142K", change: "+18% MoM", changeType: "up", icon: null },
];

export const cmsSparklines = [
  [18, 19, 20, 21, 22, 23, 24],
  [5, 6, 8, 7, 9, 8, 7],
  [78, 79, 80, 81, 82, 83, 84],
  [98000, 105000, 112000, 120000, 128000, 135000, 142000],
];

export const cmsPages: CmsPage[] = [
  { id: "PG-001", title: "Homepage", slug: "/", status: "published", lastEdited: "Today, 11:30 AM", editedBy: "admin@homeguruworld.com", template: "landing", views: 48200, seoScore: 92, metaTitle: "HomeGuru — Find Your Perfect Tutor, Matched by AI", metaDescription: "Connect with 12,000+ verified tutors across 80+ subjects. AI-powered matching, live 1-on-1 classes, and guaranteed results.", ogImage: "hero-banner-v3.webp", canonicalUrl: "https://homeguruworld.com/" },
  { id: "PG-002", title: "Find a Tutor", slug: "/find-tutor", status: "published", lastEdited: "Yesterday, 4:15 PM", editedBy: "riya@homeguruworld.com", template: "marketing", views: 32100, seoScore: 88, metaTitle: "Find a Tutor — HomeGuru", metaDescription: "Search from 12,000+ tutors by subject, budget, and availability.", ogImage: "find-tutor-og.webp", canonicalUrl: "https://homeguruworld.com/find-tutor" },
  { id: "PG-003", title: "Become a Teacher", slug: "/teach", status: "published", lastEdited: "Mar 10, 2:00 PM", editedBy: "admin@homeguruworld.com", template: "landing", views: 18400, seoScore: 85, metaTitle: "Teach on HomeGuru — Earn on Your Schedule", metaDescription: "Join 12,000+ tutors earning $400+/month teaching what you love.", ogImage: "teach-og.webp", canonicalUrl: "https://homeguruworld.com/teach" },
  { id: "PG-004", title: "Pricing Plans", slug: "/pricing", status: "published", lastEdited: "Mar 8, 10:30 AM", editedBy: "karan@homeguruworld.com", template: "pricing", views: 14200, seoScore: 90, metaTitle: "Pricing — HomeGuru", metaDescription: "Transparent pricing. Free trial, no credit card required.", ogImage: "pricing-og.webp", canonicalUrl: "https://homeguruworld.com/pricing" },
  { id: "PG-005", title: "About Us", slug: "/about", status: "published", lastEdited: "Mar 5, 3:45 PM", editedBy: "riya@homeguruworld.com", template: "marketing", views: 8900, seoScore: 82, metaTitle: "About HomeGuru", metaDescription: "Our mission is to democratize quality education through AI.", ogImage: "about-og.webp", canonicalUrl: "https://homeguruworld.com/about" },
  { id: "PG-006", title: "Blog — AI in Education", slug: "/blog/ai-education-2024", status: "published", lastEdited: "Mar 11, 9:00 AM", editedBy: "admin@homeguruworld.com", template: "blog", views: 6200, seoScore: 78, metaTitle: "How AI is Transforming Education in 2024", metaDescription: "Explore how AI tutoring, adaptive learning, and smart matching are reshaping education.", ogImage: "blog-ai-og.webp", canonicalUrl: "https://homeguruworld.com/blog/ai-education-2024" },
  { id: "PG-007", title: "Terms of Service", slug: "/legal/terms", status: "published", lastEdited: "Feb 28, 11:00 AM", editedBy: "karan@homeguruworld.com", template: "legal", views: 2100, seoScore: 65, metaTitle: "Terms of Service — HomeGuru", metaDescription: "HomeGuru platform terms and conditions.", ogImage: "", canonicalUrl: "https://homeguruworld.com/legal/terms" },
  { id: "PG-008", title: "Privacy Policy", slug: "/legal/privacy", status: "published", lastEdited: "Feb 28, 11:30 AM", editedBy: "karan@homeguruworld.com", template: "legal", views: 1800, seoScore: 62, metaTitle: "Privacy Policy — HomeGuru", metaDescription: "How we collect, use, and protect your data.", ogImage: "", canonicalUrl: "https://homeguruworld.com/legal/privacy" },
  { id: "PG-009", title: "Summer Campaign 2024", slug: "/summer-2024", status: "draft", lastEdited: "Today, 09:45 AM", editedBy: "riya@homeguruworld.com", template: "marketing", views: 0, seoScore: 71, metaTitle: "Summer Learning Festival — HomeGuru", metaDescription: "50% off your first month. Limited time offer.", ogImage: "summer-og.webp", canonicalUrl: "https://homeguruworld.com/summer-2024" },
  { id: "PG-010", title: "IELTS Prep Landing", slug: "/ielts-prep", status: "draft", lastEdited: "Yesterday, 6:00 PM", editedBy: "admin@homeguruworld.com", template: "landing", views: 0, seoScore: 76, metaTitle: "IELTS Preparation — HomeGuru", metaDescription: "1-on-1 IELTS coaching with band 8+ tutors.", ogImage: "ielts-og.webp", canonicalUrl: "https://homeguruworld.com/ielts-prep" },
  { id: "PG-011", title: "Teacher Onboarding Guide", slug: "/guides/teacher-onboarding", status: "scheduled", lastEdited: "Mar 11, 5:00 PM", editedBy: "riya@homeguruworld.com", template: "blog", views: 0, seoScore: 80, metaTitle: "Teacher Onboarding Guide — HomeGuru", metaDescription: "Everything you need to start teaching on HomeGuru.", ogImage: "", canonicalUrl: "https://homeguruworld.com/guides/teacher-onboarding" },
  { id: "PG-012", title: "Diwali Offer 2023", slug: "/diwali-2023", status: "archived", lastEdited: "Nov 15, 2023", editedBy: "admin@homeguruworld.com", template: "marketing", views: 24800, seoScore: 74, metaTitle: "Diwali Special — HomeGuru", metaDescription: "Celebrate Diwali with 40% off all plans.", ogImage: "diwali-og.webp", canonicalUrl: "https://homeguruworld.com/diwali-2023" },
  { id: "PG-013", title: "Blog — Study Tips for Board Exams", slug: "/blog/study-tips-board-exams", status: "published", lastEdited: "Mar 9, 1:00 PM", editedBy: "riya@homeguruworld.com", template: "blog", views: 4800, seoScore: 81, metaTitle: "Study Tips for Board Exams 2026", metaDescription: "Expert tips to ace your CBSE and ICSE board exams.", ogImage: "blog-study-og.webp", canonicalUrl: "https://homeguruworld.com/blog/study-tips-board-exams" },
  { id: "PG-014", title: "Blog — IELTS Speaking Guide", slug: "/blog/ielts-speaking-guide", status: "draft", lastEdited: "Mar 11, 4:00 PM", editedBy: "admin@homeguruworld.com", template: "blog", views: 0, seoScore: 73, metaTitle: "IELTS Speaking Guide — HomeGuru", metaDescription: "Master IELTS speaking with our comprehensive guide.", ogImage: "", canonicalUrl: "https://homeguruworld.com/blog/ielts-speaking-guide" },
  { id: "PG-015", title: "Refund Policy", slug: "/legal/refund", status: "published", lastEdited: "Feb 28, 12:00 PM", editedBy: "karan@homeguruworld.com", template: "legal", views: 1200, seoScore: 60, metaTitle: "Refund Policy — HomeGuru", metaDescription: "Our refund and cancellation policy.", ogImage: "", canonicalUrl: "https://homeguruworld.com/legal/refund" },
  { id: "PG-016", title: "Tutor Agreement", slug: "/legal/tutor-agreement", status: "published", lastEdited: "Feb 28, 12:30 PM", editedBy: "karan@homeguruworld.com", template: "legal", views: 900, seoScore: 58, metaTitle: "Tutor Agreement — HomeGuru", metaDescription: "Terms for tutors on the HomeGuru platform.", ogImage: "", canonicalUrl: "https://homeguruworld.com/legal/tutor-agreement" },
  { id: "PG-017", title: "Careers", slug: "/about/careers", status: "published", lastEdited: "Mar 6, 2:00 PM", editedBy: "riya@homeguruworld.com", template: "marketing", views: 3200, seoScore: 77, metaTitle: "Careers at HomeGuru", metaDescription: "Join our team and shape the future of education.", ogImage: "careers-og.webp", canonicalUrl: "https://homeguruworld.com/about/careers" },
  { id: "PG-018", title: "Our Team", slug: "/about/team", status: "published", lastEdited: "Mar 4, 11:00 AM", editedBy: "admin@homeguruworld.com", template: "marketing", views: 2100, seoScore: 75, metaTitle: "Our Team — HomeGuru", metaDescription: "Meet the people behind HomeGuru.", ogImage: "team-og.webp", canonicalUrl: "https://homeguruworld.com/about/team" },
  { id: "PG-019", title: "Student Onboarding", slug: "/guides/student-onboarding", status: "published", lastEdited: "Mar 7, 3:00 PM", editedBy: "riya@homeguruworld.com", template: "blog", views: 1800, seoScore: 79, metaTitle: "Student Onboarding Guide — HomeGuru", metaDescription: "Get started as a student on HomeGuru.", ogImage: "", canonicalUrl: "https://homeguruworld.com/guides/student-onboarding" },
  { id: "PG-020", title: "JEE Prep Landing", slug: "/subjects/jee-prep", status: "published", lastEdited: "Mar 10, 9:00 AM", editedBy: "admin@homeguruworld.com", template: "landing", views: 5400, seoScore: 86, metaTitle: "JEE Preparation — HomeGuru", metaDescription: "1-on-1 JEE coaching with IIT alumni tutors.", ogImage: "jee-og.webp", canonicalUrl: "https://homeguruworld.com/subjects/jee-prep" },
  { id: "PG-021", title: "NEET Prep Landing", slug: "/subjects/neet-prep", status: "published", lastEdited: "Mar 10, 9:30 AM", editedBy: "admin@homeguruworld.com", template: "landing", views: 4200, seoScore: 84, metaTitle: "NEET Preparation — HomeGuru", metaDescription: "1-on-1 NEET coaching with doctor tutors.", ogImage: "neet-og.webp", canonicalUrl: "https://homeguruworld.com/subjects/neet-prep" },
  { id: "PG-022", title: "Coding for Kids", slug: "/subjects/coding-kids", status: "draft", lastEdited: "Mar 11, 2:00 PM", editedBy: "riya@homeguruworld.com", template: "landing", views: 0, seoScore: 72, metaTitle: "Coding for Kids — HomeGuru", metaDescription: "Fun coding classes for children aged 6-14.", ogImage: "", canonicalUrl: "https://homeguruworld.com/subjects/coding-kids" },
];

export const sampleBlocks: CmsBlock[] = [
  { id: "BL-001", type: "hero", label: "Hero Banner", content: "Find Your Perfect Tutor, Matched by AI", imageUrl: "hero-banner-v3.webp", order: 1 },
  { id: "BL-002", type: "stats", label: "Platform Stats", content: "80K+ Students | 12K+ Teachers | 4.7★ Rating", order: 2 },
  { id: "BL-003", type: "text", label: "How It Works", content: "1. Tell us what you need → 2. AI matches you → 3. Start learning", order: 3 },
  { id: "BL-004", type: "image", label: "Feature Screenshot", content: "Platform dashboard preview", imageUrl: "platform-demo.webp", order: 4 },
  { id: "BL-005", type: "testimonials", label: "Student Reviews", content: "3 featured testimonials with avatars", order: 5 },
  { id: "BL-006", type: "pricing", label: "Pricing Section", content: "Free trial | Standard $29/mo | Premium $49/mo", order: 6 },
  { id: "BL-007", type: "faq", label: "FAQ Section", content: "8 frequently asked questions with expandable answers", order: 7 },
  { id: "BL-008", type: "cta", label: "Bottom CTA", content: "Start Your Free Trial Today — No Credit Card Required", order: 8 },
];

export const pageAnalytics: PageAnalytics = {
  pageId: "PG-001",
  visitors: 48200,
  uniqueVisitors: 31400,
  avgTimeOnPage: "2m 34s",
  bounceRate: 38.2,
  topReferrers: [
    { source: "Google Organic", visits: 18400 },
    { source: "Direct", visits: 12800 },
    { source: "Instagram Ads", visits: 6200 },
    { source: "WhatsApp Share", visits: 4100 },
    { source: "Facebook", visits: 3200 },
    { source: "YouTube", visits: 1800 },
  ],
  dailyViews: [
    { date: "Mar 6", views: 1420 },
    { date: "Mar 7", views: 1580 },
    { date: "Mar 8", views: 1340 },
    { date: "Mar 9", views: 1890 },
    { date: "Mar 10", views: 2100 },
    { date: "Mar 11", views: 1760 },
    { date: "Mar 12", views: 2240 },
  ],
  deviceSplit: [
    { device: "Mobile", pct: 62 },
    { device: "Desktop", pct: 31 },
    { device: "Tablet", pct: 7 },
  ],
  countrySplit: [
    { country: "India", flag: "🇮🇳", pct: 58 },
    { country: "United States", flag: "🇺🇸", pct: 16 },
    { country: "United Kingdom", flag: "🇬🇧", pct: 10 },
    { country: "UAE", flag: "🇦🇪", pct: 8 },
    { country: "Others", flag: "🌍", pct: 8 },
  ],
};

export const seoAudit: SeoAuditItem[] = [
  { id: "SEO-01", check: "Meta title length", status: "pass", detail: "52 characters — within 50–60 range" },
  { id: "SEO-02", check: "Meta description length", status: "pass", detail: "148 characters — within 120–160 range" },
  { id: "SEO-03", check: "H1 tag present", status: "pass", detail: "Single H1 found: 'Find Your Perfect Tutor'" },
  { id: "SEO-04", check: "Open Graph image", status: "pass", detail: "OG image set: hero-banner-v3.webp (1200×630)" },
  { id: "SEO-05", check: "Canonical URL", status: "pass", detail: "Self-referencing canonical set correctly" },
  { id: "SEO-06", check: "Image alt attributes", status: "warning", detail: "2 of 8 images missing alt text" },
  { id: "SEO-07", check: "Internal links", status: "pass", detail: "14 internal links found" },
  { id: "SEO-08", check: "Page load speed", status: "warning", detail: "LCP: 2.8s — target < 2.5s" },
  { id: "SEO-09", check: "Mobile responsiveness", status: "pass", detail: "All viewport breakpoints pass" },
  { id: "SEO-10", check: "Structured data", status: "fail", detail: "No JSON-LD schema markup found" },
  { id: "SEO-11", check: "HTTPS", status: "pass", detail: "SSL certificate valid, HSTS enabled" },
  { id: "SEO-12", check: "Sitemap inclusion", status: "pass", detail: "Page listed in sitemap.xml" },
];

export const cmsMedia: CmsMedia[] = [
  { id: "MD-001", name: "hero-banner-v3.webp", url: "#", type: "image", size: "284 KB", uploadedAt: "Today, 11:30 AM", uploadedBy: "admin@homeguruworld.com" },
  { id: "MD-002", name: "teacher-spotlight.mp4", url: "#", type: "video", size: "12.4 MB", uploadedAt: "Yesterday, 3:00 PM", uploadedBy: "riya@homeguruworld.com" },
  { id: "MD-003", name: "platform-demo.webp", url: "#", type: "image", size: "156 KB", uploadedAt: "Mar 10, 10:00 AM", uploadedBy: "admin@homeguruworld.com" },
  { id: "MD-004", name: "terms-v4.pdf", url: "#", type: "document", size: "89 KB", uploadedAt: "Feb 28, 11:00 AM", uploadedBy: "karan@homeguruworld.com" },
  { id: "MD-005", name: "find-tutor-og.webp", url: "#", type: "image", size: "198 KB", uploadedAt: "Mar 8, 2:00 PM", uploadedBy: "riya@homeguruworld.com" },
  { id: "MD-006", name: "summer-og.webp", url: "#", type: "image", size: "312 KB", uploadedAt: "Mar 9, 11:00 AM", uploadedBy: "riya@homeguruworld.com" },
];
