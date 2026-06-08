import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Heart
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-[#051124] border-t border-slate-900 pt-16 pb-8 text-xs text-slate-400 font-sans relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-12">
          
          {/* Column 1: Branding and brief mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#c89832] to-[#dfb448] text-[#051124]">
                <ShieldCheck className="h-5.5 w-5.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-extrabold tracking-wider leading-none text-white">
                  SAFEONE
                </span>
                <span className="font-sans text-[8px] font-bold uppercase tracking-[0.22em] text-[#dfb448] leading-none mt-0.5">
                  SEGUROS
                </span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Protegendo com inovação tecnológica e consultoria especializada de alto padrão para amparar sua família e empresas nos momentos críticos.
            </p>
          </div>

          {/* Column 2: Quick navigation anchors */}
          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-[10px] text-[#dfb448]">Navegação</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="#solucoes" className="hover:text-white transition-colors">Soluções de Vida</a>
              </li>
              <li>
                <a href="#simulador" className="text-[#dfb448] hover:text-[#dfb448]/80 font-bold transition-colors">Simulador Online</a>
              </li>
              <li>
                <a href="#perguntas-frequentes" className="hover:text-white transition-colors">Dúvidas Frequentes</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-[10px] text-[#dfb448]">Fale Conosco</h4>
            <ul className="space-y-2.5 leading-normal text-slate-350">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                <span className="truncate">{settings.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: SUSEP Regulatory terms without the interactive Admin toggle */}
          <div>
            <h4 className="font-display font-bold text-white tracking-widest uppercase mb-4 text-[10px] text-[#dfb448]">Regulatório</h4>
            <p className="text-[10px] leading-relaxed text-slate-400">
              SafeOne Corretora de Seguros Ltda. Registrada na SUSEP sob o n° <span className="font-mono text-white">{settings.susepNumber}</span>. O registro do plano na autarquia não implica obrigação ou recomendação da comercialização por parte da SUSEP.
            </p>
          </div>

        </div>

        {/* Separator line */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© {currentYear} SafeOne Corretora de Seguros. CNPJ <span className="font-mono text-slate-400">{settings.cnpj}</span>. Todos os direitos reservados.</p>
            <a 
              href="#adm" 
              className="text-slate-650 hover:text-indigo-400 transition-colors font-medium text-[10px] font-mono tracking-wide underline decoration-slate-800 hover:decoration-indigo-400/50" 
              title="Acesso Administrativo"
            >
              /ADM
            </a>
          </div>
          <p className="flex items-center gap-1">
            Garantindo segurança <Heart className="h-3.5 w-3.5 text-amber-600 fill-amber-600" /> para sua família.
          </p>
        </div>

      </div>
    </footer>
  );
}
