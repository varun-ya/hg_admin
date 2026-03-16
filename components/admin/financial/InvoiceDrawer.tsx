"use client";
import { memo, useEffect } from "react";
import {
  X, ArrowsClockwise, EnvelopeSimple, Export, Receipt, Buildings, User,
} from "@phosphor-icons/react";
import type { Invoice, InvoiceStatus } from "./financialTypes";

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  generated: "bg-[#ECFDF5] text-[#10B981]",
  sent: "bg-[#F5F5F5] text-[#999]",
  failed: "bg-[#FEF2F2] text-[#E11D48]",
  regenerating: "bg-[#FEF3C7] text-[#F59E0B]",
};

interface Props { invoice: Invoice | null; onClose: () => void }

function InvoiceDrawer({ invoice, onClose }: Props) {
  useEffect(() => {
    if (!invoice) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [invoice, onClose]);

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-matter">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-[560px] max-w-full bg-white h-full shadow-[-8px_0_30px_-10px_rgba(0,0,0,0.08)] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#F0F0F0] shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{invoice.invoiceId}</h2>
              <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[invoice.status]}`}>{invoice.status}</span>
            </div>
            <p className="text-[12px] text-[#ACACAC]">{invoice.date}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-7">
          {/* Mock PDF Viewer */}
          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Document Preview</p>
            <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
              {/* PDF Header */}
              <div className="bg-[#FAFAFA] px-8 py-6 border-b border-[#F0F0F0]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#293763] flex items-center justify-center">
                      <Receipt size={18} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#1A1A1A] font-season">HomeGuru</p>
                      <p className="text-[10px] text-[#ACACAC]">Tax Invoice / Receipt</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-mono text-[#ACACAC]">{invoice.invoiceId}</p>
                    <p className="text-[10px] text-[#CACACA]">{invoice.date}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-8">
                  <div>
                    <p className="text-[9px] font-medium text-[#CACACA] uppercase tracking-[0.1em] mb-1">From</p>
                    <div className="flex items-center gap-2">
                      <Buildings size={12} className="text-[#ACACAC]" />
                      <p className="text-[12px] text-[#1A1A1A]">HomeGuru Edtech Pvt. Ltd.</p>
                    </div>
                    <p className="text-[10px] text-[#ACACAC] mt-0.5">GSTIN: 29AABCH1234F1Z5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-medium text-[#CACACA] uppercase tracking-[0.1em] mb-1">Bill To</p>
                    <div className="flex items-center gap-2 justify-end">
                      <p className="text-[12px] text-[#1A1A1A]">{invoice.billTo}</p>
                      <User size={12} className="text-[#ACACAC]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Line Items */}
              <div className="px-8 py-5">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F0F0F0]">
                      <th className="pb-2 text-[9px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Description</th>
                      <th className="pb-2 text-right text-[9px] font-medium text-[#CACACA] uppercase tracking-[0.1em]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#F8F8F8]">
                      <td className="py-3 text-[12px] text-[#1A1A1A]">
                        {invoice.type === "platform_invoice" ? "Platform Commission" : "Tutoring Session"}
                      </td>
                      <td className="py-3 text-right text-[12px] text-[#1A1A1A] tabular-nums">${(invoice.total - invoice.taxComponent).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-[#F8F8F8]">
                      <td className="py-3 text-[12px] text-[#999]">{invoice.taxRate}</td>
                      <td className="py-3 text-right text-[12px] text-[#999] tabular-nums">${invoice.taxComponent.toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="pt-3 text-[13px] font-medium text-[#1A1A1A]">Total</td>
                      <td className="pt-3 text-right text-[15px] font-medium text-[#1A1A1A] tabular-nums">${invoice.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* PDF Footer */}
              <div className="bg-[#FAFAFA] px-8 py-4 border-t border-[#F0F0F0]">
                <p className="text-[9px] text-[#CACACA] text-center">This is a computer-generated document. No signature required.</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Document Details</p>
            <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5 space-y-3">
              <Row label="Type" value={invoice.type === "platform_invoice" ? "Platform Invoice" : "Student Receipt"} />
              <Row label="Tax Rate" value={invoice.taxRate} />
              <Row label="Tax Component" value={`$${invoice.taxComponent.toLocaleString()}`} />
              <Row label="Status" value={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-7 py-4 border-t border-[#F0F0F0] flex items-center justify-end gap-3 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#777] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
            <ArrowsClockwise size={13} /> Regenerate
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#777] bg-white border border-[#F0F0F0] rounded-lg hover:border-[#DCDCDC] transition-all cursor-pointer">
            <EnvelopeSimple size={13} /> Email Copy
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95">
            <Export size={13} weight="bold" /> Export Tax CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between gap-4"><span className="text-[12px] text-[#999] shrink-0">{label}</span><span className="text-[12px] text-[#1A1A1A] text-right">{value}</span></div>);
}

export default memo(InvoiceDrawer);
