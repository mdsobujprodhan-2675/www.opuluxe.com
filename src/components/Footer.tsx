import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenReports?: (mode?: 'customer' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReports }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Opuluxe</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated luxury goods, fine chronographs, designer couture, and high-end electronics with white-glove doorstep delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authenticity & Secure Checkout</span>
            </div>
            {onOpenReports && (
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenReports('customer')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-colors"
                >
                  📦 Track My Order & Invoices
                </button>
                <button
                  onClick={() => onOpenReports('admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-colors"
                >
                  🔐 Store Admin Reports
                </button>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><a href="#catalog" className="hover:text-white transition-colors">Catalog Products</a></li>
              <li><a href="#featured" className="hover:text-white transition-colors">Exclusive Offerings</a></li>
              <li><a href="#electronics" className="hover:text-white transition-colors">Electronics & Audio</a></li>
              <li><a href="#groceries" className="hover:text-white transition-colors">Gourmet & Organics</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Concierge & Care</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><button onClick={() => onOpenReports?.('customer')} className="hover:text-amber-300 transition-colors cursor-pointer text-left">VIP Order Tracking & Invoices</button></li>
              <li><button onClick={() => onOpenReports?.('customer')} className="hover:text-amber-300 transition-colors cursor-pointer text-left">File a Complaint / Issue Report</button></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Bespoke Returns Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Opuluxe</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+880 1800-OPULUXE (VIP Concierge)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>concierge@opuluxe.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Gulshan-2, Dhaka, Bangladesh</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Opuluxe Haute & Luxury Shopping (<span className="text-amber-400 font-mono font-semibold">www.opuluxe.com</span>). All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">bKash</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">Visa / Master</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] font-bold">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
