import React from 'react';
import { Star, MessageSquareQuote, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Dra. Carolina Albuquerque",
      role: "Médica Pediatra",
      location: "Belo Horizonte - MG",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "Sempre tive receio de contratar seguros complexos, mas a clareza da SafeOne me conquistou. A equipe desenhou uma cobertura que protege meus filhos e me dá total paz de espírito no consultório."
    },
    {
      id: 2,
      name: "Rodrigo Vasconcellos",
      role: "Empresário e Diretor de TI",
      location: "São Paulo - SP",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "Após fazer o inventário do meu pai e ver as despesas burocráticas consumirem quase 15% do patrimônio, entendi o real valor do seguro como liquidez rápida. É um pilar fundamental no meu planejamento tributário."
    },
    {
      id: 3,
      name: "Amanda Guedes",
      role: "Arquiteta e Gestora de Projetos",
      location: "Salvador - BA",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "Ter a garantia da diária por invalidez temporária salvou minhas contas em um período de recuperação prolongada após uma queda. O atendimento via WhatsApp foi imediato e humanizado."
    }
  ];

  return (
    <section id="depoimentos" className="bg-white text-slate-850 py-20 relative overflow-hidden font-sans border-t border-slate-100">
      {/* Visual background details to add elegance */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-16 -translate-x-16 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#c5912a]/5 rounded-full blur-3xl translate-y-32 translate-x-32 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfb448]/30 bg-[#dfb448]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b08020]">
            <MessageSquareQuote className="h-4 w-4" />
            Vozes Reais de Nossos Clientes
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Quem confia, recomenda a SafeOne
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal">
            Histórias reais de tranquilidade, proteção assertiva e suporte prático e transparente de quem escolheu proteger a vida e o patrimônio conosco.
          </p>
        </div>

        {/* Dynamic Card Testimonial Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((test) => (
            <div 
              key={test.id} 
              className="flex flex-col justify-between rounded-2xl bg-slate-50/70 border border-slate-100 p-6 sm:p-8 hover:border-[#dfb448]/40 hover:bg-white hover:shadow-xl transition-all duration-300 relative group shadow-sm"
              id={`depoimento-${test.id}`}
            >
              {/* Huge quote mark styling */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity text-[#c5912a]">
                <Quote className="h-10 w-10 rotate-180" />
              </div>

              <div>
                {/* Visual Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-slate-750 mb-6 italic font-medium">
                  "{test.quote}"
                </p>
              </div>

              {/* Author Info block */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#dfb448]/30"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
                  }}
                />
                <div>
                  <h4 className="font-display text-xs sm:text-sm font-extrabold text-slate-900">
                    {test.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#c5912a] font-mono font-bold">
                    {test.role}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {test.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
