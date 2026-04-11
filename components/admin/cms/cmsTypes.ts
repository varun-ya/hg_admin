export type PageStatus = "published" | "draft" | "scheduled" | "archived";

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  lastEdited: string;
  editedBy: string;
  template: "landing" | "blog" | "legal" | "marketing" | "pricing" | "custom";
  views: number;
  seoScore: number;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl: string;
  content?: string;
}

export interface CmsBlock {
  id: string;
  type: "hero" | "text" | "image" | "cta" | "testimonials" | "faq" | "pricing" | "stats";
  label: string;
  content: string;
  imageUrl?: string;
  order: number;
}

export interface CmsMedia {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document";
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PageAnalytics {
  pageId: string;
  visitors: number;
  uniqueVisitors: number;
  avgTimeOnPage: string;
  bounceRate: number;
  topReferrers: { source: string; visits: number }[];
  dailyViews: { date: string; views: number }[];
  deviceSplit: { device: string; pct: number }[];
  countrySplit: { country: string; flag: string; pct: number }[];
}

export interface SeoAuditItem {
  id: string;
  check: string;
  status: "pass" | "warning" | "fail";
  detail: string;
}
