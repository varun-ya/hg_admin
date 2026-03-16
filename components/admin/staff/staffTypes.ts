export type AegisRole = "super_admin" | "trust_safety" | "finance_ops" | "tier1_support";
export type StaffStatus = "active" | "revoked";
export type MfaStatus = "enabled" | "pending" | "disabled";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  aegisRole: AegisRole;
  department: string;
  mfaStatus: MfaStatus;
  status: StaffStatus;
  lastActiveTime: string;
  lastActiveIp: string;
}

export interface DeviceBinding {
  id: string;
  label: string;
  type: "laptop" | "phone";
  lastSeen: string;
  trusted: boolean;
}

export interface ActiveSession {
  id: string;
  ip: string;
  device: string;
  location: string;
  startedAt: string;
}

export interface AccessLogEntry {
  timestamp: string;
  method: string;
  ip: string;
  location: string;
}

export interface AuditAction {
  timestamp: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

export interface StaffProfile {
  devices: DeviceBinding[];
  activeSessions: ActiveSession[];
  accessLogs: AccessLogEntry[];
  auditTrail: AuditAction[];
}

export interface StaffKPI {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: string;
  isCritical?: boolean;
}

export interface RBACPermission {
  key: string;
  label: string;
  category: string;
}

export type RBACMatrix = Record<AegisRole, string[]>;
