import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        
        {/* Brand Column */}
        <div className="col-span-2 lg:col-span-2">
          <h3 className="font-bold text-emerald-600 mb-4 text-2xl tracking-tight">NaijaFreelance</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
            Connecting Nigeria's brightest minds with global opportunities. 
            The #1 marketplace for secure, reliable freelance work in the Giant of Africa.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-50 rounded-full hover:text-emerald-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-50 rounded-full hover:text-emerald-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-slate-50 rounded-full hover:text-emerald-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* For Freelancers */}
        <div>
          <h4 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">For Talent</h4>
          <ul className="flex flex-col space-y-3 text-sm text-slate-600">
            <li><Link to="/search" className="hover:text-emerald-600 transition-all">Find Work</Link></li>
            <li><Link to="/profile" className="hover:text-emerald-600 transition-all">My Profile</Link></li>
            <li><Link to="/wallet" className="hover:text-emerald-600 transition-all font-medium text-emerald-700">Earnings / Wallet</Link></li>
          </ul>
        </div>

        {/* For Clients */}
        <div>
          <h4 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">For Clients</h4>
          <ul className="flex flex-col space-y-3 text-sm text-slate-600">
            <li><Link to="/post-job" className="hover:text-emerald-600 transition-all">Post a Job</Link></li>
            <li><Link to="/browse-freelancers" className="hover:text-emerald-600 transition-all">Find Freelancers</Link></li>
            <li><Link to="/payment-safety" className="hover:text-emerald-600 transition-all">Payment Safety</Link></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">Resources</h4>
          <ul className="flex flex-col space-y-3 text-sm text-slate-600">
            <li><Link to="/privacy" className="hover:text-emerald-600 transition-all">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-emerald-600 transition-all">Terms of Service</Link></li>
            <li><Link to="/help-center" className="hover:text-emerald-600 transition-all">Help Center</Link></li>
            <li><Link to="/contact-us" className="hover:text-emerald-600 transition-all">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2025 NaijaFreelance. All rights reserved. Registered with NITDA.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                <Mail className="w-3 h-3" /> hello@naijafreelance.ng
            </span>
            <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                <Phone className="w-3 h-3" /> +234 800 NAIJA FIX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}