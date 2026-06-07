import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { settings } = useSettings();

  const faqItems: FaqItem[] = [

    {
      question: "Quem pode contratar o Seguro de Vida?",
      answer: "Qualquer pessoa física com idade entre 18 e 80 anos em boas condições de saúde e atividade ativa pode contratar de forma simples. Há regimes de limite de capital para idades mais avançadas que nosso corretor ajusta individualmente."
    },
    {
      question: "O preço simulado é o valor final garantido?",
      answer: "O simulador oferece uma estimativa técnica realista baseada nas principais tabelas de prêmio de seguros. Após receber a cotação via WhatsApp, o especialista formaliza a Declaração de Saúde para emitir a proposta oficial sem reajustes ocultos."
    },
    {
      question: "Como funciona a cobertura para Doenças Graves?",
      answer: "A indenização por Doenças Graves é paga diretamente em dinheiro na conta do segurado após o diagnóstico comprovado em laudo (por exemplo: câncer, infarto ou AVC). Você tem total liberdade para utilizar este recurso como preferir, para cobrir despesas médicas especiais ou garantir bem-estar."
    },
    {
      question: "O Seguro de Vida entra em partilha ou inventário no Brasil?",
      answer: "Não! Conforme a legislação brasileira (artigo 794 do Código Civil), o seguro de vida não faz parte de herança e não responde por dívidas do segurado falecido. A indenização é transferida aos beneficiários indicados isenta de impostos (ITCMD) em até 30 dias de forma rápida."
    },
    {
      question: "Posso alterar meus beneficiários futuramente?",
      answer: "Sim, absolutamente. Você pode alterar a porcentagem e quem são os beneficiários de sua apólice a qualquer momento com total liberdade, basta formalizar a alteração diretamente com seu especialista responsável."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="perguntas-frequentes" className="bg-[#fbfcff] py-20 border-t border-slate-100 leading-relaxed font-sans">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
            <HelpCircle className="h-4 w-4" />
            Dúvidas Frequentes
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a1829]">
            Perguntas Frequentes sobre Proteção
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Veja as principais informações institucionais reguladas pela SUSEP sobre o funcionamento prático das apólices SafeOne.
          </p>
        </div>

        {/* Faq Accordion List */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm transition-all duration-350"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/70 transition-colors focus:outline-none"
                  id={`faq-btn-${index}`}
                >
                  <span className="font-display font-extrabold text-sm sm:text-base leading-snug text-[#0a1829]">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0 ml-4 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-700">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>
                
                {/* Accordion panel section */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] border-t border-slate-100' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <div className="p-5 sm:p-6 bg-slate-50/40 text-sm text-slate-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom helper micro callout */}
        <div className="mt-12 text-center bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
          <p className="text-sm font-bold text-slate-700">
            Ficou com alguma dúvida específica ou deseja simular um caso de profissão não listado?
          </p>
          <a
            href={`https://wa.me/${settings.brokerWhatsApp}?text=${encodeURIComponent("Olá! Gostaria de esclarecer uma dúvida sobre Seguro de Vida que não encontrei na seção de perguntas frequentes do site da SafeOne.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700 hover:text-amber-800 uppercase tracking-wider hover:underline"
          >
            Falar agora com um corretor no WhatsApp →
          </a>
        </div>

      </div>
    </section>
  );
}
