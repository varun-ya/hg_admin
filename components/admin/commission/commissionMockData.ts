import type { CommissionRule, FxRate, TaxRule } from "./commissionTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const commissionKPIs: KPIItem[] = [
  { label: "Active Rules", value: "8", change: "2 tiered, 6 subject", changeType: "neutral", icon: null },
  { label: "Avg. Commission", value: "16.4%", change: "−0.8% vs last month", changeType: "down", icon: null },
  { label: "Commission Revenue (30d)", value: "$138K", change: "+12% MoM", changeType: "up", icon: null },
  { label: "FX Exposure", value: "$84K", change: "3 currencies locked", changeType: "neutral", icon: null },
];
export const commissionSparklines = [
  [6, 7, 7, 8, 8, 8, 8],
  [17.2, 17.0, 16.8, 16.6, 16.5, 16.4, 16.4],
  [110, 115, 120, 125, 130, 135, 138],
  [60, 65, 70, 75, 78, 82, 84],
];

export const commissionRules: CommissionRule[] = [
  { id: "CR-001", name: "Default Platform Rate", trigger: "flat", conditions: "All subjects, all regions", rate: "20%", status: "active", appliedTo: 8420, revenue30d: "$98,200", createdBy: "admin@homeguru.in", createdAt: "Jan 1, 2024" },
  { id: "CR-002", name: "STEM Talent Attraction", trigger: "subject", conditions: "Advanced Calculus, Quantum Physics, Organic Chemistry", rate: "12%", status: "active", appliedTo: 340, revenue30d: "$8,400", createdBy: "admin@homeguru.in", createdAt: "Feb 15, 2024" },
  { id: "CR-003", name: "High-Volume Teacher Reward", trigger: "volume", conditions: "First $500/mo → 20%, $500–$2K → 15%, $2K+ → 10%", rate: "Tiered", status: "active", appliedTo: 1200, revenue30d: "$22,100", createdBy: "karan@homeguru.in", createdAt: "Mar 1, 2024" },
  { id: "CR-004", name: "New Teacher Onboarding", trigger: "tiered", conditions: "First 30 days: 10%, Days 31–90: 15%, After: standard", rate: "Tiered", status: "active", appliedTo: 180, revenue30d: "$3,200", createdBy: "riya@homeguru.in", createdAt: "Feb 20, 2024" },
  { id: "CR-005", name: "Language Premium", trigger: "subject", conditions: "Japanese, Mandarin, Korean", rate: "15%", status: "active", appliedTo: 95, revenue30d: "$2,800", createdBy: "admin@homeguru.in", createdAt: "Jan 10, 2024" },
  { id: "CR-006", name: "Corporate B2B Override", trigger: "flat", conditions: "All B2B tenant bookings", rate: "8%", status: "active", appliedTo: 620, revenue30d: "$4,100", createdBy: "admin@homeguru.in", createdAt: "Dec 1, 2023" },
  { id: "CR-007", name: "Holiday Promo Rate", trigger: "flat", conditions: "Dec 20 – Jan 5 bookings", rate: "25%", status: "archived", appliedTo: 0, revenue30d: "$0", createdBy: "admin@homeguru.in", createdAt: "Dec 18, 2023" },
  { id: "CR-008", name: "Test Arts Discount", trigger: "subject", conditions: "Music, Drawing, Dance", rate: "18%", status: "draft", appliedTo: 0, revenue30d: "$0", createdBy: "riya@homeguru.in", createdAt: "Mar 10, 2024" },
];

export const fxRates: FxRate[] = [
  { pair: "USD/INR", rate: 83.12, change24h: -0.24, lockedEscrow: "$42,800", lockExpiry: "Mar 20" },
  { pair: "USD/EUR", rate: 0.9184, change24h: 0.12, lockedEscrow: "$28,400", lockExpiry: "Mar 22" },
  { pair: "USD/GBP", rate: 0.7891, change24h: -0.08, lockedEscrow: "$12,800", lockExpiry: "Mar 19" },
];

export const taxRules: TaxRule[] = [
  { jurisdiction: "India", taxType: "GST", rate: "18%", autoWithhold: true, transactionsAffected: 4200, totalWithheld: "$48,200" },
  { jurisdiction: "EU", taxType: "VAT", rate: "20%", autoWithhold: true, transactionsAffected: 1800, totalWithheld: "$22,400" },
  { jurisdiction: "US", taxType: "Sales Tax", rate: "Varies", autoWithhold: false, transactionsAffected: 2400, totalWithheld: "$0" },
  { jurisdiction: "UK", taxType: "VAT", rate: "20%", autoWithhold: true, transactionsAffected: 680, totalWithheld: "$8,100" },
];
