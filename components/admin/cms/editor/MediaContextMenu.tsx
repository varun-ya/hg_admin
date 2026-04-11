"use client";
import { useEffect, useRef } from "react";
import {
  Trash, ArrowsOut, PencilSimple, Image, VideoCamera,
  ArrowsInSimple, TextAlignCenter, Copy,
} from "@phosphor-icons/react";

interface Props {
  x: number;
  y: number;
  target: HTMLElement;
  onClose: () => void;
}

export default function MediaContextMenu({ x, y, target, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isImg = target.tagName === "IMG";
  const isIframe = target.tagName === "IFRAME";
  const isVideo = isIframe || target.classList.contains("yt-embed");
  const isFigure = target.tagName === "FIGURE" || target.closest("figure");
  const isHr = target.tagName === "HR";

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  const remove = () => {
    const el = target.closest("figure") || target.closest(".yt-embed") || target;
    el?.remove();
    onClose();
  };

  const replaceImage = () => {
    const url = prompt("New image URL:", (target as HTMLImageElement).src || "");
    if (url && isImg) (target as HTMLImageElement).src = url;
    onClose();
  };

  const replaceVideo = () => {
    const url = prompt("New YouTube URL:");
    if (!url) return;
    const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (m) {
      const iframe = target.tagName === "IFRAME" ? target : target.querySelector("iframe");
      if (iframe) (iframe as HTMLIFrameElement).src = `https://www.youtube.com/embed/${m[1]}`;
    }
    onClose();
  };

  const toggleWidth = () => {
    if (isImg) {
      const img = target as HTMLImageElement;
      if (img.style.maxWidth === "100%") {
        img.style.maxWidth = "80%";
        img.style.margin = "24px auto";
        img.style.display = "block";
      } else {
        img.style.maxWidth = "100%";
        img.style.margin = "24px 0";
      }
    }
    onClose();
  };

  const copyUrl = () => {
    const url = isImg ? (target as HTMLImageElement).src : "";
    if (url) navigator.clipboard.writeText(url);
    onClose();
  };

  const items = [
    ...(isImg ? [
      { icon: <PencilSimple size={13} />, label: "Replace Image", action: replaceImage },
      { icon: <ArrowsOut size={13} />, label: "Toggle Full Width", action: toggleWidth },
      { icon: <Copy size={13} />, label: "Copy Image URL", action: copyUrl },
    ] : []),
    ...(isVideo ? [
      { icon: <PencilSimple size={13} />, label: "Replace Video", action: replaceVideo },
    ] : []),
    ...(isImg || isVideo || isHr ? [
      { icon: <Trash size={13} className="text-[#C2571A]" />, label: "Remove", action: remove, danger: true },
    ] : []),
  ];

  if (items.length === 0) return null;

  // Clamp position to viewport
  const safeX = Math.min(x, window.innerWidth - 200);
  const safeY = Math.min(y, window.innerHeight - items.length * 40 - 20);

  return (
    <div
      ref={ref}
      className="fixed z-[300] w-[180px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.15)] border border-[#EAEAEA] overflow-hidden animate-contextIn"
      style={{ top: safeY, left: safeX }}
    >
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={item.action}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors cursor-pointer border-none bg-transparent text-[12px] ${
            (item as any).danger ? "text-[#C2571A] hover:bg-[#FFF1E6]" : "text-[#555] hover:bg-[#FAFAFA]"
          }`}
        >
          {item.icon} {item.label}
        </button>
      ))}
    </div>
  );
}
