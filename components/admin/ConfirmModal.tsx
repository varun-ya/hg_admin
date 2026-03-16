"use client";
import { useState, memo } from "react";
import { Warning, X } from "@phosphor-icons/react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmString: string;
  onConfirm: () => void;
  variant: "danger" | "warning";
}

function ConfirmModal({ isOpen, onClose, title, description, confirmString, onConfirm, variant }: ConfirmModalProps) {
  const [input, setInput] = useState("");
  if (!isOpen) return null;

  const isMatch = input === confirmString;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-[440px] max-w-[95vw] overflow-hidden font-matter">
        <div className="px-7 py-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0">
            <Warning size={20} weight="fill" className="text-[#999]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">{title}</h3>
            <p className="text-[13px] text-[#999] mt-1.5 leading-relaxed">{description}</p>
          </div>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer shrink-0 mt-0.5">
            <X size={16} weight="bold" />
          </button>
        </div>
        <div className="px-7 pb-3">
          <p className="text-[12px] text-[#ACACAC] mb-2">
            Type <span className="font-mono font-medium text-[#1A1A1A] bg-[#F5F5F5] px-1.5 py-0.5 rounded">{confirmString}</span> to confirm
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={confirmString}
            className="w-full h-[40px] px-3 border border-[#EBEBEB] rounded-lg text-[13px] font-mono focus:outline-none focus:border-[#1A1A1A] transition-all"
          />
        </div>
        <div className="px-7 pb-6 pt-3 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); setInput(""); onClose(); }}
            disabled={!isMatch}
            className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none ${
              isMatch ? "bg-[#1A1A1A] text-white hover:bg-[#333]" : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
            }`}
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ConfirmModal);
