import React, { useState } from 'react';
import { Menu, X, Phone, Shield } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface NavbarProps {
  onOpenSimulator: () => void;
}

// Custom High-fidelity gold shield logo icon with diagonal slash matching the image exactly
const ShieldGoldIcon = () => (
  <svg className="h-11 w-11 text-[#dfb448] shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Double-line outer shield */}
    <path d="M50 8L15 20V50C15 72 35 90 50 94C65 90 85 72 85 50V20L50 8Z" stroke="#dfb448" strokeWidth="6" strokeLinejoin="round" fill="none" />
    <path d="M50 16L23 25V48C23 66 38 82 50 86C62 82 77 66 77 48V25L50 16Z" fill="#dfb448" fillOpacity="0.15" />
    {/* Inner Diagonal Ribbon slash */}
    <path d="M30 32L70 68" stroke="#dfb448" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

export default function Navbar({ onOpenSimulator }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const brokerWhatsApp = settings.brokerWhatsApp; // Dynamic WhatsApp number for lead redirection
  const welcomeText = encodeURIComponent("Olá! Vim através do site da SafeOne e gostaria de falar com um especialista sobre o Seguro de Vida.");
  const waUrl = `https://wa.me/${brokerWhatsApp}?text=${welcomeText}`;

  return (
    <header className="w-full bg-[#051124] text-white select-none border-b border-white/5">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - SAFEONE SEGUROS with subtext */}
        <a href="#" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-95" id="nav-logo">
          <ShieldGoldIcon />
          <div className="flex flex-col text-left">
            <span className="font-display text-2xl font-extrabold tracking-wider leading-none text-white">
              SAFEONE
            </span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#dfb448] mt-1 leading-none">
              SEGUROS
            </span>
            <span className="text-[9px] text-slate-400 mt-1.5 leading-none font-sans font-medium whitespace-nowrap">
              Proteção que acompanha a vida.
            </span>
          </div>
        </a>

        {/* Desktop Navigation exactly as pictured in image */}
        <nav className="hidden lg:flex items-center gap-6">
          <a href="#solucoes-vida" className="relative text-sm font-semibold tracking-wide text-[#dfb448] pb-1.5 border-b-2 border-[#dfb448]" id="desktop-link-vida">
            Seguro de Vida
          </a>
          <a href="#solucoes-auto" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-auto">
            Seguro Auto
          </a>
          <a href="#solucoes-empresarial" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-empresarial">
            Seguro Empresarial
          </a>
          <a href="#sobre" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-sobre">
            Sobre
          </a>
          <a href="#blog" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-blog">
            Blog
          </a>
          <a href="#contato" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-contato">
            Contato
          </a>
        </nav>

        {/* Desk CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl bg-[#c5912a]/95 hover:bg-[#dfb448] active:bg-[#b08020] text-white px-5 py-3 text-sm font-bold shadow-lg shadow-amber-500/5 transition-all duration-200 hover:scale-[1.02] hover:text-slate-950 font-sans"
            id="nav-btn-expert"
          >
            <img 
              src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
              alt="WhatsApp"
              className="h-5 w-5 object-contain mr-1 group-hover:block filter brightness-100"
              referrerPolicy="no-referrer"
            />
            Falar pelo WhatsApp
          </a>
        </div>

        {/* Mobile Hamburger Menu Toggle Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-200 hover:bg-slate-900/60 hover:text-[#dfb448] focus:outline-none"
            id="mobile-menu-hamburger-btn"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 stroke-[2]" />
            ) : (
              <Menu className="h-7 w-7 stroke-[2]" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown Panels */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-900 bg-[#051124] py-4 px-4 space-y-3 transition-all duration-200 text-left">
          <a
            href="#solucoes-vida"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-[#dfb448] hover:bg-slate-900"
          >
            Seguro de Vida
          </a>
          <a
            href="#solucoes-auto"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Seguro Auto
          </a>
          <a
            href="#solucoes-empresarial"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Seguro Empresarial
          </a>
          <a
            href="#sobre"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Sobre
          </a>
          <a
            href="#blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Blog
          </a>
          <a
            href="#contato"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Contato
          </a>
          
          <div className="pt-3 border-t border-slate-900">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c5912a] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#dfb448]"
            >
              <img 
                src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
                alt="WhatsApp"
                className="h-5 w-5 object-contain"
                referrerPolicy="no-referrer"
              />
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

