import React from 'react';
import { ShieldCheck, Calculator } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { usePartners } from '../context/PartnersContext';

interface HeroProps {
  onOpenSimulator: () => void;
}

// Custom gold checkmark for inline benefits list
const GoldCheckIcon = () => (
  <svg className="h-5 w-5 text-[#dfb448] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#dfb448" strokeWidth="2" fill="#dfb448" fillOpacity="0.1" />
    <path d="M8 12L11 15L16 9" stroke="#dfb448" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// High fidelity logo replicas for the carriers
const PortoSeguroLogo = () => (
  <div className="flex items-center gap-2 select-none shrink-0" title="Porto Seguro">
    <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-extrabold text-[10px] tracking-tighter shadow-sm">
      PS
    </div>
    <div className="flex flex-col text-left">
      <span className="text-xs font-black text-slate-900 leading-none">PORTO</span>
      <span className="text-[9px] font-extrabold text-sky-600 leading-none tracking-widest mt-0.5">SEGURO</span>
    </div>
  </div>
);

const TokioMarineLogo = () => (
  <div className="flex items-center gap-2 select-none shrink-0" title="Tokio Marine">
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white scale-90 shadow-sm">
      <div className="w-4 h-4 rounded-full border-2 border-white/60 border-r-transparent animate-spin" style={{ animationDuration: '4s' }} />
    </div>
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-black text-slate-900 leading-none tracking-wide">TOKIO MARINE</span>
      <span className="text-[8px] font-bold text-emerald-600 leading-none tracking-widest mt-0.5">SEGURADORA</span>
    </div>
  </div>
);

const AllianzLogo = () => (
  <div className="flex items-center gap-2 select-none shrink-0" title="Allianz">
    <div className="flex items-center gap-1 select-none">
      <span className="text-xs font-black text-blue-900 leading-none text-sm tracking-tight">Allianz</span>
      <div className="h-5 w-5 rounded-full border-2 border-blue-950 flex items-center justify-center gap-[1.5px] p-0.5">
        <div className="w-[1.5px] h-2.5 bg-blue-950 rounded-full" />
        <div className="w-[1.5px] h-2.5 bg-blue-950 rounded-full" />
        <div className="w-[1.5px] h-2.5 bg-blue-950 rounded-full" />
      </div>
    </div>
  </div>
);

const IcatuLogo = () => (
  <div className="flex items-center gap-1 select-none shrink-0" title="Icatu Seguros">
    <div className="flex flex-col text-left">
      <span className="text-xs font-black text-amber-600 italic leading-none tracking-tight">Icatu</span>
      <span className="text-[9px] font-extrabold text-slate-800 leading-none uppercase tracking-[0.15em] mt-0.5">Seguros</span>
    </div>
  </div>
);

const MagLogo = () => (
  <div className="flex items-center gap-1 select-none shrink-0" title="MAG Seguros">
    <div className="flex flex-col text-left">
      <span className="text-xs font-black text-sky-850 leading-none italic tracking-tight uppercase">MAG</span>
      <span className="text-[9px] font-bold text-[#c5912a] uppercase leading-none tracking-wider mt-0.5">SEGUROS</span>
    </div>
  </div>
);

const PrudentialLogo = () => (
  <div className="flex items-center gap-2 select-none shrink-0" title="Prudential do Brasil">
    <div className="w-8 h-8 rounded-full border border-sky-800 flex items-center justify-center bg-sky-50 relative overflow-hidden shadow-sm">
      <div className="absolute bottom-1 w-5 h-3 bg-sky-900 rounded-t-full scale-x-125 translate-y-1" />
      <div className="absolute top-1 right-[5px] w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
    </div>
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-black text-sky-900 leading-none">Prudential</span>
      <span className="text-[7.5px] font-bold text-slate-500 leading-none tracking-wider uppercase">do Brasil</span>
    </div>
  </div>
);

export default function Hero({ onOpenSimulator }: HeroProps) {
  const { settings } = useSettings();
  const { partners } = usePartners();
  const brokerWhatsApp = settings.brokerWhatsApp;
  const welcomeText = encodeURIComponent("Olá! Vim através do site da SafeOne e gostaria de simular um Seguro de Vida com um especialista.");
  const waUrl = `https://wa.me/${brokerWhatsApp}?text=${welcomeText}`;
  
  // High-fidelity image path of the smiling Brazilian family
  const familyImgUrl = settings.bannerImageUrl || "https://i.postimg.cc/65M471Pn/Familia-feliz-sentado-em-sofa-202606071250-(1).jpg";

  // Responsive state for vertical vs horizontal gradient overlap
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const gradientMid = typeof settings.bannerGradientLength === 'number' ? settings.bannerGradientLength : 42;
  const overlayStyle: React.CSSProperties = isLargeScreen
    ? {
        backgroundImage: `linear-gradient(to right, rgba(5, 17, 36, 0.98) 0%, rgba(5, 17, 36, 0.85) ${gradientMid}%, rgba(5, 17, 36, 0.1) 100%)`,
      }
    : {
        backgroundImage: `linear-gradient(to bottom, rgba(5, 17, 36, 0.95) 0%, rgba(5, 17, 36, 0.85) ${gradientMid}%, rgba(5, 17, 36, 0.95) 100%)`,
      };

  const customHeroSectionStyle: React.CSSProperties = {
    backgroundImage: `url("${familyImgUrl}")`,
    backgroundPosition: typeof settings.bannerPhotoPosX === 'number' && typeof settings.bannerPhotoPosY === 'number'
      ? `${settings.bannerPhotoPosX}% ${settings.bannerPhotoPosY}%`
      : 'right bottom',
    backgroundSize: settings.bannerPhotoSizeOption === 'custom' && typeof settings.bannerPhotoScale === 'number'
      ? `${settings.bannerPhotoScale}%`
      : 'cover',
    paddingTop: typeof settings.bannerPaddingTop === 'number' ? `${settings.bannerPaddingTop}px` : undefined,
    paddingBottom: typeof settings.bannerPaddingBottom === 'number' ? `${settings.bannerPaddingBottom}px` : undefined,
  };

  return (
    <div className="w-full bg-[#051124] text-white">
      {/* Hero Core Segment inside the Navy background with the family image spanning the entire section background */}
      <section 
        className="relative overflow-hidden bg-no-repeat"
        style={customHeroSectionStyle}
        id="hero-main-section"
      >
        {/* Cinematic shade overlay that keeps the left content completely legible on top of dark rich navy backdrop */}
        <div className="absolute inset-0 z-10" style={overlayStyle} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column Content (5 columns) */}
            <div className="lg:col-span-5 space-y-8 text-left" id="hero-left-content">
              
              {/* Headings mimicking typography in image */}
              <div className="space-y-5">
                <h1 className="font-sans text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.12]">
                  Sua família está <br />
                  preparada para <br />
                  o <span className="text-[#dfb448]">inesperado?</span>
                </h1>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
                  O seguro de vida garante proteção financeira e tranquilidade para quem você mais ama, mesmo quando você não puder estar presente.
                </p>
              </div>

              {/* Main Dual CTAs matching visual mockup */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* 1. Simulator Button on Gold Background */}
                <button
                  onClick={onOpenSimulator}
                  className="flex items-center gap-3 bg-[#c5912a] hover:bg-[#dfb448] text-white px-5 py-3.5 rounded-xl transition duration-200 shadow-xl border border-shadow hover:scale-[1.02] text-left cursor-pointer active:scale-95"
                  id="hero-simulation-btn"
                >
                  <Calculator className="h-6 w-6 text-white shrink-0" />
                  <div className="flex flex-col select-none">
                    <span className="text-sm font-extrabold leading-tight">Simule agora seu plano</span>
                    <span className="text-[10px] text-white/85 leading-none mt-1 font-medium">É rápido e sem compromisso</span>
                  </div>
                </button>

                {/* 2. Speak to Broker on WhatsApp Button with gold border outline */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-transparent hover:bg-white/5 text-white px-5 py-3.5 rounded-xl border border-white/20 hover:border-[#dfb448]/80 transition duration-200 text-left hover:scale-[1.02] active:scale-95"
                  id="hero-whatsapp-outline-btn"
                >
                  <img 
                    src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
                    alt="WhatsApp"
                    className="h-6 w-6 object-contain shrink-0 filter brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col select-none">
                    <span className="text-sm font-extrabold leading-tight text-white">Falar pelo WhatsApp</span>
                    <span className="text-[10px] text-slate-400 leading-none mt-1 font-medium">Atendimento imediato</span>
                  </div>
                </a>

              </div>

              {/* Sub-bullet trust items exactly like picture */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-6 border-t border-white/10 max-w-xl text-slate-300">
                <div className="flex items-center gap-2">
                  <GoldCheckIcon />
                  <span className="text-xs font-semibold tracking-wide text-slate-300">Planos acessíveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <GoldCheckIcon />
                  <span className="text-xs font-semibold tracking-wide text-slate-300">Contratação 100% online</span>
                </div>
                <div className="flex items-center gap-2">
                  <GoldCheckIcon />
                  <span className="text-xs font-semibold tracking-wide text-slate-300">Coberturas completas</span>
                </div>
                <div className="flex items-center gap-2">
                  <GoldCheckIcon />
                  <span className="text-xs font-semibold tracking-wide text-slate-300">Pagamento facilitado</span>
                </div>
              </div>

            </div>

            {/* Right Column Visuals (7 columns) - completely blended into section background, shortened upward */}
            <div className="lg:col-span-7 relative w-full h-[60px] sm:h-[100px] lg:h-[150px] pointer-events-none" id="hero-right-visuals" />

          </div>
        </div>
      </section>

      {/* Partners section immediately following the hero on white background - EXACT replica */}
      <section className="bg-white text-slate-800 py-10 border-t border-slate-100 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Left Header label */}
            <div className="text-left shrink-0 pl-1">
              <p className="text-xs md:text-sm font-bold text-slate-800 leading-snug">
                Trabalhamos com as <br className="hidden lg:inline" />
                principais seguradoras <br className="hidden lg:inline" />
                do mercado
              </p>
            </div>

            {/* Gray vertical separator line visible only on desktop */}
            <div className="hidden lg:block h-12 w-[1px] bg-slate-200 shrink-0" />

            {/* Vector representations of actual carrier logos arranged in the precise horizontal layout */}
            <div className="flex-1 w-full flex flex-wrap items-center justify-center lg:justify-between gap-y-6 gap-x-8 md:gap-x-10 px-2">
              {partners && partners.length > 0 ? (
                partners.map((partner) => {
                  if (partner.isDefault) {
                    switch (partner.id) {
                      case 'porto-seguro':
                        return <PortoSeguroLogo key={partner.id} />;
                      case 'tokio-marine':
                        return <TokioMarineLogo key={partner.id} />;
                      case 'allianz':
                        return <AllianzLogo key={partner.id} />;
                      case 'icatu':
                        return <IcatuLogo key={partner.id} />;
                      case 'mag':
                        return <MagLogo key={partner.id} />;
                      case 'prudential':
                        return <PrudentialLogo key={partner.id} />;
                      default:
                        break;
                    }
                  }
                  
                  // Custom partner logo or uploaded image logo
                  return (
                    <div key={partner.id} className="flex items-center gap-2 select-none shrink-0" title={partner.name}>
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        referrerPolicy="no-referrer"
                        className="h-8 max-h-12 w-auto object-contain shrink-0 filter grayscale hover:grayscale-0 transition-all duration-200"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[10px] font-black text-slate-800 leading-none tracking-wide">{partner.name}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-xs">Nenhum parceiro cadastrado.</p>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
