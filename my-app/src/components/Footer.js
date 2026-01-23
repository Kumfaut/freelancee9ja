"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone,
  Globe
} from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-3">
                <span className="text-white font-black text-2xl tracking-tighter">N</span>
             </div>
             <h3 className="font-black text-slate-900 text-2xl tracking-tight">NaijaFreelance</h3>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm font-medium">
            {t('footer_tagline')}
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
          </div>
        </div>

        {/* For Talent */}
        <div>
          <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-[0.2em]">{t('footer_for_talent')}</h4>
          <ul className="flex flex-col space-y-4 text-sm font-bold">
            <FooterLink to="/search">{t('nav_find_work')}</FooterLink>
            <FooterLink to="/profile">{t('nav_my_profile')}</FooterLink>
            <FooterLink to="/wallet" className="text-emerald-600 italic">₦ {t('footer_earnings')}</FooterLink>
          </ul>
        </div>

        {/* For Clients */}
        <div>
          <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-[0.2em]">{t('footer_for_clients')}</h4>
          <ul className="flex flex-col space-y-4 text-sm font-bold">
            <FooterLink to="/post-job">{t('nav_post_job')}</FooterLink>
            <FooterLink to="/browse-freelancers">{t('nav_find_talent')}</FooterLink>
            <FooterLink to="/payment-safety">{t('footer_payment_safety')}</FooterLink>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className="font-black text-slate-900 mb-6 text-[10px] uppercase tracking-[0.2em]">{t('footer_col_2')}</h4>
          <ul className="flex flex-col space-y-4 text-sm font-bold">
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/help-center">Help Center</FooterLink>
            <FooterLink to="/contact-us">{t('footer_contact_us')}</FooterLink>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center lg:text-left">
            <p>© {currentYear} NaijaFreelance. {t('footer_copyright')}.</p>
            <p className="text-emerald-600 mt-1">{t('footer_nitda')}</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-tighter">
            <span className="flex items-center gap-2 hover:text-emerald-600 transition-colors cursor-pointer">
                <Mail className="w-4 h-4 text-emerald-600" /> hello@naijafreelance.ng
            </span>
            <span className="flex items-center gap-2 hover:text-emerald-600 transition-colors cursor-pointer">
                <Phone className="w-4 h-4 text-emerald-600" /> +234 800 NAIJA FIX
            </span>
            <div className="w-px h-4 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black">Lagos / Abuja / PH</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-components for cleaner code
function FooterLink({ to, children, className = "" }) {
  return (
    <li>
      <Link to={to} className={`text-slate-500 hover:text-emerald-600 transition-all ${className}`}>
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a href={href} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-900/5 transition-all">
      {icon}
    </a>
  );
}