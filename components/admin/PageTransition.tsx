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
      setPhase("out");
      const t1 = setTimeout(() => {
        setDisplayChildren(children);
        setPhase("in");
        const t2 = setTimeout(() => setPhase("idle"), 150);
        return () => clearTimeout(t2);
      }, 50);
      return () => clearTimeout(t1);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      className={
        phase === "out"
          ? "opacity-0 transition-opacity duration-[50ms] ease-in"
          : phase === "in"
          ? "opacity-0 animate-fadeIn"
          : ""
      }
      style={{ willChange: phase !== "idle" ? "opacity" : "auto" }}
    >
      {displayChildren}
    </div>
  );
}
