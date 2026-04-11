"use client";
import {
  TextB, TextItalic, TextStrikethrough, LinkSimple, CodeSimple,
  TextH, Quotes,
} from "@phosphor-icons/react";

interface Props {
  top: number;
  left: number;
  exec: (cmd: string, val?: string) => void;
}

function Btn({ icon, tip, onAction }: { icon: React.ReactNode; tip: string; onAction: () => void }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onAction(); }}
      title={tip}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer border-none bg-transparent"
    >
      {icon}
    </button>
  );
}

export default function InlineToolbar({ top, left, exec }: Props) {
  return (
    <div
      className="absolute z-50 flex items-center gap-0.5 px-2 py-1.5 bg-[#1C1C1C] rounded-[12px] shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
      style={{ top: top - 8, left, transform: "translateX(-50%) translateY(-100%)" }}
    >
      <Btn icon={<TextB size={15} weight="bold" />} tip="Bold" onAction={() => exec("bold")} />
      <Btn icon={<TextItalic size={15} />} tip="Italic" onAction={() => exec("italic")} />
      <Btn icon={<TextStrikethrough size={15} />} tip="Strike" onAction={() => exec("strikeThrough")} />
      <div className="w-px h-5 bg-white/15 mx-0.5" />
      <Btn icon={<LinkSimple size={15} />} tip="Link" onAction={() => { const u = prompt("URL:"); if (u) exec("createLink", u); }} />
      <Btn icon={<CodeSimple size={15} />} tip="Code" onAction={() => exec("insertHTML", `<code>${window.getSelection()?.toString() || ""}</code>`)} />
      <div className="w-px h-5 bg-white/15 mx-0.5" />
      <Btn icon={<span className="text-[11px] font-bold text-white/60">H2</span>} tip="Heading 2" onAction={() => exec("formatBlock", "h2")} />
      <Btn icon={<Quotes size={15} />} tip="Quote" onAction={() => exec("formatBlock", "blockquote")} />
    </div>
  );
}
