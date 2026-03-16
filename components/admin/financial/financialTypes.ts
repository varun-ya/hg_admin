// ── Revenue & Escrow ──
export type Gateway = "razorpay" | "stripe" | "paypal";
export type TxnDestination = "escrow" | "revenue";
export type TxnStatus = "cleared" | "pending" | "failed";

export interface Transaction {
  id: string;
  txnId: string;
  date: string;
  studentName: string;
  teacherName: string;
  totalAmount: number;
  platformCut: number;
  teacherPayout: number;
  gateway: Gateway;
  destination: TxnDestination;
  status: TxnStatus;
}

// ── Payouts ──
export type PayoutStatus = "ready" | "locked" | "processing" | "failed" | "completed";

export interface Payout {
  id: string;
  teacherName: string;
  aegisId: string;
  clearedAmount: number;
  bankAccount: string;
  bankName: string;
  expectedDate: string;
  status: PayoutStatus;
  classCount: number;
}

export interface PayoutBooking {
  classId: string;
  subject: string;
  studentName: string;
  date: string;
  amount: number;
}

// ── Refunds ──
export type RefundReason = "tech_failure" | "no_show" | "quality" | "unauthorized" | "cancellation";
export type ApprovalStatus = "pending" | "approved_1of2" | "approved_2of2" | "rejected" | "auto_approved";

export interface Refund {
  id: string;
  refundId: string;
  studentName: string;
  originalTxnId: string;
  amount: number;
  reason: RefundReason;
  approvalStatus: ApprovalStatus;
  requestedAt: string;
  approver1?: string;
}

export interface RefundEvidence {
  osmiumJoinTime: string;
  osmiumLeaveTime: string;
  sessionDurationMin: number;
  connectionDrops: number;
  teachingOccurred: boolean;
  transcriptSummary: string;
  studentClaim: string;
}

// ── Invoices ──
export type InvoiceType = "platform_invoice" | "student_receipt";
export type InvoiceStatus = "generated" | "sent" | "failed" | "regenerating";

export interface Invoice {
  id: string;
  invoiceId: string;
  date: string;
  billTo: string;
  type: InvoiceType;
  total: number;
  taxComponent: number;
  taxRate: string;
  status: InvoiceStatus;
}

export const REFUND_REASON_LABELS: Record<RefundReason, string> = {
  tech_failure: "Tech Failure",
  no_show: "No-Show",
  quality: "Quality Complaint",
  unauthorized: "Unauthorized Charge",
  cancellation: "Cancellation",
};

export const APPROVAL_LABELS: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved_1of2: "1/2 Approved",
  approved_2of2: "2/2 Approved",
  rejected: "Rejected",
  auto_approved: "Auto-Approved",
};
