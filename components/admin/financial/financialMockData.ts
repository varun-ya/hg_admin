import type {
  Transaction, Payout, PayoutBooking, Refund, RefundEvidence,
  Invoice, TxnStatus, PayoutStatus, ApprovalStatus, InvoiceStatus,
} from "./financialTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

// ═══════════════════════════════════════════
// Revenue & Escrow
// ═══════════════════════════════════════════
export const revenueKPIs: KPIItem[] = [
  { label: "Current Escrow Balance", value: "$284,920", change: "+$12.4k today", changeType: "up", icon: null, pulseColor: "#E08A3C", usdValue: 284920, usdChange: 12400, usdChangePrefix: "+", usdChangeSuffix: " today" },
  { label: "Platform Revenue (MTD)", value: "$67,340", change: "+18.2% vs last month", changeType: "up", icon: null, usdValue: 67340 },
  { label: "Effective Take-Rate", value: "18.2%", change: "+0.3pp", changeType: "up", icon: null },
  { label: "Gateway Health", value: "3/3 Live", change: "All operational", changeType: "neutral", icon: null },
];
export const revenueSparklines = [
  [240, 252, 261, 268, 274, 280, 285],
  [42, 48, 51, 55, 59, 63, 67],
  [17.6, 17.8, 17.9, 18.0, 18.1, 18.1, 18.2],
  [1, 1, 1, 1, 1, 1, 1],
];

export const transactions: Transaction[] = [
  { id: "T-001", txnId: "TXN-88401", date: "Today, 10:42 AM", studentName: "Aarav Sharma", teacherName: "Priya Nair", totalAmount: 2400, platformCut: 432, teacherPayout: 1968, gateway: "razorpay", destination: "escrow", status: "pending" },
  { id: "T-002", txnId: "TXN-88402", date: "Today, 09:15 AM", studentName: "Vikram Singh", teacherName: "Kavya Menon", totalAmount: 1800, platformCut: 324, teacherPayout: 1476, gateway: "razorpay", destination: "revenue", status: "cleared" },
  { id: "T-003", txnId: "TXN-88403", date: "Today, 08:30 AM", studentName: "Meera Joshi", teacherName: "Arjun Reddy", totalAmount: 3600, platformCut: 648, teacherPayout: 2952, gateway: "stripe", destination: "escrow", status: "pending" },
  { id: "T-004", txnId: "TXN-88404", date: "Yesterday, 11:20 PM", studentName: "Ishita Kapoor", teacherName: "Siddharth Rao", totalAmount: 1200, platformCut: 216, teacherPayout: 984, gateway: "razorpay", destination: "revenue", status: "cleared" },
  { id: "T-005", txnId: "TXN-88405", date: "Yesterday, 09:45 PM", studentName: "Rohan Mehta", teacherName: "Neha Deshmukh", totalAmount: 4800, platformCut: 864, teacherPayout: 3936, gateway: "stripe", destination: "escrow", status: "cleared" },
  { id: "T-006", txnId: "TXN-88406", date: "Yesterday, 07:10 PM", studentName: "Ananya Patel", teacherName: "Ravi Kumar", totalAmount: 900, platformCut: 162, teacherPayout: 738, gateway: "paypal", destination: "revenue", status: "failed" },
  { id: "T-007", txnId: "TXN-88407", date: "Yesterday, 04:30 PM", studentName: "Aditya Verma", teacherName: "Sunita Iyer", totalAmount: 2100, platformCut: 378, teacherPayout: 1722, gateway: "razorpay", destination: "escrow", status: "pending" },
  { id: "T-008", txnId: "TXN-88408", date: "Mar 10, 02:15 PM", studentName: "Diya Gupta", teacherName: "Manoj Tiwari", totalAmount: 5400, platformCut: 972, teacherPayout: 4428, gateway: "stripe", destination: "revenue", status: "cleared" },
  { id: "T-009", txnId: "TXN-88409", date: "Mar 10, 11:00 AM", studentName: "Karan Malhotra", teacherName: "Priya Nair", totalAmount: 1500, platformCut: 270, teacherPayout: 1230, gateway: "razorpay", destination: "escrow", status: "cleared" },
  { id: "T-010", txnId: "TXN-88410", date: "Mar 10, 09:20 AM", studentName: "Pooja Reddy", teacherName: "Kavya Menon", totalAmount: 3000, platformCut: 540, teacherPayout: 2460, gateway: "razorpay", destination: "revenue", status: "cleared" },
  { id: "T-011", txnId: "TXN-88411", date: "Mar 9, 06:45 PM", studentName: "Nikhil Bhat", teacherName: "Arjun Reddy", totalAmount: 750, platformCut: 135, teacherPayout: 615, gateway: "paypal", destination: "revenue", status: "failed" },
  { id: "T-012", txnId: "TXN-88412", date: "Mar 9, 03:30 PM", studentName: "Shreya Nair", teacherName: "Siddharth Rao", totalAmount: 6200, platformCut: 1116, teacherPayout: 5084, gateway: "stripe", destination: "escrow", status: "cleared" },
];

// ═══════════════════════════════════════════
// Payouts
// ═══════════════════════════════════════════
export const payoutKPIs: KPIItem[] = [
  { label: "Ready for Payout", value: "$142,680", change: "38 teachers", changeType: "neutral", icon: null, usdValue: 142680 },
  { label: "Pending Escrow (Locked)", value: "$84,240", change: "24hr dispute window", changeType: "neutral", icon: null, pulseColor: "#E08A3C", usdValue: 84240 },
  { label: "Failed Transfers", value: 4, change: "+2 since yesterday", changeType: "up", icon: null, isCritical: true, pulseColor: "#C2571A" },
  { label: "Next Auto-Batch", value: "02:14:38", change: "Daily at 6:00 PM IST", changeType: "neutral", icon: null },
];
export const payoutSparklines = [
  [118, 124, 130, 135, 138, 141, 143],
  [92, 88, 85, 82, 84, 83, 84],
  [1, 0, 2, 1, 3, 2, 4],
  [24, 24, 24, 24, 24, 24, 24],
];

export const payouts: Payout[] = [
  { id: "P-001", teacherName: "Priya Nair", aegisId: "AEG-1042", clearedAmount: 8420, bankAccount: "HDFC ••4821", bankName: "HDFC Bank", expectedDate: "Today, 6:00 PM", status: "ready", classCount: 6 },
  { id: "P-002", teacherName: "Kavya Menon", aegisId: "AEG-1087", clearedAmount: 12340, bankAccount: "ICICI ••7293", bankName: "ICICI Bank", expectedDate: "Today, 6:00 PM", status: "ready", classCount: 9 },
  { id: "P-003", teacherName: "Arjun Reddy", aegisId: "AEG-1023", clearedAmount: 5680, bankAccount: "SBI ••1456", bankName: "State Bank", expectedDate: "Today, 6:00 PM", status: "ready", classCount: 4 },
  { id: "P-004", teacherName: "Siddharth Rao", aegisId: "AEG-1056", clearedAmount: 3200, bankAccount: "Axis ••8834", bankName: "Axis Bank", expectedDate: "Tomorrow", status: "locked", classCount: 2 },
  { id: "P-005", teacherName: "Neha Deshmukh", aegisId: "AEG-1091", clearedAmount: 15800, bankAccount: "HDFC ••2210", bankName: "HDFC Bank", expectedDate: "Today, 6:00 PM", status: "processing", classCount: 11 },
  { id: "P-006", teacherName: "Ravi Kumar", aegisId: "AEG-1034", clearedAmount: 2100, bankAccount: "Kotak ••5567", bankName: "Kotak Bank", expectedDate: "Today, 6:00 PM", status: "failed", classCount: 2 },
  { id: "P-007", teacherName: "Sunita Iyer", aegisId: "AEG-1078", clearedAmount: 9450, bankAccount: "ICICI ••3341", bankName: "ICICI Bank", expectedDate: "Today, 6:00 PM", status: "ready", classCount: 7 },
  { id: "P-008", teacherName: "Manoj Tiwari", aegisId: "AEG-1015", clearedAmount: 4200, bankAccount: "SBI ••9982", bankName: "State Bank", expectedDate: "Tomorrow", status: "locked", classCount: 3 },
  { id: "P-009", teacherName: "Deepa Sharma", aegisId: "AEG-1063", clearedAmount: 7600, bankAccount: "HDFC ••6614", bankName: "HDFC Bank", expectedDate: "Today, 6:00 PM", status: "completed", classCount: 5 },
  { id: "P-010", teacherName: "Amit Joshi", aegisId: "AEG-1099", clearedAmount: 1800, bankAccount: "Axis ••4420", bankName: "Axis Bank", expectedDate: "Today, 6:00 PM", status: "failed", classCount: 1 },
];

export function getPayoutBookings(_id: string): PayoutBooking[] {
  return [
    { classId: "CLS-4401", subject: "Mathematics — Calculus II", studentName: "Aarav Sharma", date: "Mar 10, 4:00 PM", amount: 1200 },
    { classId: "CLS-4402", subject: "Physics — Electromagnetism", studentName: "Vikram Singh", date: "Mar 10, 6:00 PM", amount: 1800 },
    { classId: "CLS-4403", subject: "Mathematics — Linear Algebra", studentName: "Karan Malhotra", date: "Mar 11, 10:00 AM", amount: 1500 },
    { classId: "CLS-4404", subject: "Physics — Optics", studentName: "Meera Joshi", date: "Mar 11, 2:00 PM", amount: 2400 },
    { classId: "CLS-4405", subject: "Mathematics — Statistics", studentName: "Diya Gupta", date: "Mar 12, 11:00 AM", amount: 1520 },
  ];
}

// ═══════════════════════════════════════════
// Refunds
// ═══════════════════════════════════════════
export const refundKPIs: KPIItem[] = [
  { label: "Pending Requests", value: 14, change: "+3 today", changeType: "up", icon: null, isCritical: true, pulseColor: "#C2571A" },
  { label: "Total Refunded (30d)", value: "$23,840", change: "42 refunds processed", changeType: "neutral", icon: null, usdValue: 23840 },
  { label: "Awaiting 2nd Approval", value: 3, change: "High-value queue", changeType: "neutral", icon: null, pulseColor: "#D4956A" },
  { label: "Overall Refund Rate", value: "2.4%", change: "Target: < 3%", changeType: "down", icon: null },
];
export const refundSparklines = [
  [8, 10, 12, 11, 13, 12, 14],
  [18200, 19400, 20100, 21300, 22100, 23000, 23840],
  [1, 2, 1, 3, 2, 3, 3],
  [2.8, 2.7, 2.6, 2.5, 2.5, 2.4, 2.4],
];

export const refunds: Refund[] = [
  { id: "R-001", refundId: "RFD-7701", studentName: "Aarav Sharma", originalTxnId: "TXN-88401", amount: 2400, reason: "no_show", approvalStatus: "pending", requestedAt: "Today, 11:00 AM" },
  { id: "R-002", refundId: "RFD-7702", studentName: "Vikram Singh", originalTxnId: "TXN-88320", amount: 800, reason: "tech_failure", approvalStatus: "auto_approved", requestedAt: "Today, 09:30 AM" },
  { id: "R-003", refundId: "RFD-7703", studentName: "Meera Joshi", originalTxnId: "TXN-88315", amount: 3600, reason: "no_show", approvalStatus: "approved_1of2", requestedAt: "Yesterday, 08:15 PM", approver1: "Admin Riya" },
  { id: "R-004", refundId: "RFD-7704", studentName: "Ishita Kapoor", originalTxnId: "TXN-88290", amount: 450, reason: "quality", approvalStatus: "pending", requestedAt: "Yesterday, 06:00 PM" },
  { id: "R-005", refundId: "RFD-7705", studentName: "Rohan Mehta", originalTxnId: "TXN-88275", amount: 5800, reason: "unauthorized", approvalStatus: "approved_1of2", requestedAt: "Yesterday, 02:30 PM", approver1: "Admin Karan" },
  { id: "R-006", refundId: "RFD-7706", studentName: "Ananya Patel", originalTxnId: "TXN-88260", amount: 1200, reason: "cancellation", approvalStatus: "approved_2of2", requestedAt: "Mar 10, 04:00 PM" },
  { id: "R-007", refundId: "RFD-7707", studentName: "Aditya Verma", originalTxnId: "TXN-88245", amount: 900, reason: "tech_failure", approvalStatus: "pending", requestedAt: "Mar 10, 01:15 PM" },
  { id: "R-008", refundId: "RFD-7708", studentName: "Diya Gupta", originalTxnId: "TXN-88230", amount: 2100, reason: "no_show", approvalStatus: "pending", requestedAt: "Mar 10, 10:00 AM" },
  { id: "R-009", refundId: "RFD-7709", studentName: "Karan Malhotra", originalTxnId: "TXN-88210", amount: 650, reason: "quality", approvalStatus: "rejected", requestedAt: "Mar 9, 06:45 PM" },
  { id: "R-010", refundId: "RFD-7710", studentName: "Pooja Reddy", originalTxnId: "TXN-88195", amount: 4200, reason: "no_show", approvalStatus: "approved_1of2", requestedAt: "Mar 9, 03:30 PM", approver1: "Admin Riya" },
  { id: "R-011", refundId: "RFD-7711", studentName: "Nikhil Bhat", originalTxnId: "TXN-88180", amount: 300, reason: "cancellation", approvalStatus: "auto_approved", requestedAt: "Mar 9, 11:00 AM" },
  { id: "R-012", refundId: "RFD-7712", studentName: "Shreya Nair", originalTxnId: "TXN-88165", amount: 1500, reason: "tech_failure", approvalStatus: "pending", requestedAt: "Mar 8, 09:20 AM" },
];

export function getRefundEvidence(_id: string): RefundEvidence {
  return {
    osmiumJoinTime: "Teacher: Never joined | Student: 10:00:12 AM",
    osmiumLeaveTime: "Student: 10:15:34 AM (auto-disconnect after 15m timeout)",
    sessionDurationMin: 0,
    connectionDrops: 0,
    teachingOccurred: false,
    transcriptSummary: "No teaching session occurred. The student joined at the scheduled time and waited in the room for 15 minutes. The Osmium system auto-terminated the session due to single-participant timeout.",
    studentClaim: "The teacher did not join the session at the scheduled time. I waited for 15 minutes and then left. I want a full refund.",
  };
}

// ═══════════════════════════════════════════
// Invoices & Taxes
// ═══════════════════════════════════════════
export const invoiceKPIs: KPIItem[] = [
  { label: "Tax Collected (MTD)", value: "$12,108", change: "+$840 today", changeType: "up", icon: null, usdValue: 12108, usdChange: 840, usdChangePrefix: "+", usdChangeSuffix: " today" },
  { label: "Invoices Generated", value: "1,247", change: "+38 today", changeType: "up", icon: null },
  { label: "Generation Errors", value: 3, change: "Pipeline failures", changeType: "up", icon: null, isCritical: true, pulseColor: "#C2571A" },
];
export const invoiceSparklines = [
  [8200, 9100, 9800, 10400, 11000, 11600, 12108],
  [980, 1020, 1060, 1110, 1160, 1210, 1247],
  [1, 0, 2, 1, 0, 1, 3],
];

export const invoices: Invoice[] = [
  { id: "I-001", invoiceId: "INV-20240312-001", date: "Today, 10:42 AM", billTo: "Aarav Sharma", type: "student_receipt", total: 2400, taxComponent: 432, taxRate: "18% GST", status: "generated" },
  { id: "I-002", invoiceId: "INV-20240312-002", date: "Today, 09:15 AM", billTo: "HomeGuru Platform", type: "platform_invoice", total: 1800, taxComponent: 324, taxRate: "18% GST", status: "sent" },
  { id: "I-003", invoiceId: "INV-20240312-003", date: "Today, 08:30 AM", billTo: "Meera Joshi", type: "student_receipt", total: 3600, taxComponent: 648, taxRate: "18% GST", status: "generated" },
  { id: "I-004", invoiceId: "INV-20240311-004", date: "Yesterday, 11:20 PM", billTo: "HomeGuru Platform", type: "platform_invoice", total: 4800, taxComponent: 864, taxRate: "18% GST", status: "sent" },
  { id: "I-005", invoiceId: "INV-20240311-005", date: "Yesterday, 09:45 PM", billTo: "Ishita Kapoor", type: "student_receipt", total: 1200, taxComponent: 216, taxRate: "18% GST", status: "failed" },
  { id: "I-006", invoiceId: "INV-20240311-006", date: "Yesterday, 07:10 PM", billTo: "Rohan Mehta", type: "student_receipt", total: 5400, taxComponent: 972, taxRate: "18% GST", status: "generated" },
  { id: "I-007", invoiceId: "INV-20240310-007", date: "Mar 10, 04:30 PM", billTo: "HomeGuru Platform", type: "platform_invoice", total: 2100, taxComponent: 378, taxRate: "18% GST", status: "sent" },
  { id: "I-008", invoiceId: "INV-20240310-008", date: "Mar 10, 02:15 PM", billTo: "Ananya Patel", type: "student_receipt", total: 900, taxComponent: 162, taxRate: "18% GST", status: "generated" },
  { id: "I-009", invoiceId: "INV-20240310-009", date: "Mar 10, 11:00 AM", billTo: "Aditya Verma", type: "student_receipt", total: 6200, taxComponent: 1116, taxRate: "18% GST", status: "failed" },
  { id: "I-010", invoiceId: "INV-20240309-010", date: "Mar 9, 06:45 PM", billTo: "HomeGuru Platform", type: "platform_invoice", total: 3000, taxComponent: 540, taxRate: "18% GST", status: "sent" },
  { id: "I-011", invoiceId: "INV-20240309-011", date: "Mar 9, 03:30 PM", billTo: "Diya Gupta", type: "student_receipt", total: 1500, taxComponent: 270, taxRate: "18% GST", status: "regenerating" },
];
