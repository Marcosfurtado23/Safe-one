import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X, Heart, Shield, Landmark, ShieldCheck } from 'lucide-react';
import { useArticles, Article } from '../context/ArticlesContext';

export default function Articles() {
  const { articles } = useArticles();
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Helper to resolve icon dynamically based on category
  const getCategoryIcon = (category: string) => {
    const lc = category.toLowerCase();
    if (lc.includes('familiar') || lc.includes('família')) {
      return <Heart className="h-3 w-3" />;
    }
    if (lc.includes('saúde') || lc.includes('vida') || lc.includes('doença')) {
      return <Shield className="h-3 w-3" />;
    }
    if (lc.includes('sucessão') || lc.includes('inventário') || lc.includes('tribut')) {
      return <Landmark className="h-3 w-3" />;
    }
    return <BookOpen className="h-3 w-3" />;
  };

  return (
    <section id="artigos-educativos" className="bg-slate-50 py-20 border-t border-slate-100 leading-relaxed font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#c5912a]">
            <BookOpen className="h-4 w-4" />
            Conhecimento e Cuidado
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0a1829]">
            Apoiando Você e sua Família
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Dicas práticas e análises técnicas produzidas por nossos especialistas em gestão de riscos e proteção financeira familiar.
          </p>
        </div>

        {/* Articles Grid layout */}
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/60 p-8 max-w-md mx-auto shadow-sm">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Nenhum artigo publicado no momento.</p>
            <p className="text-xs text-slate-400 mt-1">Crie um novo artigo no Painel Administrativo.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
                id={`artigo-card-${article.id}`}
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    // Balanced SafeOne Golden Abstract gradient fallback for articles published without image
                    <div className="h-full w-full bg-gradient-to-br from-[#0c223f] to-[#040e1e] flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-[#dfb448] mb-2 border border-amber-500/15">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#dfb448]/80">SafeOne Seguros</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#c5912a] shadow-sm backdrop-blur-xs">
                    {getCategoryIcon(article.category)}
                    <span>{article.category}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-extrabold text-[#0a1829] leading-snug mb-3 line-clamp-2 hover:text-[#c5912a] transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#c5912a] hover:text-[#b08020] uppercase tracking-wider group focus:outline-none cursor-pointer"
                    id={`ver-artigo-${article.id}`}
                  >
                    Continuar lendo 
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Dyn Modal Component for reading active article */}
        {activeArticle && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fade-in"
            onClick={() => setActiveArticle(null)}
            id="artigo-modal-overlay"
          >
            <div 
              className="relative w-full max-w-3xl rounded-2xl bg-white text-slate-800 shadow-2xl overflow-y-auto max-h-[92vh] border border-slate-100"
              onClick={(e) => e.stopPropagation()}
              id="artigo-modal-content"
            >
              {/* Image banner or fallback header */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#051124]">
                {activeArticle.image ? (
                  <>
                    <img 
                      src={activeArticle.image} 
                      alt={activeArticle.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  </>
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#0c223f] to-[#040e1e] flex items-center justify-center relative">
                    <ShieldCheck className="h-20 w-20 text-[#dfb448]/15 absolute right-10 bottom-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e1e]/90 to-transparent" />
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Fechar artigo"
                  id="fechar-artigo-modal"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block rounded-md bg-[#c5912a] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white mb-2">
                    {activeArticle.category}
                  </span>
                  <h3 className="font-display text-lg sm:text-2xl font-black leading-snug text-white shadow-xs">
                    {activeArticle.title}
                  </h3>
                </div>
              </div>

              {/* Text Articles and details content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                    Publicado em {activeArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    {activeArticle.readTime}
                  </span>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-slate-650 leading-relaxed font-sans">
                  {activeArticle.content.map((paragraph, i) => (
                    <p key={i}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    Artigo informativo institucional fornecido por SafeOne Seguros.
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(null)}
                    className="w-full sm:w-auto text-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-850 active:scale-95 transition-all cursor-pointer"
                  >
                    Fechar leitura
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
