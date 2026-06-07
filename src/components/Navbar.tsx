import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Sparkles, ShieldAlert } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface NavbarProps {
  onOpenSimulator: () => void;
}

export default function Navbar({ onOpenSimulator }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const brokerWhatsApp = settings.brokerWhatsApp; // Dynamic WhatsApp number for lead redirection
  const welcomeText = encodeURIComponent("Olá! Vim através do site da SafeOne e gostaria de falar com um especialista sobre o Seguro de Vida.");
  const waUrl = `https://wa.me/${brokerWhatsApp}?text=${welcomeText}`;


  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-[#051124] text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - SAFEONE SEGUROS */}
        <a href="#" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90 animate-fade-in" id="nav-logo">
          {/* Logo Shield - matching golden hue of the image */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#c89832] to-[#dfb448] text-[#051124] shadow-md shadow-amber-500/10">
            <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-wider leading-none text-white">
              SAFEONE
            </span>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb448] mt-0.5 leading-none">
              SEGUROS
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <a href="#beneficios" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-beneficios">
            Benefícios
          </a>
          <a href="#solucoes" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-solucoes">
            Soluções
          </a>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); onOpenSimulator(); }}
            className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-[#dfb448] transition duration-200 hover:text-amber-300 cursor-pointer bg-transparent border-none outline-none"
            id="desktop-link-simulador"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Simulador de Preço
          </button>
          <a href="#perguntas-frequentes" className="text-sm font-semibold tracking-wide text-slate-300 transition duration-200 hover:text-[#dfb448]" id="desktop-link-faq">
            Dúvidas
          </a>
        </nav>

        {/* Desk CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl bg-[#c5912a] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/10 transition-all duration-200 hover:bg-[#b08020] hover:scale-[1.02]"
            id="nav-btn-expert"
          >
            <img 
              src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
              alt="WhatsApp"
              className="h-5 w-5 object-contain transition-transform duration-200 group-hover:rotate-12"
              referrerPolicy="no-referrer"
            />
            Falar com Especialista
          </a>
        </div>

        {/* Mobile Hamburger Menu Toggle Button (matches the 3 lines in top right) */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:bg-slate-900/65 hover:text-[#dfb448] focus:outline-none focus:ring-2 focus:ring-[#dfb448]"
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
        <div className="md:hidden border-t border-slate-900 bg-[#051124] py-4 px-4 space-y-3 transition-all duration-200">
          <a
            href="#beneficios"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Benefícios
          </a>
          <a
            href="#solucoes"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Soluções de Vida
          </a>
          <button
            type="button"
            onClick={() => { setMobileMenuOpen(false); onOpenSimulator(); }}
            className="block w-full text-left rounded-lg px-3 py-2 text-base font-bold text-[#dfb448] hover:bg-slate-900 cursor-pointer bg-transparent border-none outline-none"
          >
            ⭐ Simulador Inteligente
          </button>
          <a
            href="#perguntas-frequentes"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-900 hover:text-[#dfb448]"
          >
            Perguntas Frequentes
          </a>
          
          <div className="pt-3 border-t border-slate-900">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c5912a] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#b08020]"
            >
              <img 
                src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
                alt="WhatsApp"
                className="h-5 w-5 object-contain"
                referrerPolicy="no-referrer"
              />
              Falar com Especialista
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

