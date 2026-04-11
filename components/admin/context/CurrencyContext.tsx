"use client";
import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  rate: number;
}

const CURRENCY_META: { code: string; symbol: string; label: string }[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
];

const FALLBACK_RATES: Record<string, number> = {
  INR: 83.12, USD: 1, GBP: 0.79, EUR: 0.92, AED: 3.67, CAD: 1.36,
};

interface CurrencyCtx {
  currency: CurrencyInfo;
  currencies: CurrencyInfo[];
  setCurrencyCode: (code: string) => void;
  formatCurrency: (usdAmount: number, opts?: { compact?: boolean; decimals?: number }) => string;
  convert: (usdAmount: number) => number;
  formatWithSymbol: (amount: number, opts?: { compact?: boolean; decimals?: number }) => string;
  isLive: boolean;
  lastUpdated: string | null;
}

const CurrencyContext = createContext<CurrencyCtx>({
  currency: { ...CURRENCY_META[0], rate: FALLBACK_RATES.INR },
  currencies: [],
  setCurrencyCode: () => {},
  formatCurrency: () => "",
  convert: (v) => v,
  formatWithSymbol: () => "",
  isLive: false,
  lastUpdated: null,
});

function compactNumber(n: number, decimals: number): string {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(decimals)}B`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

const RATE_API = "https://open.er-api.com/v6/latest/USD";
const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState("INR");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch live rates
  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch(RATE_API);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.result === "success" && data.rates) {
        const live: Record<string, number> = {};
        for (const m of CURRENCY_META) {
          live[m.code] = data.rates[m.code] ?? FALLBACK_RATES[m.code];
        }
        setRates(live);
        setIsLive(true);
        setLastUpdated(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch {
      // Keep fallback rates, mark as not live
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    intervalRef.current = setInterval(fetchRates, REFRESH_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchRates]);

  // Persist currency choice
  useEffect(() => {
    const saved = localStorage.getItem("hg_currency");
    if (saved && CURRENCY_META.some((c) => c.code === saved)) setCode(saved);
  }, []);

  const setCurrencyCode = useCallback((c: string) => {
    setCode(c);
    localStorage.setItem("hg_currency", c);
  }, []);

  const currencies: CurrencyInfo[] = CURRENCY_META.map((m) => ({ ...m, rate: rates[m.code] ?? 1 }));
  const currency = currencies.find((c) => c.code === code) || currencies[0];

  const convert = useCallback((usdAmount: number) => usdAmount * currency.rate, [currency.rate]);

  const formatWithSymbol = useCallback((amount: number, opts?: { compact?: boolean; decimals?: number }) => {
    const d = opts?.decimals ?? (opts?.compact ? 1 : 0);
    const formatted = opts?.compact ? compactNumber(amount, d) : amount.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
    return `${currency.symbol}${formatted}`;
  }, [currency.symbol]);

  const formatCurrency = useCallback((usdAmount: number, opts?: { compact?: boolean; decimals?: number }) => {
    return formatWithSymbol(convert(usdAmount), opts);
  }, [convert, formatWithSymbol]);

  return (
    <CurrencyContext.Provider value={{ currency, currencies, setCurrencyCode, formatCurrency, convert, formatWithSymbol, isLive, lastUpdated }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
