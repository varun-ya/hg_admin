import type { StaffMember, StaffProfile, StaffKPI, RBACPermission, RBACMatrix } from "./staffTypes";

export const staffKPIs: StaffKPI[] = [
  { label: "Total Active Staff", value: 34, change: "+2 this quarter", changeType: "up", icon: "UsersThree" },
  { label: "Privileged Accounts", value: 3, change: "Target: ≤ 4", changeType: "neutral", icon: "Crown" },
  { label: "MFA / 2FA Compliance", value: "97%", change: "1 agent non-compliant", changeType: "down", icon: "ShieldCheck", isCritical: true },
  { label: "Active Sessions Now", value: 12, change: "Peak today: 18", changeType: "neutral", icon: "Pulse" },
];

export const staffMembers: StaffMember[] = [
  { id: "AG-001", name: "Navchetna Arora", email: "nav@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=nav@homeguruworld.com", aegisRole: "super_admin", department: "Engineering", mfaStatus: "enabled", status: "active", lastActiveTime: "2 min ago", lastActiveIp: "103.21.xx.xx" },
  { id: "AG-002", name: "Cersei Mehta", email: "cersei.m@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=cersei.m@homeguruworld.com", aegisRole: "trust_safety", department: "Operations", mfaStatus: "enabled", status: "active", lastActiveTime: "8 min ago", lastActiveIp: "49.36.xx.xx" },
  { id: "AG-003", name: "Jon Kapoor", email: "jon.k@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=jon.k@homeguruworld.com", aegisRole: "finance_ops", department: "Finance", mfaStatus: "enabled", status: "active", lastActiveTime: "1h ago", lastActiveIp: "122.15.xx.xx" },
  { id: "AG-004", name: "Arya Desai", email: "arya.d@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=arya.d@homeguruworld.com", aegisRole: "tier1_support", department: "Support", mfaStatus: "enabled", status: "active", lastActiveTime: "12 min ago", lastActiveIp: "103.21.xx.xx" },
  { id: "AG-005", name: "Tyrion Bhat", email: "tyrion.b@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=tyrion.b@homeguruworld.com", aegisRole: "super_admin", department: "Engineering", mfaStatus: "enabled", status: "active", lastActiveTime: "Just now", lastActiveIp: "49.36.xx.xx" },
  { id: "AG-006", name: "Sansa Iyer", email: "sansa.i@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=sansa.i@homeguruworld.com", aegisRole: "trust_safety", department: "Operations", mfaStatus: "disabled", status: "active", lastActiveTime: "3h ago", lastActiveIp: "182.73.xx.xx" },
  { id: "AG-007", name: "Bran Nair", email: "bran.n@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=bran.n@homeguruworld.com", aegisRole: "tier1_support", department: "Support", mfaStatus: "enabled", status: "active", lastActiveTime: "45 min ago", lastActiveIp: "103.21.xx.xx" },
  { id: "AG-008", name: "Daenerys Rao", email: "dany.r@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=dany.r@homeguruworld.com", aegisRole: "finance_ops", department: "Finance", mfaStatus: "enabled", status: "active", lastActiveTime: "20 min ago", lastActiveIp: "122.15.xx.xx" },
  { id: "AG-009", name: "Robb Sharma", email: "robb.s@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=robb.s@homeguruworld.com", aegisRole: "tier1_support", department: "Support", mfaStatus: "pending", status: "active", lastActiveTime: "1d ago", lastActiveIp: "49.36.xx.xx" },
  { id: "AG-010", name: "Catelyn Verma", email: "cat.v@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=cat.v@homeguruworld.com", aegisRole: "trust_safety", department: "Dispute Resolution", mfaStatus: "enabled", status: "revoked", lastActiveTime: "14d ago", lastActiveIp: "103.21.xx.xx" },
  { id: "AG-011", name: "Jaime Reddy", email: "jaime.r@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=jaime.r@homeguruworld.com", aegisRole: "super_admin", department: "Engineering", mfaStatus: "enabled", status: "active", lastActiveTime: "5 min ago", lastActiveIp: "182.73.xx.xx" },
  { id: "AG-012", name: "Brienne Joshi", email: "brienne.j@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=brienne.j@homeguruworld.com", aegisRole: "tier1_support", department: "Support", mfaStatus: "enabled", status: "active", lastActiveTime: "30 min ago", lastActiveIp: "49.36.xx.xx" },
];

export function getStaffProfile(_id: string): StaffProfile {
  return {
    devices: [
      { id: "DEV-1", label: "MacBook Pro 16″ — Chrome", type: "laptop", lastSeen: "2 min ago", trusted: true },
      { id: "DEV-2", label: "iPhone 15 Pro — Safari", type: "phone", lastSeen: "1h ago", trusted: true },
      { id: "DEV-3", label: "Windows Desktop — Edge", type: "laptop", lastSeen: "14d ago", trusted: false },
    ],
    activeSessions: [
      { id: "SES-1", ip: "103.21.xx.xx", device: "Chrome / macOS", location: "Mumbai, IN", startedAt: "Today, 09:14 AM" },
      { id: "SES-2", ip: "49.36.xx.xx", device: "Safari / iOS", location: "Delhi, IN", startedAt: "Today, 10:02 AM" },
    ],
    accessLogs: [
      { timestamp: "Today, 09:14 AM", method: "SSO + 2FA", ip: "103.21.xx.xx", location: "Mumbai, IN" },
      { timestamp: "Yesterday, 06:42 PM", method: "SSO + 2FA", ip: "103.21.xx.xx", location: "Mumbai, IN" },
      { timestamp: "Yesterday, 09:01 AM", method: "SSO + 2FA", ip: "49.36.xx.xx", location: "Delhi, IN" },
      { timestamp: "Mar 8, 02:15 PM", method: "Password + 2FA", ip: "182.73.xx.xx", location: "Bangalore, IN" },
      { timestamp: "Mar 7, 10:30 AM", method: "SSO + 2FA", ip: "103.21.xx.xx", location: "Mumbai, IN" },
    ],
    auditTrail: [
      { timestamp: "Today, 10:42 AM", description: "Approved KYC for Teacher #4421", severity: "info" },
      { timestamp: "Today, 09:30 AM", description: "Approved refund of $150 to Student #8842", severity: "warning" },
      { timestamp: "Yesterday, 04:15 PM", description: "Suspended Student #3301 — policy violation", severity: "critical" },
      { timestamp: "Yesterday, 02:00 PM", description: "Viewed escrow balance for Teacher #2210", severity: "info" },
      { timestamp: "Yesterday, 11:20 AM", description: "Reset password for Student #5590", severity: "info" },
      { timestamp: "Mar 8, 03:45 PM", description: "Initiated batch payout — 42 teachers, $18,400", severity: "warning" },
      { timestamp: "Mar 8, 10:00 AM", description: "Rotated Osmium API key (production)", severity: "critical" },
    ],
  };
}

// RBAC Permissions
export const rbacPermissions: RBACPermission[] = [
  { key: "view_profiles", label: "View User Profiles", category: "Users" },
  { key: "reset_passwords", label: "Reset Passwords", category: "Users" },
  { key: "view_chat_logs", label: "View Chat Logs (non-financial)", category: "Users" },
  { key: "suspend_users", label: "Suspend Standard Users", category: "Users" },
  { key: "view_pii", label: "View PII / ID Documents", category: "KYC" },
  { key: "approve_kyc", label: "Approve / Reject KYC", category: "KYC" },
  { key: "view_escrow", label: "View Escrow Balances", category: "Finance" },
  { key: "initiate_payouts", label: "Initiate Batch Payouts", category: "Finance" },
  { key: "approve_refunds", label: "Approve High-Value Refunds", category: "Finance" },
  { key: "modify_ai_rules", label: "Modify AI Workflow Rules", category: "System" },
  { key: "manage_settings", label: "Manage System Settings", category: "System" },
  { key: "rotate_api_keys", label: "Rotate API Keys", category: "System" },
  { key: "manage_admins", label: "Manage Other Super Admins", category: "System" },
  { key: "override_all", label: "Override All Systems", category: "System" },
];

export const rbacMatrix: Record<string, string[]> = {
  super_admin: rbacPermissions.map((p) => p.key),
  trust_safety: ["view_profiles", "reset_passwords", "view_chat_logs", "suspend_users", "view_pii", "approve_kyc"],
  finance_ops: ["view_profiles", "view_escrow", "initiate_payouts", "approve_refunds"],
  tier1_support: ["view_profiles", "reset_passwords", "view_chat_logs"],
};
