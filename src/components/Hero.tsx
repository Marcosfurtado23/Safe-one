import React from 'react';
import { ShieldCheck, ArrowRight, HeartHandshake } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface HeroProps {
  onOpenSimulator: () => void;
}

export default function Hero({ onOpenSimulator }: HeroProps) {
  const { settings } = useSettings();
  const brokerWhatsApp = settings.brokerWhatsApp;
  const welcomeText = encodeURIComponent("Olá! Vim através do site da SafeOne e gostaria de simular um Seguro de Vida com um specialist.");
  const waUrl = `https://wa.me/${brokerWhatsApp}?text=${welcomeText}`;

  
  // High-fidelity image path of the smiling Brazilian family
  const familyImgUrl = "https://i.postimg.cc/MTGLG7xz/Familia-feliz-sentado-em-sofa-202606071250.jpg";

  const partners = [
    { name: "Porto Seguro", style: "text-blue-600 font-extrabold" },
    { name: "Tokio Marine", style: "text-emerald-700 font-bold" },
    { name: "Allianz", style: "text-blue-900 font-black" },
    { name: "Icatu Seguros", style: "text-cyan-800 font-extrabold font-serif italic" },
    { name: "MAG Seguros", style: "text-indigo-950 font-bold tracking-tight" },
    { name: "Prudential", style: "text-sky-600 font-extrabold" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Container */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content Column (7 columns) */}
            <div className="lg:col-span-5 space-y-7 text-left" id="hero-left-content">
              
              {/* Headings mimicking typography in mockup */}
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#0a1829] sm:text-5xl lg:text-[54px] leading-[1.12]">
                  Sua família está protegida para <br className="hidden sm:inline" />
                  o <span className="text-[#c5912a]">inesperado?</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-650 font-medium leading-relaxed max-w-xl">
                  Segurança e tranquilidade para o hoje e o amanhã. Planos sob medida para cada fase da sua vida.
                </p>
              </div>

              {/* Main Golden CTA Button conforming to image */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-[#c5912a] hover:bg-[#b08020] px-7 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/10 transition-all duration-200 hover:scale-[1.02]"
                    id="hero-gold-whatsapp-btn"
                  >
                    <img 
                      src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
                      alt="WhatsApp"
                      className="h-6 w-6 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <span>Falar com um especialista</span>
                  </a>

                  <button
                    type="button"
                    onClick={onOpenSimulator}
                    className="text-sm font-bold text-[#c5912a] hover:text-[#b08020] hover:underline py-2.5 px-4 cursor-pointer"
                  >
                    Ou simular online →
                  </button>
                </div>

                {/* Subtitle trust tag */}
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-[#c5912a]">
                    ✓
                  </span>
                  <span>Atendimento rápido e humanizado</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Card / Family Frame Column (7 columns) */}
            <div className="lg:col-span-7 relative" id="hero-right-visuals">
              
              {/* Stack containing Family photo and overlaid gold badge */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-xl p-2 sm:p-3">
                <img
                  src={familyImgUrl}
                  alt="Família feliz protegida pela SafeOne"
                  className="w-full h-auto object-cover rounded-2xl max-h-[460px]"
                  referrerPolicy="no-referrer"
                  id="family-hero-hero-img"
                  onError={(e) => {
                    // Fallback to beautiful stock representation just in case there is dynamic loading lag
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000";
                  }}
                />

                {/* Overlaid Navy badge exactly like the mockup bottom-right */}
                <div className="absolute bottom-5 right-5 left-5 sm:left-auto sm:max-w-xs rounded-2xl bg-[#051124] border-l-4 border-[#c5912a] p-5 shadow-2xl text-left animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-[#dfb448]">
                      <ShieldCheck className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">
                        Proteção feita para quem você ama e para o que realmente importa.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
              
            </div>

          </div>
        </div>
      </section>

      {/* Partners List: "Nossos parceiros" Section - faithfully matching image */}
      <section className="bg-slate-50 py-10 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Nossos parceiros
          </p>

          <div id="partner-logos-container" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-12">
            {partners.map((partner, idx) => (
              <span
                key={idx}
                className={`text-sm sm:text-base md:text-lg tracking-tight select-none opacity-85 hover:opacity-100 transition-opacity whitespace-nowrap ${partner.style}`}
              >
                {partner.name}
              </span>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
