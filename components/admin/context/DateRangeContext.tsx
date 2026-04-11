"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

interface DateRangeCtx {
  range: DateRange;
  setRange: (r: DateRange) => void;
  presets: DateRange[];
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function today() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

const PRESETS: DateRange[] = [
  { from: daysAgo(0), to: today(), label: "Today" },
  { from: daysAgo(6), to: today(), label: "Last 7 days" },
  { from: daysAgo(29), to: today(), label: "Last 30 days" },
  { from: daysAgo(89), to: today(), label: "Last 90 days" },
  { from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: today(), label: "This month" },
  { from: new Date(new Date().getFullYear(), 0, 1), to: today(), label: "Year to date" },
];

const DateRangeContext = createContext<DateRangeCtx>({
  range: PRESETS[2],
  setRange: () => {},
  presets: PRESETS,
});

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRangeState] = useState<DateRange>(PRESETS[2]);
  const setRange = useCallback((r: DateRange) => setRangeState(r), []);
  return (
    <DateRangeContext.Provider value={{ range, setRange, presets: PRESETS }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  return useContext(DateRangeContext);
}
