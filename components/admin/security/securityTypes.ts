export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: "brute_force" | "suspicious_ip" | "token_abuse" | "rate_limit" | "geo_anomaly" | "privilege_escalation";
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  target: string;
  description: string;
  status: "blocked" | "flagged" | "investigating" | "resolved";
  country?: string;
}

export interface ActiveSession {
  id: string;
  user: string;
  role: "super_admin" | "admin" | "finance" | "support";
  ip: string;
  location: string;
  device: string;
  loginAt: string;
  lastActive: string;
  mfaVerified: boolean;
}

export interface IpRule {
  id: string;
  ip: string;
  type: "allow" | "block";
  reason: string;
  addedBy: string;
  addedAt: string;
  hits: number;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastUpdated: string;
}
