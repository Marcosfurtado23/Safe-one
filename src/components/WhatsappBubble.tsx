import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function WhatsappBubble() {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { settings } = useSettings();

  useEffect(() => {
    // Show high visibility tooltip after 3.5 seconds delay to capture attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const brokerWhatsApp = settings.brokerWhatsApp;
  const welcomeText = encodeURIComponent("Olá! Estou no site da SafeOne Seguros e gostaria de tirar dúvidas sobre o Seguro de Vida.");
  const waUrl = `https://wa.me/${brokerWhatsApp}?text=${welcomeText}`;


  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-50 flex flex-col items-end gap-3">
      
      {/* Dynamic welcome notification card above the bubble */}
      {showTooltip && (
        <div className="relative flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#051124] p-3.5 shadow-2xl max-w-[260px] animate-fade-in text-left">
          <button 
            type="button"
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="mr-1">
            <span className="block text-[9px] text-[#dfb448] font-bold uppercase tracking-wider font-mono">Dúvidas?</span>
            <p className="text-[12px] text-slate-100 font-semibold leading-normal mt-0.5">
              Simule e converse pelo WhatsApp com um especialista SafeOne!
            </p>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
        id="whatsapp-floating-bubble"
        title="Falar no WhatsApp"
      >
        {/* Glow effect outline */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-25" />
        
        <img 
          src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
          alt="WhatsApp"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:rotate-12"
          referrerPolicy="no-referrer"
        />
        
        {/* Help Badge count dot */}
        <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white animate-pulse" />
      </a>

    </div>
  );
}
