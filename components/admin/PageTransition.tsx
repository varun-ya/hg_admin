"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      // Phase 1: fade out old content
      setPhase("out");
      const t1 = setTimeout(() => {
        // Phase 2: swap content + fade in
        setDisplayChildren(children);
        setPhase("in");
        const t2 = setTimeout(() => setPhase("idle"), 300);
        return () => clearTimeout(t2);
      }, 120);
      return () => clearTimeout(t1);
    } else {
      // Same path, just update children (e.g. state changes)
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      className={
        phase === "out"
          ? "opacity-0 translate-y-1 transition-all duration-[120ms] ease-in"
          : phase === "in"
          ? "animate-pageIn"
          : ""
      }
      style={{ willChange: phase !== "idle" ? "opacity, transform" : "auto" }}
    >
      {displayChildren}
    </div>
  );
}
