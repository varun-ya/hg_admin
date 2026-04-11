#!/usr/bin/env node
/**
 * generate-search-index.mjs
 *
 * Scans /app/dashboard/admin/ for page routes and
 * /components/admin/ for MockData.ts files with searchable entities,
 * then writes a typed search index to /components/admin/searchIndex.generated.ts
 *
 * Run:  node scripts/generate-search-index.mjs
 * Add to package.json:  "gen:search": "node scripts/generate-search-index.mjs"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ADMIN_PAGES = path.join(ROOT, "app", "dashboard", "admin");
const COMPONENTS = path.join(ROOT, "components", "admin");
const OUTPUT = path.join(COMPONENTS, "searchIndex.generated.ts");

// ── 1. Route metadata: slug → display name + group + icon name ──
// You only need to edit this map when adding a NEW page.
// The script auto-discovers routes from the filesystem and warns about unmapped ones.

const ROUTE_META = {
  "":              { name: "Health Dashboard",   group: "Platform Command", icon: "House" },
  "analytics":     { name: "Global Analytics",   group: "Platform Command", icon: "ChartLineUp" },
  "students":      { name: "Students",           group: "User Lifecycle",   icon: "Student" },
  "teachers":      { name: "Teachers",           group: "User Lifecycle",   icon: "ChalkboardTeacher" },
  "kyc":           { name: "KYC Pipeline",       group: "User Lifecycle",   icon: "IdentificationBadge" },
  "staff":         { name: "Agents / Staff",     group: "User Lifecycle",   icon: "UsersThree" },
  "classes":       { name: "Class Monitor",      group: "Live Ops",         icon: "VideoCamera" },
  "moderation":    { name: "Content Moderation",  group: "Live Ops",        icon: "ShieldCheck" },
  "disputes":      { name: "Dispute Resolution",  group: "Live Ops",       icon: "Scales" },
  "leads":         { name: "Lead Management",     group: "Live Ops",       icon: "Megaphone" },
  "revenue":       { name: "Revenue & Escrow",    group: "Financial",      icon: "CurrencyDollar" },
  "payouts":       { name: "Payouts",             group: "Financial",      icon: "Wallet" },
  "refunds":       { name: "Refunds",             group: "Financial",      icon: "ArrowsClockwise" },
  "invoices":      { name: "Invoices & Taxes",    group: "Financial",      icon: "Receipt" },
  "ai-usage":      { name: "AI Usage Metrics",    group: "AI Governance",  icon: "Brain" },
  "api-keys":      { name: "Quotas & API Keys",   group: "AI Governance",  icon: "Key" },
  "ai-workflows":  { name: "AI Workflow Rules",   group: "AI Governance",  icon: "GitBranch" },
  "ai-ethics":     { name: "Ethics Controls",     group: "AI Governance",  icon: "ToggleRight" },
  "impersonation": { name: "Impersonation",       group: "Orchestration",  icon: "UserSwitch" },
  "tenants":       { name: "B2B Tenants",         group: "Orchestration",  icon: "Buildings" },
  "commission":    { name: "Commission Engine",   group: "Orchestration",  icon: "Percent" },
  "churn":         { name: "Churn Prediction",    group: "Orchestration",  icon: "Heartbeat" },
  "taxonomy":      { name: "Taxonomy",            group: "Orchestration",  icon: "TreeStructure" },
  "broadcast":     { name: "Broadcast Hub",       group: "Orchestration",  icon: "PaperPlaneTilt" },
  "cms":           { name: "CMS Pages",           group: "Website",        icon: "Browser" },
  "audit":         { name: "Audit Logs",          group: "System & Audit", icon: "ListBullets" },
  "flags":         { name: "Feature Flags",       group: "System & Audit", icon: "Flag" },
  "security":      { name: "Security Center",     group: "System & Audit", icon: "ShieldWarning" },
  "emergency":     { name: "Emergency Controls",  group: "System & Audit", icon: "Lightning" },
  "overrides":     { name: "Overrides",           group: "System & Audit", icon: "Wrench" },
};

// ── 2. Discover routes from filesystem ──

function discoverRoutes() {
  const routes = [];
  const entries = fs.readdirSync(ADMIN_PAGES, { withFileTypes: true });

  // Root page
  if (fs.existsSync(path.join(ADMIN_PAGES, "page.tsx"))) {
    routes.push({ slug: "", path: "/dashboard/admin" });
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pagePath = path.join(ADMIN_PAGES, entry.name, "page.tsx");
    if (fs.existsSync(pagePath)) {
      routes.push({ slug: entry.name, path: `/dashboard/admin/${entry.name}` });
    }
  }

  return routes;
}

// ── 3. Discover mock data files ──

function discoverMockData() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (entry.name.endsWith("MockData.ts") || entry.name === "mockData.ts") {
        const rel = path.relative(COMPONENTS, full).replace(/\\/g, "/");
        files.push({ name: entry.name, relativePath: `./${rel}`, fullPath: full });
      }
    }
  }
  walk(COMPONENTS);
  return files;
}

// ── 4. Extract exported arrays from mock data (simple regex) ──

function extractExports(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const exports = [];
  // Match: export const fooBar = [
  const re = /export\s+const\s+(\w+)\s*(?::\s*\w+(?:<[^>]+>)?\s*(?:\[\])?\s*)?=\s*\[/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    exports.push(m[1]);
  }
  return exports;
}

// ── 5. Collect all unique icon names used ──

function collectIcons(routes) {
  const icons = new Set();
  for (const r of routes) {
    const meta = ROUTE_META[r.slug];
    if (meta) icons.add(meta.icon);
  }
  // Always include these for actions
  icons.add("Student");
  icons.add("ChalkboardTeacher");
  icons.add("Export");
  icons.add("FilePdf");
  icons.add("Prohibit");
  icons.add("Flag");
  icons.add("Wallet");
  icons.add("Gear");
  icons.add("VideoCamera");
  icons.add("ListBullets");
  icons.add("Browser");
  return [...icons].sort();
}

// ── 6. Generate output ──

function generate() {
  const routes = discoverRoutes();
  const mockFiles = discoverMockData();
  const icons = collectIcons(routes);

  const unmapped = routes.filter((r) => !ROUTE_META[r.slug]);
  if (unmapped.length) {
    console.warn("\n⚠️  Unmapped routes (add to ROUTE_META in this script):");
    unmapped.forEach((r) => console.warn(`   - ${r.slug || "(root)"} → ${r.path}`));
    console.warn("");
  }

  let out = `// AUTO-GENERATED by scripts/generate-search-index.mjs
// Do not edit manually. Run: node scripts/generate-search-index.mjs
// Generated at: ${new Date().toISOString()}

`;

  // Icon imports
  out += `import {\n  ${icons.join(",\n  ")},\n} from "@phosphor-icons/react";\n\n`;

  // Mock data imports — with alias for duplicates
  const seenNames = new Set();
  const aliasMap = new Map(); // originalName → aliasName (per file)
  const fileAliases = []; // { file, imports: [{name, alias}] }

  for (const f of mockFiles) {
    const exports = extractExports(f.fullPath);
    if (!exports.length) continue;
    const imports = [];
    for (const exp of exports) {
      if (seenNames.has(exp)) {
        // Create alias: liveSessions → mockData_liveSessions
        const prefix = f.name.replace(/\.ts$/, "").replace(/[^a-zA-Z0-9]/g, "_");
        const alias = `${prefix}_${exp}`;
        imports.push({ name: exp, alias });
        aliasMap.set(`${f.fullPath}:${exp}`, alias);
      } else {
        seenNames.add(exp);
        imports.push({ name: exp, alias: null });
        aliasMap.set(`${f.fullPath}:${exp}`, exp);
      }
    }
    fileAliases.push({ file: f, imports });
    const importStr = imports.map((im) => im.alias ? `${im.name} as ${im.alias}` : im.name).join(", ");
    out += `import { ${importStr} } from "${f.relativePath.replace(/\.ts$/, "")}";
`;
  }

  out += `
export type SearchResultType = "page" | "action" | "session" | "audit" | "cms" | "student" | "teacher" | "transaction";

export interface SearchItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  iconName: string;
  href?: string;
}

export const TYPE_LABELS: Record<SearchResultType, string> = {
  page: "Pages", action: "Actions", session: "Sessions", audit: "Audit Logs",
  cms: "CMS Pages", student: "Students", teacher: "Teachers", transaction: "Transactions",
};

export const TYPE_ORDER: SearchResultType[] = ["action", "page", "session", "audit", "cms"];

// ── NAV PAGES (auto-discovered from /app/dashboard/admin/*) ──

export const NAV_PAGES: SearchItem[] = [\n`;

  for (const r of routes) {
    const meta = ROUTE_META[r.slug];
    if (!meta) continue;
    out += `  { id: "nav-${r.slug || "home"}", type: "page", title: "${meta.name}", subtitle: "${meta.group}", iconName: "${meta.icon}", href: "${r.path}" },\n`;
  }

  out += `];

// ── ROUTE LABELS (for header breadcrumb) ──

export const ROUTE_LABELS: Record<string, string> = {\n`;
  for (const r of routes) {
    const meta = ROUTE_META[r.slug];
    if (!meta) continue;
    out += `  "${r.path}": "${meta.name}",\n`;
  }
  out += `};

export const ROUTE_GROUPS: Record<string, string> = {\n`;
  for (const r of routes) {
    const meta = ROUTE_META[r.slug];
    if (!meta || r.slug === "") continue;
    out += `  "${r.path}": "${meta.group}",\n`;
  }
  out += `};

// ── SIDEBAR NAV GROUPS ──

const GROUP_ORDER = ["Platform Command", "User Lifecycle", "Live Ops", "Financial", "AI Governance", "Orchestration", "Website", "System & Audit"];

export interface SidebarGroup {
  label: string;
  items: { name: string; href: string; iconName: string }[];
}

export const SIDEBAR_GROUPS: SidebarGroup[] = GROUP_ORDER.map((g) => ({
  label: g.toUpperCase(),
  items: NAV_PAGES.filter((p) => p.subtitle === g).map((p) => ({
    name: p.title,
    href: p.href!,
    iconName: p.iconName,
  })),
})).filter((g) => g.items.length > 0);

// ── ADMIN ACTIONS ──

export const ADMIN_ACTIONS: SearchItem[] = [
  { id: "act-impersonate-student", type: "action", title: "Login as Student", subtitle: "Impersonate a student account", iconName: "Student", href: "/dashboard/admin/impersonation" },
  { id: "act-impersonate-teacher", type: "action", title: "Login as Teacher", subtitle: "Impersonate a teacher account", iconName: "ChalkboardTeacher", href: "/dashboard/admin/impersonation" },
  { id: "act-export-audit", type: "action", title: "Export Audit Trail", subtitle: "Download as CSV or PDF", iconName: "Export", href: "/dashboard/admin/audit" },
  { id: "act-export-revenue", type: "action", title: "Export Revenue Report", subtitle: "Financial data export", iconName: "FilePdf", href: "/dashboard/admin/revenue" },
  { id: "act-kill-switch", type: "action", title: "Emergency Kill Switches", subtitle: "Halt bookings, payouts, or platform", iconName: "Prohibit", href: "/dashboard/admin/emergency" },
  { id: "act-feature-flag", type: "action", title: "Toggle Feature Flag", subtitle: "Enable or disable platform features", iconName: "Flag", href: "/dashboard/admin/flags" },
  { id: "act-batch-payout", type: "action", title: "Initiate Batch Payout", subtitle: "Process pending teacher settlements", iconName: "Wallet", href: "/dashboard/admin/payouts" },
  { id: "act-settings", type: "action", title: "Account Settings", subtitle: "Manage your admin profile", iconName: "Gear" },
];

// ── DYNAMIC DATA INDEX (from mock data files) ──

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [...NAV_PAGES, ...ADMIN_ACTIONS];
`;

  // For each mock data file, try to generate index entries
  for (const fa of fileAliases) {
    const f = fa.file;
    const exports = fa.imports;
    for (const { name: exp, alias } of exports) {
      const varName = alias || exp;
      // Heuristic: if it looks like sessions data
      if (exp.includes("ession") || exp.includes("session")) {
        out += `
  // From ${f.name} → ${exp}${alias ? ` (as ${alias})` : ""}
  try {
    if (Array.isArray(${varName})) {
      ${varName}.forEach((s: any, i: number) => {
        const title = s.sessionId ? \`\${s.sessionId} — \${s.subject || ""}\` : s.host ? \`\${s.host} — \${s.subject || ""}\` : \`Session \${i}\`;
        const subtitle = [s.teacher, s.student, s.region, s.duration, s.status].filter(Boolean).join(" · ");
        items.push({ id: \`ses-${f.name.replace(/\.ts$/, "")}-\${i}\`, type: "session", title, subtitle, iconName: "VideoCamera", href: "/dashboard/admin/classes" });
      });
    }
  } catch {}
`;
      }
      // Audit trail
      else if (exp.includes("udit")) {
        out += `
  // From ${f.name} → ${exp}${alias ? ` (as ${alias})` : ""}
  try {
    if (Array.isArray(${varName})) {
      ${varName}.forEach((e: any, i: number) => {
        items.push({ id: \`audit-${f.name.replace(/\.ts$/, "")}-\${i}\`, type: "audit", title: \`\${e.action || ""} → \${e.target || ""}\`, subtitle: [e.actor, e.timestamp, e.category].filter(Boolean).join(" · "), iconName: "ListBullets", href: "/dashboard/admin/audit" });
      });
    }
  } catch {}
`;
      }
      // CMS pages
      else if (exp.includes("cms") || exp.includes("page")) {
        out += `
  // From ${f.name} → ${exp}${alias ? ` (as ${alias})` : ""}
  try {
    if (Array.isArray(${varName})) {
      ${varName}.forEach((p: any, i: number) => {
        if (p.title && p.slug) {
          items.push({ id: \`cms-${f.name.replace(/\.ts$/, "")}-\${i}\`, type: "cms", title: p.title, subtitle: [p.slug, p.status, p.seoScore ? \`SEO: \${p.seoScore}\` : ""].filter(Boolean).join(" · "), iconName: "Browser", href: "/dashboard/admin/cms" });
        }
      });
    }
  } catch {}
`;
      }
    }
  }

  out += `
  return items;
}
`;

  // Stats
  out += `
// ── Stats ──
// Routes discovered: ${routes.length}
// Mock data files: ${mockFiles.length}
// Icons used: ${icons.length}
`;

  fs.writeFileSync(OUTPUT, out, "utf-8");

  console.log(`✅ Search index generated → ${path.relative(ROOT, OUTPUT)}`);
  console.log(`   ${routes.length} routes · ${mockFiles.length} mock files · ${icons.length} icons`);
  if (unmapped.length) console.log(`   ⚠️  ${unmapped.length} unmapped route(s)`);
}

generate();
