"use client";
import {
  TextB, TextItalic, LinkSimple, TextStrikethrough, CodeSimple,
  Quotes, Image, VideoCamera, Minus, Code, ListBullets,
  ListNumbers, TextH, Paragraph, TextUnderline,
} from "@phosphor-icons/react";

interface Props {
  exec: (cmd: string, val?: string) => void;
  onInsertImage: () => void;
  onInsertVideo: () => void;
}

function ToolBtn({ icon, tip, onAction }: { icon: React.ReactNode; tip: string; onAction: () => void }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onAction(); }}
      title={tip}
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#888] hover:text-[#1A1A1A] hover:bg-white transition-all cursor-pointer border-none bg-transparent"
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-[#E0E0E0] mx-1 shrink-0" />;
}

function Label({ text }: { text: string }) {
  return <span className="text-[9px] text-[#CACACA] px-1.5 shrink-0 select-none">{text}</span>;
}

export default function EditorToolbar({ exec, onInsertImage, onInsertVideo }: Props) {
  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border border-[#EBEBEB] rounded-xl bg-[#FAFAFA] flex-wrap">
      <Label text="Text" />
      <ToolBtn icon={<TextB size={15} weight="bold" />} tip="Bold (⌘B)" onAction={() => exec("bold")} />
      <ToolBtn icon={<TextItalic size={15} />} tip="Italic (⌘I)" onAction={() => exec("italic")} />
      <ToolBtn icon={<TextUnderline size={15} />} tip="Underline (⌘U)" onAction={() => exec("underline")} />
      <ToolBtn icon={<TextStrikethrough size={15} />} tip="Strikethrough" onAction={() => exec("strikeThrough")} />
      <ToolBtn icon={<LinkSimple size={15} />} tip="Link (⌘K)" onAction={() => { const u = prompt("URL:"); if (u) exec("createLink", u); }} />
      <ToolBtn icon={<CodeSimple size={15} />} tip="Inline Code" onAction={() => exec("insertHTML", `<code>${window.getSelection()?.toString() || "code"}</code>`)} />

      <Divider />
      <Label text="Block" />
      <ToolBtn icon={<Paragraph size={15} />} tip="Paragraph" onAction={() => exec("formatBlock", "p")} />
      <ToolBtn icon={<span className="text-[12px] font-bold">H1</span>} tip="Heading 1" onAction={() => exec("formatBlock", "h1")} />
      <ToolBtn icon={<span className="text-[11px] font-bold">H2</span>} tip="Heading 2" onAction={() => exec("formatBlock", "h2")} />
      <ToolBtn icon={<span className="text-[10px] font-bold">H3</span>} tip="Heading 3" onAction={() => exec("formatBlock", "h3")} />
      <ToolBtn icon={<Quotes size={15} />} tip="Blockquote" onAction={() => exec("formatBlock", "blockquote")} />
      <ToolBtn icon={<Code size={15} />} tip="Code Block" onAction={() => exec("formatBlock", "pre")} />

      <Divider />
      <Label text="List" />
      <ToolBtn icon={<ListBullets size={15} />} tip="Bullet List" onAction={() => exec("insertUnorderedList")} />
      <ToolBtn icon={<ListNumbers size={15} />} tip="Numbered List" onAction={() => exec("insertOrderedList")} />

      <Divider />
      <Label text="Insert" />
      <ToolBtn icon={<Image size={15} />} tip="Image" onAction={onInsertImage} />
      <ToolBtn icon={<VideoCamera size={15} />} tip="YouTube Video" onAction={onInsertVideo} />
      <ToolBtn icon={<Minus size={15} />} tip="Divider" onAction={() => exec("insertHTML", "<hr /><p></p>")} />
    </div>
  );
}
