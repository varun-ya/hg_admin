export type CommissionTrigger = "flat" | "subject" | "volume" | "tiered";

export interface CommissionRule {
  id: string;
  name: string;
  trigger: CommissionTrigger;
  conditions: string;
  rate: string;
  status: "active" | "draft" | "archived";
  appliedTo: number;
  revenue30d: string;
  createdBy: string;
  createdAt: string;
}

export interface FxRate {
  pair: string;
  rate: number;
  change24h: number;
  lockedEscrow: string;
  lockExpiry: string;
}

export interface TaxRule {
  jurisdiction: string;
  taxType: string;
  rate: string;
  autoWithhold: boolean;
  transactionsAffected: number;
  totalWithheld: string;
}
