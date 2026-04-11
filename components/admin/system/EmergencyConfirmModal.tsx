"use client";
import { useState, memo } from "react";
import { Warning, ShieldCheck, X } from "@phosphor-icons/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  switchName: string;
  impact: string;
  onConfirm: () => void;
}

function EmergencyConfirmModal({ isOpen, onClose, switchName, impact, onConfirm }: Props) {
  const [phrase, setPhrase] = useState("");
  const [totp, setTotp] = useState("");

  if (!isOpen) return null;

  const CONFIRM_PHRASE = "I-CONFIRM-EMERGENCY-SHUTDOWN";
  const phraseMatch = phrase === CONFIRM_PHRASE;
  const totpValid = /^\d{6}$/.test(totp);
  const canConfirm = phraseMatch && totpValid;

  const handleConfirm = () => {
    onConfirm();
    setPhrase("");
    setTotp("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center font-matter">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] w-[500px] max-w-[95vw] overflow-hidden">
        {/* Header */}
        <div className="px-7 py-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] flex items-center justify-center shrink-0">
            <Warning size={20} weight="fill" className="text-[#C2571A]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-[#1A1A1A]">Emergency Kill Switch</h3>
            <p className="text-[14px] font-medium text-[#C2571A] mt-0.5">{switchName}</p>
          </div>
          <button onClick={onClose} className="text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer shrink-0 mt-0.5">
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Impact */}
        <div className="mx-7 mb-5 p-4 bg-[#FFF1E6] border border-[#C2571A]/10 rounded-xl">
          <p className="text-[10px] font-medium text-[#C2571A]/50 uppercase tracking-[0.1em] mb-1">Impact Assessment</p>
          <p className="text-[12px] text-[#C2571A]/80 leading-relaxed">{impact}</p>
        </div>

        {/* Step 1: Phrase */}
        <div className="px-7 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-md bg-[#F5F5F5] flex items-center justify-center text-[10px] font-medium text-[#999]">1</span>
            <p className="text-[12px] text-[#ACACAC]">
              Type <span className="font-mono font-medium text-[#1A1A1A] bg-[#F5F5F5] px-1.5 py-0.5 rounded">{CONFIRM_PHRASE}</span>
            </p>
          </div>
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            className={`w-full h-[40px] px-3 border rounded-lg text-[13px] font-mono focus:outline-none transition-all ${
              phrase.length === 0
                ? "border-[#EBEBEB] text-[#1A1A1A] placeholder:text-[#DCDCDC]"
                : phraseMatch
                ? "border-[#E08A3C] text-[#E08A3C]"
                : "border-[#C2571A]/30 text-[#C2571A]"
            }`}
          />
        </div>

        {/* Step 2: TOTP */}
        <div className="px-7 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-md bg-[#F5F5F5] flex items-center justify-center text-[10px] font-medium text-[#999]">2</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#ACACAC]" />
              <p className="text-[12px] text-[#ACACAC]">Enter 6-digit Aegis Auth TOTP code</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={totp[i] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val) {
                    const next = totp.slice(0, i) + val + totp.slice(i + 1);
                    setTotp(next);
                    const nextInput = e.target.nextElementSibling as HTMLInputElement;
                    if (nextInput && i < 5) nextInput.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !totp[i]) {
                    const prev = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    if (prev) { prev.focus(); setTotp(totp.slice(0, i - 1) + totp.slice(i)); }
                  }
                }}
                className={`w-full h-[44px] text-center border rounded-lg text-[18px] font-mono font-medium focus:outline-none transition-all ${
                  totp[i] ? "border-[#DCDCDC] text-[#1A1A1A]" : "border-[#EBEBEB] text-[#ACACAC]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-7 pb-6 pt-2 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#777] bg-white border border-[#EBEBEB] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer">
            Abort
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none ${
              canConfirm
                ? "bg-[#C2571A] text-white hover:bg-[#BE123C] active:scale-95"
                : "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
            }`}
          >
            Execute Kill Switch
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(EmergencyConfirmModal);
