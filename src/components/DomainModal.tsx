import React, { useState } from 'react';
import { 
  Globe, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Share2, 
  CheckCircle2, 
  Info,
  Server
} from 'lucide-react';

interface DomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainModal: React.FC<DomainModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const customDomain = 'www.opuluxe.com';

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(customDomain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        id="domain-info-modal"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Domain & Access Info</h3>
              <p className="text-xs text-amber-200/80">Website Link & Custom Domain Guide</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Custom Domain Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                Target Custom Domain
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                Official Web Address
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-amber-300">
              <span className="font-mono text-base font-extrabold text-slate-900 tracking-tight">
                {customDomain}
              </span>
              <button
                onClick={handleCopyDomain}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedDomain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              যেকোনো মানুষ ব্রাউজারে <strong>{customDomain}</strong> লিখে সার্চ বা এন্টার করলেই এই শপটি লোড করার জন্য ডোমেইন প্রোভাইডারে DNS CNAME সেট করতে হয়।
            </p>
          </div>

          {/* Instant Shareable Web Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                Instant Live Link (সবার জন্য উন্মুক্ত)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active Live Web
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-300">
              <span className="font-mono text-xs text-slate-600 truncate max-w-[260px] sm:max-w-xs">
                {currentUrl}
              </span>
              <button
                onClick={handleCopyCurrent}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              এই লিংকটি আপনি যেকোনো মোবাইল বা কম্পিউটার ব্রাউজারে কাউকে পাঠালে সে সরাসরি Opuluxe অ্যাপটিতে প্রবেশ করতে পারবে।
            </p>
          </div>

          {/* Desktop & Mobile Responsive Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Monitor className="w-4 h-4 text-emerald-600" />
                <span>কম্পিউটার (Desktop)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                বড় ওয়াইডস্ক্রিন ন্যাভবার, মাল্টি-কলাম গ্রিড ও ড্রয়ার মোডাল স্বয়ংক্রিয়ভাবে সক্রিয় হয়।
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span>স্মার্টফোন (Mobile)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                মোবাইল বটম নেভিগেশন বার, ২-কলাম স্পর্শ-সহজ ক্যাটালগ ও ফুল-স্ক্রিন মোডাল প্রদর্শিত হয়।
              </p>
            </div>
          </div>

          {/* How to link www.opuluxe.com */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>কিভাবে www.opuluxe.com এ লাইভ করবেন?</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800 leading-relaxed">
              <li>যেকোনো ডোমেইন প্রোভাইডার (যেমন Namecheap, GoDaddy) থেকে <strong>opuluxe.com</strong> ডোমেইনটি কিনে নিতে হবে।</li>
              <li>Settings মেনু থেকে কোডটি GitHub বা Cloud Run-এ ডিপ্লয় করে Custom Domain Mapping-এ <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">www.opuluxe.com</code> যুক্ত করতে হবে।</li>
              <li>DNS সেটিংস-এ CNAME রেকর্ড যুক্ত করলেই বিশ্বব্যাপী সবাই <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">www.opuluxe.com</code> লিখে আপনার স্টোরে আসতে পারবে!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
