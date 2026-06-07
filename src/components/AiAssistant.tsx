import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, Trash2, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const PREMADE_QUESTIONS = [
  "Como funciona o Simulador Online?",
  "O que cobre Doenças Graves em vida?",
  "Por que usar Seguro no Planejamento Sucessório?",
  "Tenho diárias por afastamento se me acidentar?"
];

export default function AiAssistant() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('safeone_ai_chat');
      return saved ? JSON.parse(saved) : [{
        role: 'model',
        text: 'Olá! Sou seu assistente de proteção virtual na SafeOne Seguros. Como posso te ajudar hoje com suas dúvidas de seguro de vida, planejamento sucessório ou coberturas?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
    } catch {
      return [{
        role: 'model',
        text: 'Olá! Sou seu assistente de proteção virtual na SafeOne Seguros. Como posso te ajudar hoje com suas dúvidas de seguro de vida, planejamento sucessório ou coberturas?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
    }
  });

  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    try {
      sessionStorage.setItem('safeone_ai_chat', JSON.stringify(chatHistory));
    } catch (e) {
      console.warn("Could not save chat history to sessionStorage", e);
    }
    scrollToBottom();
  }, [chatHistory]);

  // Hide action tooltip after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    const defaultMsg: ChatMessage = {
      role: 'model',
      text: 'Histórico redefinido. Como posso te orientar agora sobre coberturas de Vida, Doenças Graves ou nosso Simulador?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([defaultMsg]);
    setErrorText('');
  };

  const cleanAsterisks = (str: string): string => {
    return str.replace(/\*/g, '');
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setErrorText('');
    setInputVal('');
    
    const userMessage: ChatMessage = {
      role: 'user',
      text: cleanAsterisks(trimmed),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          history: chatHistory.map(m => ({ role: m.role, text: m.text })),
          context: {
            brokerWhatsApp: settings.brokerWhatsApp,
            phone: settings.phone,
            email: settings.email,
            cnpj: settings.cnpj,
            susepNumber: settings.susepNumber
          }
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      const rawReply = data.text || 'Desculpe, não consegui compreender, poderia reformular?';
      
      const assistantMessage: ChatMessage = {
        role: 'model',
        text: cleanAsterisks(rawReply),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI assistant route error:', err);
      setErrorText('Erro ao conectar com a IA da SafeOne. Mostrando resposta automática offline.');
      
      // Fallback response offline locally to be instantaneous
      const offlineReply = simulateOfflineResponse(trimmed);
      const assistantMessage: ChatMessage = {
        role: 'model',
        text: cleanAsterisks(offlineReply),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateOfflineResponse = (msg: string): string => {
    const q = msg.toLowerCase();
    if (q.includes('simulador') || q.includes('preço') || q.includes('valor') || q.includes('quanto custa')) {
      return "Para conferir valores estimados, utilize o nosso Simulador Online presente na página! Selecione sua faixa etária, sua profissão (risco) e as coberturas que deseja, como Morte, Doenças Graves ou DIT. Os valores estimados aparecem na hora, permitindo solicitar cotação formal com um corretor direto no WhatsApp!";
    }
    if (q.includes('grave') || q.includes('doença') || q.includes('cancer') || q.includes('avc') || q.includes('infarto')) {
      return "A cobertura de Doenças Graves da SafeOne entrega o capital contratado em vida diretamente em sua conta corrente ao ser diagnosticado com quadros cobertos como Câncer, Infarto ou AVC. É um valor pago em parcela única para você utilizar como quiser (medicamentos, exames adicionais ou viagens).";
    }
    if (q.includes('sucess') || q.includes('inventario') || q.includes('tribut') || q.includes('imposto')) {
      return "O Seguro de Vida é fundamental para planejamento sucessório porque o dinheiro da indenização é isento de impostos hereditários (como o ITCMD) e não passa por inventário (Art. 794 do Código Civil). Sua família recebe em até 30 dias a liquidez necessária para pagar custas de liberação de bens e taxas legais.";
    }
    if (q.includes('afastamento') || q.includes('dit') || q.includes('invalidez') || q.includes('autonomo')) {
      return "A Diária por Invalidez Temporária (DIT) paga diárias em dinheiro se você se afastar do trabalho por recomendação médica devido a acidentes ou doenças. É ideal para médicos, dentistas, advogados e profissionais liberais que dependem do trabalho diário para faturar.";
    }
    if (q.includes('whatsapp') || q.includes('contato') || q.includes('falar') || q.includes('corretor')) {
      return `Você pode falar agora mesmo com os nossos corretores pelo WhatsApp oficial apertando no botão verde no canto inferior direito, ou usar o contato: Telefone ${settings.phone} / Email ${settings.email}.`;
    }
    return "Consulte-me sobre Seguro de Vida, Isenção de Imposto sobre inventário, Diárias de Afastamento (DIT), Proteção de Diagnóstico de Câncer/Infarto e nosso Simulador Online. Como posso te ajudar hoje?";
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  return (
    <>
      {/* Floating launcher button (bottom-left) */}
      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-55 flex flex-col items-start gap-2 select-none">
        {/* Helper Tooltip preview card */}
        {showTooltip && !isOpen && (
          <div className="relative max-w-[250px] rounded-xl border border-amber-500/30 bg-slate-900/95 p-3 shadow-2xl animate-bounce text-left select-none">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-1 right-1 text-slate-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-center gap-1.5 text-amber-500 font-bold font-mono text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3 w-3 animate-pulse text-amber-400" />
              <span>Dúvidas? Fale com a IA</span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-normal font-sans">
              Consulte coberturas, simulações e planejamento sucessório gratuitamente!
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className={`group flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen
              ? 'bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700'
              : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 hover:brightness-110'
          }`}
          title="Fale com nosso Assistente de IA"
          id="ai-floating-assistant"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-slate-200" />
          ) : (
            <div className="relative">
              <Bot className="h-7 w-7 text-white transition-transform group-hover:rotate-6" />
              <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#dfb448] flex items-center justify-center border border-white text-[8px] font-bold text-slate-900 animate-pulse">
                IA
              </div>
            </div>
          )}
        </button>
      </div>

      {/* AI Assistant Chat Console Panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950 z-55 flex flex-col overflow-hidden animate-fade-in font-sans"
          id="ai-assistant-console"
        >
          {/* Header */}
          <div className="bg-slate-900/90 border-b border-slate-850 px-4 py-4 md:px-8">
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-base md:text-lg tracking-tight">SafeOne IA</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono tracking-widest uppercase font-bold">Expert</span>
                  </div>
                  <p className="text-xs text-slate-400">Consultor Inteligente de Proteção Familiar & Planejamento Sucessor</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all border border-transparent hover:border-red-950/40"
                  title="Limpar Conversa"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Limpar Histórico</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
                  title="Fechar Chat"
                >
                  <X className="h-4 w-4" />
                  <span>Voltar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conversation Core panel */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:py-10 scrollbar-thin bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col">
            <div className="max-w-3xl mx-auto w-full space-y-6 flex-1">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 md:gap-4 text-left ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="h-8 w-8 rounded-lg bg-amber-600/20 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-none self-start mt-0.5">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xl ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-slate-50 rounded-tr-none border border-amber-500/20'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line font-sans tracking-wide">
                      {msg.text}
                    </p>
                    <p className={`text-[10px] mt-2 font-mono text-right ${
                      msg.role === 'user' ? 'text-amber-200' : 'text-amber-500/70'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 md:gap-4 text-left justify-start animate-pulse">
                  <div className="h-8 w-8 rounded-lg bg-amber-600/20 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-none self-start mt-0.5">
                    <Sparkles className="h-5 w-5 animate-spin" />
                  </div>
                  <div className="max-w-[85%] bg-slate-900/80 border border-slate-800 text-slate-300 rounded-2xl rounded-tl-none px-4 py-3 text-sm">
                    <div className="flex gap-2 items-center">
                      <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-1.5 text-slate-400 font-mono text-xs">Analisando sua pergunta...</span>
                    </div>
                  </div>
                </div>
              )}

              {errorText && (
                <div className="text-xs bg-red-950/40 border border-red-900/30 text-rose-300 px-4 py-3 rounded-xl text-center flex items-center justify-center gap-1.5 font-mono">
                  <span>{errorText}</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Bottom Fixed Area with Premade Questions and Input */}
          <div className="bg-slate-950 border-t border-slate-900 px-4 py-4 md:py-6">
            <div className="max-w-3xl mx-auto w-full space-y-4">
              
              {/* Premade quick helper select chips */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold text-left flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-amber-500" />
                  Dúvidas frequentes (clique para receber a resposta imediata):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PREMADE_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={isLoading}
                      className="text-left text-xs font-sans px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-850 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group"
                    >
                      <span className="truncate">{q}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer controls typing */}
              <form onSubmit={handleFormSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(cleanAsterisks(e.target.value))}
                  placeholder="Selecione uma dúvida acima ou digite qualquer pergunta sobre seguros aqui..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-850 text-slate-100 px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500 disabled:opacity-60 font-sans"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputVal.trim()}
                  className="px-5 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 text-sm text-center shrink-0"
                >
                  <span className="hidden sm:inline">Perguntar</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
