export type TenantType = "school" | "corporation" | "university";
export type TenantStatus = "active" | "trial" | "suspended" | "churned";

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  status: TenantStatus;
  subAdmins: number;
  totalStudents: number;
  activeStudents: number;
  creditsAllocated: number;
  creditsUsed: number;
  onboardedVia: "csv" | "scim" | "manual";
  createdAt: string;
}

export interface BulkInvite {
  id: string;
  tenantId: string;
  tenantName: string;
  method: "csv" | "scim";
  totalUsers: number;
  successCount: number;
  failedCount: number;
  status: "completed" | "processing" | "failed";
  initiatedBy: string;
  initiatedAt: string;
}

export interface CreditAllocation {
  id: string;
  tenantId: string;
  tenantName: string;
  department: string;
  totalCredits: number;
  usedCredits: number;
  allocatedBy: string;
  allocatedAt: string;
}
