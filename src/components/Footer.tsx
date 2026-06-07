import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Heart, Settings, X, Save, RotateCcw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Modal input states
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.brokerWhatsApp);
  const [tempEmail, setTempEmail] = useState(settings.email);
  const [tempAddress, setTempAddress] = useState(settings.address);
  const [tempPhone, setTempPhone] = useState(settings.phone);
  const [tempSusep, setTempSusep] = useState(settings.susepNumber);
  const [tempCnpj, setTempCnpj] = useState(settings.cnpj);

  const openAdmin = () => {
    setTempWhatsApp(settings.brokerWhatsApp);
    setTempEmail(settings.email);
    setTempAddress(settings.address);
    setTempPhone(settings.phone);
    setTempSusep(settings.susepNumber);
    setTempCnpj(settings.cnpj);
    setIsAdminOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brokerWhatsApp: tempWhatsApp.trim(),
      email: tempEmail.trim(),
      address: tempAddress.trim(),
      phone: tempPhone.trim(),
      susepNumber: tempSusep.trim(),
      cnpj: tempCnpj.trim(),
    });
    setIsAdminOpen(false);
  };

  const handleRestore = () => {
    if (window.confirm("Deseja realmente restaurar os dados padrão da corretora?")) {
      resetSettings();
      // Instantly close the modal to reflect resets
      setIsAdminOpen(false);
    }
  };

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

          {/* Column 4: SUSEP Regulatory terms containing minimalist Admin click */}
          <div>
            <button
              type="button"
              onClick={openAdmin}
              className="group flex items-center gap-1.5 font-display font-bold text-white tracking-widest uppercase mb-4 text-[10px] text-[#dfb448] hover:text-white transition-colors text-left bg-transparent border-none p-0 outline-none cursor-pointer"
            >
              <span>SUSEP</span>
              <Settings className="h-3 w-3 text-slate-500 group-hover:text-[#dfb448] group-hover:rotate-45 transition-all" />
              <span className="text-[8px] font-mono font-medium text-slate-500 normal-case tracking-none opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                (Administrar site)
              </span>
            </button>
            <p className="text-[10px] leading-relaxed text-slate-400">
              SafeOne Corretora de Seguros Ltda. Registrada na SUSEP sob o n° <span className="font-mono text-white">{settings.susepNumber}</span>. O registro do plano na autarquia não implica obrigação ou recomendação da comercialização por parte da SUSEP.
            </p>
          </div>

        </div>

        {/* Separator line */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {currentYear} SafeOne Corretora de Seguros. CNPJ <span className="font-mono text-slate-400">{settings.cnpj}</span>. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Garantindo segurança <Heart className="h-3.5 w-3.5 text-amber-600 fill-amber-600" /> para sua família.
          </p>
        </div>

      </div>

      {/* Corporate Minimalist Admin Modal Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#07172f] text-white border border-slate-800 shadow-2xl p-6 sm:p-8 animate-fade-in font-sans">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Settings className="h-4.5 w-4.5 text-[#dfb448]" />
                <h3 className="font-display text-base font-bold text-white tracking-tight">Painel Administrativo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-normal">
              Utilize este painel instantâneo para alterar as informações de contato exibidas publicamente em todo o site.
            </p>

            {/* Inputs Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* WhatsApp Row */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp de Leads (País+DDD+Número, Sem Símbolos)
                </label>
                <input
                  type="text"
                  value={tempWhatsApp}
                  onChange={(e) => setTempWhatsApp(e.target.value)}
                  placeholder="Ex: 557791008782"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                  required
                />
              </div>

              {/* Email Row */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email de Atendimento
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="Ex: contato@empresa.com.br"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Address Row */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Endereço Corporativo
                </label>
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Landline/Contact Phone Row */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Telefone de Contato (Exibição)
                </label>
                <input
                  type="text"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="Ex: +55 (11) 4003-9821"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                  required
                />
              </div>

              {/* SUSEP and CNPJ side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Registro SUSEP
                  </label>
                  <input
                    type="text"
                    value={tempSusep}
                    onChange={(e) => setTempSusep(e.target.value)}
                    placeholder="Ex: 10.2045610"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    CNPJ Comercial
                  </label>
                  <input
                    type="text"
                    value={tempCnpj}
                    onChange={(e) => setTempCnpj(e.target.value)}
                    placeholder="Ex: 00.320.145/0001-99"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                    required
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleRestore}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-950 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restaurar Padrões</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#c5912a] hover:bg-[#b08020] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
