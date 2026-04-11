"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import {
  TextB, TextItalic, TextUnderline, TextStrikethrough, LinkSimple,
  CodeSimple, Quotes, Code, ListBullets, ListNumbers, Image as ImageIcon,
  VideoCamera, Minus, TextAlignLeft, TextAlignCenter, Highlighter,
  ArrowCounterClockwise, ArrowClockwise, Paragraph, UploadSimple, Link,
  SpinnerGap, X,
} from "@phosphor-icons/react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

function ToolBtn({ icon, tip, active, onClick }: { icon: React.ReactNode; tip: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} title={tip} className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer border-none ${active ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#888] hover:text-[#1A1A1A] hover:bg-[#F0F0F0]"}`}>
      {icon}
    </button>
  );
}

function Divider() { return <div className="w-px h-5 bg-[#E0E0E0] mx-0.5 shrink-0" />; }
function Label({ text }: { text: string }) { return <span className="text-[9px] text-[#CACACA] px-1.5 shrink-0 select-none">{text}</span>; }

/* ── Insert Popover (Upload or URL) ── */
function InsertPopover({ type, onInsert, onClose }: { type: "image" | "video"; onInsert: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (popRef.current && !popRef.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleFile = async (file: File) => {
    setUploading(true);
    try { const u = await uploadFile(file); onInsert(u); }
    catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const accept = type === "image" ? "image/*" : "video/mp4,video/webm,video/quicktime";

  return (
    <div ref={popRef} className="absolute top-full mt-1.5 left-0 z-50 w-[260px] bg-white border border-[#EBEBEB] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#555]">Insert {type}</span>
        <button onClick={onClose} className="text-[#CACACA] hover:text-[#888] bg-transparent border-none cursor-pointer"><X size={12} /></button>
      </div>

      {/* Upload */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-2 h-[36px] rounded-lg border border-dashed border-[#DCDCDC] bg-[#FAFAFA] text-[12px] text-[#888] hover:border-[#1A8917] hover:text-[#1A8917] transition-colors cursor-pointer disabled:opacity-50"
      >
        {uploading ? <SpinnerGap size={14} className="animate-spin" /> : <UploadSimple size={14} />}
        {uploading ? "Uploading..." : `Upload ${type}`}
      </button>
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

      <div className="flex items-center gap-2 text-[10px] text-[#DCDCDC]">
        <div className="flex-1 h-px bg-[#F0F0F0]" />or<div className="flex-1 h-px bg-[#F0F0F0]" />
      </div>

      {/* URL */}
      <div className="flex gap-1.5">
        <input
          value={url} onChange={(e) => setUrl(e.target.value)}
          placeholder={type === "image" ? "https://... image URL" : "YouTube or video URL"}
          onKeyDown={(e) => { if (e.key === "Enter" && url.trim()) { onInsert(url.trim()); } }}
          className="flex-1 h-[32px] px-2.5 border border-[#EBEBEB] rounded-lg text-[11px] text-[#555] outline-none focus:border-[#1A8917] bg-white"
        />
        <button
          onClick={() => { if (url.trim()) onInsert(url.trim()); }}
          disabled={!url.trim()}
          className="h-[32px] px-2.5 rounded-lg bg-[#1A1A1A] text-white text-[11px] border-none cursor-pointer disabled:opacity-30 hover:bg-[#333] transition-colors"
        >
          <Link size={13} />
        </button>
      </div>
    </div>
  );
}

export default function TiptapEditor({ content, onChange }: Props) {
  const [insertType, setInsertType] = useState<"image" | "video" | null>(null);
  const insertAnchorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: { HTMLAttributes: { class: "code-block" } } }),
      ImageExt.configure({ inline: false, allowBase64: true }),
      LinkExt.configure({ openOnClick: false, HTMLAttributes: { class: "editor-link" } }),
      Placeholder.configure({ placeholder: "Start writing your story..." }),
      Underline,
      Youtube.configure({ width: 0, height: 0, HTMLAttributes: { class: "yt-embed" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Typography,
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: "blog-content outline-none min-h-[400px]", style: "font-family: 'Matter', Georgia, sans-serif; font-size: 18px; line-height: 1.85; color: #333;" },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const file = files[0];
        if (!file.type.startsWith("image/")) return false;
        event.preventDefault();
        uploadFile(file).then((url) => {
          const { tr, schema } = view.state;
          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? tr.selection.from;
          const node = schema.nodes.image.create({ src: url });
          view.dispatch(tr.insert(pos, node));
        });
        return true;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) return false;
            uploadFile(file).then((url) => {
              const { tr, schema } = view.state;
              const node = schema.nodes.image.create({ src: url });
              view.dispatch(tr.replaceSelectionWith(node));
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  const handleInsert = useCallback((url: string) => {
    if (!editor) return;
    if (insertType === "image") {
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      // Try YouTube first, fall back to raw video tag via HTML
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      } else {
        editor.chain().focus().insertContent(`<video src="${url}" controls style="width:100%;border-radius:12px;margin:1em 0"></video>`).run();
      }
    }
    setInsertType(null);
  }, [editor, insertType]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = prompt("URL:", editor.getAttributes("link").href || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return <div className="min-h-[400px] flex items-center justify-center text-[#DCDCDC] text-[14px]">Loading editor...</div>;

  return (
    <div>
      {/* ── Persistent Toolbar ── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border border-[#EBEBEB] rounded-xl bg-[#FAFAFA] flex-wrap mb-5 sticky top-[57px] z-10">
        <ToolBtn icon={<ArrowCounterClockwise size={14} />} tip="Undo (⌘Z)" onClick={() => editor.chain().focus().undo().run()} />
        <ToolBtn icon={<ArrowClockwise size={14} />} tip="Redo (⌘⇧Z)" onClick={() => editor.chain().focus().redo().run()} />

        <Divider />
        <Label text="Text" />
        <ToolBtn icon={<TextB size={15} weight="bold" />} tip="Bold (⌘B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolBtn icon={<TextItalic size={15} />} tip="Italic (⌘I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolBtn icon={<TextUnderline size={15} />} tip="Underline (⌘U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolBtn icon={<TextStrikethrough size={15} />} tip="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
        <ToolBtn icon={<Highlighter size={15} />} tip="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} />
        <ToolBtn icon={<LinkSimple size={15} />} tip="Link (⌘K)" active={editor.isActive("link")} onClick={addLink} />
        <ToolBtn icon={<CodeSimple size={15} />} tip="Inline Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} />

        <Divider />
        <Label text="Block" />
        <ToolBtn icon={<Paragraph size={14} />} tip="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} />
        <ToolBtn icon={<span className="text-[12px] font-bold">H1</span>} tip="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <ToolBtn icon={<span className="text-[11px] font-bold">H2</span>} tip="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolBtn icon={<span className="text-[10px] font-bold">H3</span>} tip="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <ToolBtn icon={<Quotes size={15} />} tip="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolBtn icon={<Code size={15} />} tip="Code Block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />

        <Divider />
        <Label text="List" />
        <ToolBtn icon={<ListBullets size={15} />} tip="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolBtn icon={<ListNumbers size={15} />} tip="Numbered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />

        <Divider />
        <Label text="Align" />
        <ToolBtn icon={<TextAlignLeft size={15} />} tip="Align Left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <ToolBtn icon={<TextAlignCenter size={15} />} tip="Align Center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />

        <Divider />
        <Label text="Insert" />
        <div ref={insertAnchorRef} className="relative flex items-center gap-0.5">
          <ToolBtn icon={<ImageIcon size={15} />} tip="Image" active={insertType === "image"} onClick={() => setInsertType(insertType === "image" ? null : "image")} />
          <ToolBtn icon={<VideoCamera size={15} />} tip="Video" active={insertType === "video"} onClick={() => setInsertType(insertType === "video" ? null : "video")} />
          {insertType && <InsertPopover type={insertType} onInsert={handleInsert} onClose={() => setInsertType(null)} />}
        </div>
        <ToolBtn icon={<Minus size={15} />} tip="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      </div>

      {/* ── Editor Content ── */}
      <EditorContent editor={editor} />
    </div>
  );
}
