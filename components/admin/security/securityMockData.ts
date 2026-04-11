import type { ThreatEvent, ActiveSession, IpRule, SecurityPolicy } from "./securityTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const securityKPIs: KPIItem[] = [
  { label: "Threats Blocked (24h)", value: "1,247", change: "+89 vs yesterday", changeType: "up", icon: null, isCritical: true, pulseColor: "#C2571A" },
  { label: "Active Admin Sessions", value: "4", change: "3 MFA verified", changeType: "neutral", icon: null },
  { label: "Blocked IPs", value: "38", change: "+2 today", changeType: "up", icon: null },
  { label: "Uptime (30d)", value: "99.97%", change: "SLA target: 99.9%", changeType: "up", icon: null },
];

export const securitySparklines = [
  [980, 1020, 1100, 1150, 1180, 1210, 1247],
  [3, 4, 3, 5, 4, 4, 4],
  [32, 33, 34, 35, 36, 37, 38],
  [99.95, 99.96, 99.97, 99.96, 99.97, 99.97, 99.97],
];

export const threatEvents: ThreatEvent[] = [
  { id: "TH-001", timestamp: "2 min ago", type: "brute_force", severity: "critical", source: "185.220.101.34", target: "admin@homeguruworld.com", description: "14 failed login attempts in 60s — Tor exit node", status: "blocked", country: "DE" },
  { id: "TH-002", timestamp: "8 min ago", type: "privilege_escalation", severity: "critical", source: "103.21.58.99", target: "support@homeguruworld.com", description: "Attempted access to /admin/overrides without Super Admin role", status: "blocked", country: "IN" },
  { id: "TH-003", timestamp: "18 min ago", type: "token_abuse", severity: "high", source: "52.66.48.12", target: "sk-osm_••••4a2f", description: "API key used from 3 different IPs within 5 minutes", status: "flagged", country: "US" },
  { id: "TH-004", timestamp: "34 min ago", type: "rate_limit", severity: "medium", source: "49.36.112.88", target: "DPS Integration", description: "1,847 requests/min — exceeded 1,200 threshold", status: "blocked", country: "IN" },
  { id: "TH-005", timestamp: "1h ago", type: "geo_anomaly", severity: "high", source: "91.108.56.12", target: "karan@homeguruworld.com", description: "Login from Russia — user's last 30 logins all from India", status: "investigating", country: "RU" },
  { id: "TH-006", timestamp: "1h 20m ago", type: "suspicious_ip", severity: "medium", source: "45.33.32.156", target: "/api/v1/students", description: "Known scanner IP — Shodan probe on student API endpoint", status: "blocked", country: "US" },
  { id: "TH-007", timestamp: "2h ago", type: "brute_force", severity: "high", source: "178.128.88.12", target: "finance@homeguruworld.com", description: "8 failed MFA challenges — possible SIM swap attempt", status: "flagged", country: "NL" },
  { id: "TH-008", timestamp: "3h ago", type: "rate_limit", severity: "low", source: "103.21.58.14", target: "/api/v1/search", description: "Legitimate admin triggered rate limit during bulk export", status: "resolved", country: "IN" },
];

export const activeSessions: ActiveSession[] = [
  { id: "SS-001", user: "admin@homeguruworld.com", role: "super_admin", ip: "103.21.58.14", location: "Mumbai, IN", device: "Chrome 122 / macOS", loginAt: "Today, 08:12 AM", lastActive: "Just now", mfaVerified: true },
  { id: "SS-002", user: "karan@homeguruworld.com", role: "super_admin", ip: "49.36.112.88", location: "Delhi, IN", device: "Firefox 123 / Ubuntu", loginAt: "Today, 09:45 AM", lastActive: "2 min ago", mfaVerified: true },
  { id: "SS-003", user: "riya@homeguruworld.com", role: "admin", ip: "103.21.58.14", location: "Mumbai, IN", device: "Safari 17 / macOS", loginAt: "Today, 10:02 AM", lastActive: "8 min ago", mfaVerified: true },
  { id: "SS-004", user: "finance@homeguruworld.com", role: "finance", ip: "122.176.44.21", location: "Bangalore, IN", device: "Chrome 122 / Windows", loginAt: "Today, 07:30 AM", lastActive: "22 min ago", mfaVerified: false },
];

export const ipRules: IpRule[] = [
  { id: "IP-001", ip: "185.220.101.0/24", type: "block", reason: "Tor exit node range — repeated brute force", addedBy: "system", addedAt: "Mar 12, 10:42 AM", hits: 847 },
  { id: "IP-002", ip: "45.33.32.156", type: "block", reason: "Shodan scanner — automated probing", addedBy: "system", addedAt: "Mar 12, 09:15 AM", hits: 234 },
  { id: "IP-003", ip: "178.128.88.0/24", type: "block", reason: "DigitalOcean range — credential stuffing", addedBy: "admin@homeguruworld.com", addedAt: "Mar 11, 06:30 PM", hits: 1204 },
  { id: "IP-004", ip: "103.21.58.0/24", type: "allow", reason: "HomeGuru office — Mumbai HQ", addedBy: "karan@homeguruworld.com", addedAt: "Jan 15, 10:00 AM", hits: 48291 },
  { id: "IP-005", ip: "49.36.112.0/24", type: "allow", reason: "HomeGuru office — Delhi", addedBy: "karan@homeguruworld.com", addedAt: "Jan 15, 10:00 AM", hits: 12840 },
];

export const securityPolicies: SecurityPolicy[] = [
  { id: "SP-001", name: "Enforce MFA for all admins", description: "Require TOTP or hardware key for every admin login. No SMS fallback.", enabled: true, lastUpdated: "Feb 28, 2024" },
  { id: "SP-002", name: "Auto-lock after 5 failed attempts", description: "Lock account for 30 minutes after 5 consecutive failed login attempts.", enabled: true, lastUpdated: "Jan 15, 2024" },
  { id: "SP-003", name: "Session timeout — 4 hours", description: "Force re-authentication after 4 hours of inactivity for admin sessions.", enabled: true, lastUpdated: "Mar 1, 2024" },
  { id: "SP-004", name: "Geo-fence admin access", description: "Block admin logins from countries not in the approved list (IN, US, UK, AE).", enabled: false, lastUpdated: "Mar 10, 2024" },
  { id: "SP-005", name: "API key rotation — 90 days", description: "Force rotation of all Osmium API keys every 90 days.", enabled: true, lastUpdated: "Feb 15, 2024" },
  { id: "SP-006", name: "Audit log immutability", description: "All audit log entries are write-once. No admin can delete or modify entries.", enabled: true, lastUpdated: "Jan 1, 2024" },
];
