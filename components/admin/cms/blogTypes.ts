export interface BlogPost {
  slug: string;
  title: string;
  desc: string;
  date: string;
  tags: string[];
  color: string;
  author: { name: string; avatar: string; role: string };
  readTime: string;
  coverImage?: string;
  content: string;
  published: boolean;
}

const A = { name: "HomeGuru Team", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=homeguru", role: "Editorial" };
const B = { name: "Priya Menon", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya", role: "Education Expert" };
const C = { name: "Aarav Sharma", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aarav", role: "IIT Bombay, Tutor" };

export const BLOGS: BlogPost[] = [
  { slug: "are-online-classes-safe-for-students", title: "Are Online Classes Safe for Students?", desc: "What global experts and doctors say about online learning safety.", date: "March 25, 2026", tags: ["Tutoring"], color: "#F97316", author: A, readTime: "6 min", published: true, content: "<p>Online classes have become a key part of modern education.</p><h2>What the Research Says</h2><p>Structured online learning sessions of 45–60 minutes with breaks are not only safe but effective.</p>" },
  { slug: "10-signs-your-child-needs-a-tutor", title: "10 Signs Your Child Needs a Tutor", desc: "Early warning signs most parents ignore.", date: "March 17, 2026", tags: ["Tutoring"], color: "#6366F1", author: B, readTime: "8 min", published: true, content: "<p>Most parents don't realize their child needs help until grades drop significantly.</p><h2>1. Homework Takes Forever</h2><p>If a 30-minute assignment takes 2+ hours, it's a sign of conceptual gaps.</p>" },
  { slug: "online-tutors-usa-uk-dubai", title: "Online Tutors for USA, UK & Dubai", desc: "Affordable 1-to-1 tuition for students worldwide.", date: "March 16, 2026", tags: ["Tutoring"], color: "#3B82F6", author: A, readTime: "5 min", published: true, content: "<p>Quality tutoring is now accessible globally with HomeGuru.</p><h2>Why Indian Tutors Are in Demand</h2><p>India produces some of the world's best educators in Maths, Science, and Coding.</p>" },
  { slug: "why-students-lose-interest", title: "Why Students Lose Interest in Studies", desc: "Understanding the root causes and how to fix them.", date: "March 14, 2026", tags: ["Study Tips"], color: "#8B5CF6", author: B, readTime: "7 min", published: true, content: "<p>Many students start with curiosity but lose motivation over time.</p><h2>The 5 Root Causes</h2><p>One-size-fits-all teaching, fear of failure, lack of real-world connection.</p>" },
  { slug: "board-exams-to-entrance-prep", title: "Board Exams to Entrance Exam Prep", desc: "How to make the transition smoothly.", date: "February 27, 2026", tags: ["Competitive Exam"], color: "#EC4899", author: C, readTime: "7 min", published: true, content: "<p>Board exams are over. Now entrance exams present a completely different challenge.</p>" },
  { slug: "handle-tough-question-paper", title: "How to Handle a Tough Question Paper", desc: "Don't panic — here's what to do.", date: "February 6, 2026", tags: ["Study Tips", "CBSE"], color: "#EF4444", author: C, readTime: "6 min", published: false, content: "<p>Every board exam season, students say: 'Paper tough tha.' But a tough paper is tough for everyone.</p>" },
];
