import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  User, 
  Briefcase, 
  UserX, 
  UserCheck, 
  ShieldCheck, 
  CircleCheck,
  Smartphone,
  X
} from 'lucide-react';
import { ClientInfo, AdditionalCoverages, SimulationResult } from '../types';
import { useSettings } from '../context/SettingsContext';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Simulator({ isOpen, onClose }: SimulatorProps) {
  const { settings, updateSettings } = useSettings();

  // Client input states
  const [nome, setNome] = useState<string>('');
  const [idade, setIdade] = useState<number>(30);
  const [profissao, setProfissao] = useState<string>('Autônomo/Escritório');
  const [classeRisco, setClasseRisco] = useState<'baixo' | 'medio' | 'alto'>('baixo');
  const [isFumante, setIsFumante] = useState<boolean>(false);
  const [capitalSegurado, setCapitalSegurado] = useState<number>(300000);

  // Optional coverages state
  const [coverages, setCoverages] = useState<AdditionalCoverages>({
    morteAcidental: true,
    invalidezAcidente: true,
    doencasGraves: false,
    dit: false,
    assistenciaFuneral: true,
  });

  // Broker WhatsApp number setup (user-customizable linked to global context settings)
  const whatsappCorretor = settings.brokerWhatsApp;
  const setWhatsappCorretor = (val: string) => updateSettings({ brokerWhatsApp: val });

  // Computed results state

  const [simulation, setSimulation] = useState<SimulationResult>({
    clientInfo: { nome: '', idade: 30, profissao: '', classeRisco: 'baixo', isFumante: false, capitalSegurado: 300000 },
    coverages: { morteAcidental: true, invalidezAcidente: true, doencasGraves: false, dit: false, assistenciaFuneral: true },
    totalMonthly: 0,
    baseCost: 0,
    coverageDetails: []
  });

  // Body scroll lock effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Helper to format money to BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Live calculation formula
  useEffect(() => {
    let ageMultiplier = 1.0;
    if (idade < 25) ageMultiplier = 0.85;
    else if (idade <= 35) ageMultiplier = 1.0;
    else if (idade <= 45) ageMultiplier = 1.35;
    else if (idade <= 55) ageMultiplier = 1.95;
    else if (idade <= 65) ageMultiplier = 3.2;
    else ageMultiplier = 5.2;

    const baseCoverageFee = (capitalSegurado / 1000) * 0.075; 
    let finalBaseCost = baseCoverageFee * ageMultiplier;

    let riskPower = 1.0;
    if (classeRisco === 'medio') riskPower = 1.3;
    if (classeRisco === 'alto') riskPower = 1.65;

    let habitsPower = 1.0;
    if (isFumante) habitsPower = 1.55;

    finalBaseCost = finalBaseCost * riskPower * habitsPower;

    const coverageDetailsList: { name: string; value: number }[] = [
      { name: "Morte Natural (Base de Morte)", value: finalBaseCost }
    ];

    let extraSum = 0;

    if (coverages.morteAcidental) {
      const cost = (capitalSegurado / 1000) * 0.022 * riskPower;
      extraSum += cost;
      coverageDetailsList.push({ name: "Morte Acidental Especial (+100%)", value: cost });
    }

    if (coverages.invalidezAcidente) {
      const cost = (capitalSegurado / 1000) * 0.026 * riskPower;
      extraSum += cost;
      coverageDetailsList.push({ name: "Invalidez por Acidente (IPA)", value: cost });
    }

    if (coverages.doencasGraves) {
      const cost = (idade < 35 ? 12 : idade < 50 ? 25 : 48) * (capitalSegurado / 200000);
      extraSum += cost;
      coverageDetailsList.push({ name: "Seguro Doenças Graves", value: cost });
    }

    if (coverages.dit) {
      const cost = 16.50 * riskPower * (capitalSegurado / 150000);
      extraSum += cost;
      coverageDetailsList.push({ name: "Diárias Incapacidade (DIT)", value: cost });
    }

    if (coverages.assistenciaFuneral) {
      const cost = 7.90;
      extraSum += cost;
      coverageDetailsList.push({ name: "Assistência Funeral Familiar", value: cost });
    }

    const calculatedTotal = finalBaseCost + extraSum;

    setSimulation({
      clientInfo: {
        nome,
        idade,
        profissao,
        classeRisco,
        isFumante,
        capitalSegurado
      },
      coverages,
      totalMonthly: calculatedTotal,
      baseCost: finalBaseCost,
      coverageDetails: coverageDetailsList
    });
  }, [nome, idade, profissao, classeRisco, isFumante, capitalSegurado, coverages]);

  if (!isOpen) return null;

  const toggleCoverage = (field: keyof AdditionalCoverages) => {
    setCoverages(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = nome.trim() || 'Prezado(a) Cliente';
    const statusEmoji = (val: boolean) => val ? '✅ Sim' : '❌ Não';
    
    const message = `*📋 SIMULAÇÃO DE SEGURO DE VIDA - SAFEONE SEGUROS*
----------------------------------------
*Segurado:* ${cleanName}
*Idade:* ${idade} anos
*Profissão/Cargo:* ${profissao} 
*Fumante:* ${isFumante ? 'Sim' : 'Não'}

*💰 Capital Segurado Solicitado:* ${formatBRL(capitalSegurado)}
----------------------------------------
*Proteções Escolhidas:*
• Morte por Qualquer Causa: ✅ Incluso
• Morte Acidental Especial: ${statusEmoji(coverages.morteAcidental)}
• Invalidez por Acidente (IPA): ${statusEmoji(coverages.invalidezAcidente)}
• Cobertura Doenças Graves: ${statusEmoji(coverages.doencasGraves)}
• Renda Diária por Incapacidade: ${statusEmoji(coverages.dit)}
• Assistência Funeral Familiar: ${statusEmoji(coverages.assistenciaFuneral)}
----------------------------------------
*⭐ Prêmio Mensal Estimado:* *${simulation.totalMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês*

_Desejo receber contato de um especialista para oficializar a simulação._`;

    const cleanPhone = whatsappCorretor.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone || '5577981008782'}?text=${encodeURIComponent(message)}`;
    
    const win = window.open(waUrl, '_blank');
    if (win) {
      win.focus();
    } else {
      window.location.href = waUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto" id="simulador-modal-container">
      {/* Backdrop Close Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      <div className="relative w-full max-w-6xl rounded-3xl bg-[#051124] text-white border border-slate-800 shadow-2xl overflow-y-auto max-h-[92vh] py-12 px-4 sm:px-8 md:px-12 z-10" id="simulador">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-50 h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shadow-lg transition-all cursor-pointer hover:bg-slate-800"
          aria-label="Fechar Simulador"
        >
          <X className="h-5 w-5" />
        </button>
      
      {/* Background radial overlays */}
      <div className="absolute top-0 right-0 -z-10 h-[400px] w-[500px] rounded-full bg-amber-500/5 blur-[130px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-[110px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c5912a]/30 bg-amber-500/5 px-4.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#dfb448]">
            <Calculator className="h-4 w-4" />
            Simulador de Preço
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Simulador de Preços Intuitivo
          </h2>
          <p className="text-sm sm:text-base text-slate-350 text-slate-400">
            Descubra o valor aproximado da sua mensalidade ponderando os capitais e coberturas livremente. No final, encaminhe o resultado direto para o WhatsApp do Corretor.
          </p>
        </div>

        {/* Simulator Grid Setup */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Form Side (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1 Profile Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#07172f] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-[#dfb448] border border-amber-500/20">
                  <User className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">1. Seu Perfil</h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                
                {/* Nome */}
                <div>
                  <label htmlFor="client-name" className="block text-xs font-bold text-slate-305 uppercase tracking-wider mb-2 text-slate-300">
                    Seu nome completo
                  </label>
                  <input
                    type="text"
                    id="client-[#c5912a]"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-650 focus:border-[#dfb448] focus:ring-1 focus:ring-[#dfb448] focus:outline-none transition-all"
                  />
                </div>

                {/* Idade */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="client-age" className="text-xs font-bold text-slate-305 uppercase tracking-wider text-slate-300">
                      Sua idade
                    </label>
                    <span className="font-mono text-xs font-bold text-[#dfb448] bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      {idade} anos
                    </span>
                  </div>
                  <input
                    type="range"
                    id="client-age"
                    min="18"
                    max="80"
                    value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-850 accent-[#c5912a] focus:outline-none"
                  />
                </div>

                {/* Profissao */}
                <div>
                  <label htmlFor="client-profession" className="block text-xs font-bold text-slate-305 uppercase tracking-wider mb-2 text-slate-300">
                    Sua Ocupação / Cargo
                  </label>
                  <input
                    type="text"
                    id="client-profession"
                    value={profissao}
                    onChange={(e) => setProfissao(e.target.value)}
                    placeholder="Ex: Autônomo, Advogado, Vendas..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-650 focus:border-[#dfb448] focus:ring-1 focus:ring-[#dfb448] focus:outline-none transition-all"
                  />
                </div>

                {/* Fumante */}
                <div>
                  <span className="block text-xs font-bold text-slate-305 uppercase tracking-wider mb-2 text-slate-300">
                    Fumante ou usa vapes?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFumante(false)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-bold transition-all ${
                        !isFumante
                          ? 'border-[#c5912a]/50 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-450 hover:text-slate-300'
                      }`}
                    >
                      <UserCheck className="h-4 w-4 text-[#dfb448]" />
                      Não Fumante
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFumante(true)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-bold transition-all ${
                        isFumante
                          ? 'border-[#c5912a]/50 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-450 hover:text-slate-300'
                      }`}
                    >
                      <UserX className="h-4 w-4" />
                      Fumante
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Step 2 Slider Capital Segurado */}
            <div className="rounded-2xl border border-slate-800 bg-[#07172f] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c5912a]/10 text-[#dfb448] border border-[#c5912a]/20">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">2. Capital Desejado</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block text-slate-405 uppercase tracking-widest font-mono text-slate-400">Total de Indenização</span>
                  <p className="font-display text-lg sm:text-xl font-black text-[#dfb448]">
                    {formatBRL(capitalSegurado)}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="capital-range" className="block text-sm text-slate-300 mb-3">
                  Valor que as pessoas que você ama receberão:
                </label>
                <input
                  type="range"
                  id="capital-range"
                  min="50000"
                  max="1500000"
                  step="25000"
                  value={capitalSegurado}
                  onChange={(e) => setCapitalSegurado(Number(e.target.value))}
                  className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-855 accent-[#c5912a] focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>R$ 50 Mil</span>
                  <span className="hidden sm:inline font-bold">R$ 500 Mil (Recomendado)</span>
                  <span>R$ 1.5 Milhão (VIP)</span>
                </div>
              </div>
            </div>

            {/* Step 3 Optional Coverages */}
            <div className="rounded-2xl border border-slate-800 bg-[#07172f] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-[#dfb448] border border-amber-500/20">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">3. Coberturas Adicionais</h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                
                {/* Morte Acidental */}
                <div 
                  onClick={() => toggleCoverage('morteAcidental')}
                  className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                    coverages.morteAcidental 
                      ? 'border-[#c5912a]/50 bg-amber-500/5' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-display font-bold text-sm block text-white">Morte Acidental em Dobro</span>
                      <span className="text-[11px] block mt-1 text-slate-400">Paga 200% do capital inicial contratado se for por acidente.</span>
                    </div>
                    <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${coverages.morteAcidental ? 'bg-[#c5912a] border-[#c08a1d] text-white' : 'border-slate-800'}`}>
                      {coverages.morteAcidental && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                </div>

                {/* Invalidez */}
                <div 
                  onClick={() => toggleCoverage('invalidezAcidente')}
                  className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                    coverages.invalidezAcidente 
                      ? 'border-[#c5912a]/50 bg-amber-500/5' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-display font-bold text-sm block text-white">Invalidez p/ Acidente</span>
                      <span className="text-[11px] block mt-1 text-slate-400">Garante idenização integral ou proporcional se houver sequelamento físico.</span>
                    </div>
                    <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${coverages.invalidezAcidente ? 'bg-[#c5912a] border-[#c08a1d] text-white' : 'border-slate-800'}`}>
                      {coverages.invalidezAcidente && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                </div>

                {/* Doencas Graves */}
                <div 
                  onClick={() => toggleCoverage('doencasGraves')}
                  className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                    coverages.doencasGraves 
                      ? 'border-[#c5912a]/50 bg-amber-500/5' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-display font-bold text-sm block text-white">Doenças Graves em Vida</span>
                      <span className="text-[11px] block mt-1 text-slate-400">Receba aporte imediato para focar na cura de câncer, infarto ou AVC.</span>
                    </div>
                    <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${coverages.doencasGraves ? 'bg-[#c5912a] border-[#c08a1d] text-white' : 'border-slate-800'}`}>
                      {coverages.doencasGraves && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                </div>

                {/* DIT */}
                <div 
                  onClick={() => toggleCoverage('dit')}
                  className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                    coverages.dit 
                      ? 'border-[#c5912a]/50 bg-amber-500/5' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-display font-bold text-sm block text-white">Diárias de Afastamento (DIT)</span>
                      <span className="text-[11px] block mt-1 text-slate-400">Paga diária de renda caso sofra afastamento médico temporário.</span>
                    </div>
                    <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${coverages.dit ? 'bg-[#c5912a] border-[#c08a1d] text-white' : 'border-slate-800'}`}>
                      {coverages.dit && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                </div>

                {/* Assististencia funeral */}
                <div 
                  onClick={() => toggleCoverage('assistenciaFuneral')}
                  className={`flex flex-col justify-between sm:col-span-2 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                    coverages.assistenciaFuneral 
                      ? 'border-[#c5912a]/50 bg-amber-500/5' 
                      : 'border-slate-800 bg-slate-950/20 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-display font-bold text-sm block text-white">Assistência Funeral Familiar Real</span>
                      <span className="text-[11px] block mt-1 text-slate-400">Todo o suporte e custos de sepultamento ou cremação para a família sem burocracias.</span>
                    </div>
                    <div className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${coverages.assistenciaFuneral ? 'bg-[#c5912a] border-[#c08a1d] text-white' : 'border-slate-800'}`}>
                      {coverages.assistenciaFuneral && <span className="text-xs">✓</span>}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Customizer Settings */}
            <div className="rounded-2xl border border-slate-800 bg-[#07172f] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-4 w-4 text-[#dfb448]" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configuração do WhatsApp Corretor</span>
              </div>
              <div className="space-y-3">
                <label htmlFor="broker-phone" className="block text-xs text-slate-400">
                  Insira o número de WhatsApp que receberá a mensagem de orçamento gerada:
                </label>
                <input
                  type="text"
                  id="broker-phone"
                  value={whatsappCorretor}
                  onChange={(e) => setWhatsappCorretor(e.target.value)}
                  placeholder="Ex: 5577981008782"
                  className="max-w-xs rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-[#dfb448] focus:outline-none"
                />
                <span className="block text-[10px] text-slate-500">Coloque país (55) + DDD + número. Ex: 5577981008782</span>
              </div>
            </div>

          </div>

          {/* Results Side (5 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-2xl border border-[#c5912a]/35 bg-[#07172f] p-6 sm:p-8 shadow-2xl">
              
              <span className="text-[11px] font-bold text-[#dfb448] uppercase tracking-widest font-mono">Resultados Estimados</span>
              <h3 className="font-display text-lg font-bold text-white mt-1 mb-6">Resumo Orçamentário</h3>

              {/* Dynamic Price Display */}
              <div className="text-center rounded-2xl bg-slate-950/60 border border-slate-800 p-6 mb-6">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Prêmio Mensal Sugerido</span>
                <div className="font-display text-3xl sm:text-4xl font-black text-[#dfb448] tracking-tight">
                  {simulation.totalMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  <span className="text-xs font-semibold text-slate-500 font-sans ml-1">/mês</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Orçamento instantâneo regulado
                </div>
              </div>

              {/* Breakdown detail list */}
              <div className="space-y-4 mb-6">
                
                {/* Segurado card summary */}
                <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800 text-xs space-y-2.5 text-slate-300">
                  <span className="text-[10px] text-[#dfb448] font-bold uppercase block">Dados do Segurado</span>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nome:</span>
                    <span className="font-bold text-white truncate max-w-[170px]">{nome || 'Proponente'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Idade / Estilo:</span>
                    <span className="font-bold text-white">{idade} anos ({isFumante ? 'Fumante' : 'Não Fumante'})</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/60 pt-2">
                    <span className="text-slate-400">Ocupação cadastrada:</span>
                    <span className="font-bold text-white truncate max-w-[170px]">{profissao}</span>
                  </div>
                </div>

                {/* Items layout */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Detalhamento dos Custos:</span>
                  
                  {simulation.coverageDetails.map((item, id) => (
                    <div key={id} className="flex justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-404 text-slate-400">
                        <span className="h-1 w-1 rounded-full bg-amber-500" />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-mono">{item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))}

                  <div className="flex justify-between border-t border-slate-800 pt-2.5 text-sm font-bold text-white">
                    <span>Morte p/ Qualquer Causa</span>
                    <span className="text-[#dfb448] font-display font-black">{formatBRL(capitalSegurado)}</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <form onSubmit={handleSendQuote} id="simulator-send-quote-form">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 px-6 py-4 font-bold text-white shadow-xl transition-all hover:scale-[1.015] cursor-pointer"
                >
                  <img 
                    src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
                    alt="WhatsApp"
                    className="h-5 w-5 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  Receber Orçamento no WhatsApp
                </button>
              </form>

              <span className="block text-[10px] text-slate-500 text-center mt-4">
                *Simulação técnica exemplificativa baseada no perfil padrão do participante.
              </span>

            </div>
          </div>

        </div>

      </div>
    </div>
    </div>
  );
}
