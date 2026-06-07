import React from 'react';
import { 
  Users, 
  HeartPulse, 
  Car, 
  Building2, 
  Home, 
  Coins, 
  ShieldAlert, 
  Sparkles,
  Headphones,
  Settings2,
  LockKeyhole,
  MessageCircle
} from 'lucide-react';

interface FeaturesProps {
  onOpenSimulator: () => void;
}

export default function Features({ onOpenSimulator }: FeaturesProps) {
  const solutions = [
    {
      icon: <Users className="h-9 w-9 text-amber-600" />,
      title: "Proteção Familiar",
      description: "Cuidado e segurança financeira para quem mais importa.",
      accent: "border-amber-500/10 hover:border-amber-500/30",
      bg: "bg-amber-500/5"
    },
    {
      icon: <HeartPulse className="h-9 w-9 text-red-500" />,
      title: "Saúde e Bem-estar",
      description: "Planos de saúde com cobertura completa para você e sua família.",
      accent: "border-red-550/10 hover:border-red-500/30",
      bg: "bg-red-500/5"
    },
    {
      icon: <Car className="h-9 w-9 text-amber-500" />,
      title: "Seguro Auto",
      description: "Proteção completa para você rodar com tranquilidade.",
      accent: "border-amber-500/10 hover:border-amber-500/30",
      bg: "bg-amber-500/5"
    },
    {
      icon: <Building2 className="h-9 w-9 text-yellow-600" />,
      title: "Seguro Empresarial",
      description: "Soluções sob medida para proteger o que você construiu.",
      accent: "border-yellow-500/10 hover:border-yellow-500/30",
      bg: "bg-yellow-500/5"
    },
    {
      icon: <Home className="h-9 w-9 text-amber-600" />,
      title: "Residencial",
      description: "Mais segurança para o seu lar e para sua família.",
      accent: "border-amber-500/10 hover:border-amber-500/30",
      bg: "bg-amber-500/5"
    },
    {
      icon: <Coins className="h-9 w-9 text-[#c5912a]" />,
      title: "Previdência Privada",
      description: "Planeje hoje seu amanhã com mais tranquilidade.",
      accent: "border-amber-500/10 hover:border-amber-500/30",
      bg: "bg-amber-500/5"
    }
  ];

  const valuePillars = [
    {
      icon: <Headphones className="h-6 w-6 text-amber-600" />,
      title: "Atendimento Humanizado"
    },
    {
      icon: <Settings2 className="h-6 w-6 text-amber-655 text-amber-600" />,
      title: "Planos Personalizados"
    },
    {
      icon: <LockKeyhole className="h-6 w-6 text-amber-600" />,
      title: "Segurança e Confiança"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-amber-600" />,
      title: "Suporte Pós-venda"
    }
  ];

  return (
    <section id="solucoes" className="bg-[#fcfcff] py-20 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Solutions Heading exactly matching standard font and alignment of the mockup */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a1829]">
            Soluções para cada momento da vida
          </h2>
        </div>

        {/* 3x2 Grid conforming to mockup */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {solutions.map((sol, index) => (
            <div
              key={index}
              id={`solution-card-${index}`}
              className={`group flex flex-col items-center text-center rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${sol.accent}`}
            >
              {/* Highlight Circle exactly as depicted */}
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${sol.bg} group-hover:scale-110 transition-transform duration-300`}>
                {sol.icon}
              </div>

              {/* Title matches display font */}
              <h3 className="mt-5 font-display text-lg font-bold text-[#0a1829] group-hover:text-amber-700 transition-colors">
                {sol.title}
              </h3>

              {/* Description body */}
              <p className="mt-2 text-sm leading-relaxed text-slate-550 max-w-xs text-slate-500">
                {sol.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Blue Banner matching mockup bottom banner */}
        <div className="rounded-2xl bg-[#051124] p-8 md:p-10 shadow-xl overflow-hidden relative">
          
          {/* Light glowing visuals */}
          <div className="absolute top-0 right-0 h-28 w-28 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-500/10 blur-xl" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left Content Column */}
            <div className="flex items-center gap-4 text-left w-full md:w-auto">
              <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-[#dfb448]">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-xl md:text-2xl font-black text-white">
                  Simule seu plano em 1 minuto
                </h4>
                <p className="text-xs sm:text-sm text-slate-350 text-slate-400">
                  Encontre o seguro ideal para o seu momento de vida de forma rápida e fácil.
                </p>
              </div>
            </div>

            {/* Right Call To Action Interactive Button - opens our premium pricing simulator modal! */}
            <div className="w-full md:w-auto flex justify-end">
              <button
                type="button"
                onClick={onOpenSimulator}
                className="w-full md:w-auto text-center inline-flex items-center justify-center rounded-xl bg-[#c5912a] hover:bg-[#b08020] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                id="solutions-cta-simular-btn"
              >
                Simular agora
              </button>
            </div>

          </div>
        </div>

        {/* Value pillars conforming to layout footer block list */}
        <div className="mt-16 pt-10 border-t border-slate-150/60 lg:px-6">
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 text-center">
            {valuePillars.map((pil, idx) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row items-center justify-center gap-3 p-2 group hover:translate-y-[-1px] transition-transform"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors border border-amber-500/5 text-amber-600 flex-shrink-0">
                  {pil.icon}
                </div>
                <span className="font-display text-sm font-bold text-[#0a1829] tracking-tight leading-snug">
                  {pil.title}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

