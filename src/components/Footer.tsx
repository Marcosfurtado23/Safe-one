import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Settings, 
  X, 
  Save, 
  RotateCcw, 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useArticles, Article } from '../context/ArticlesContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { articles, addArticle, updateArticle, deleteArticle, resetArticles } = useArticles();
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'articles'>('settings');

  // General Settings inputs state
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.brokerWhatsApp);
  const [tempEmail, setTempEmail] = useState(settings.email);
  const [tempAddress, setTempAddress] = useState(settings.address);
  const [tempPhone, setTempPhone] = useState(settings.phone);
  const [tempSusep, setTempSusep] = useState(settings.susepNumber);
  const [tempCnpj, setTempCnpj] = useState(settings.cnpj);

  // Articles manager state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formCategory, setFormCategory] = useState('Proteção Familiar');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formReadTime, setFormReadTime] = useState('5 min de leitura');
  const [formDate, setFormDate] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formImageMode, setFormImageMode] = useState<'url' | 'upload' | 'none'>('url');
  const [formContentText, setFormContentText] = useState('');

  // Notification feedbacks
  const [saveSuccess, setSaveSuccess] = useState(false);

  const openAdmin = () => {
    // Reset configurations state
    setTempWhatsApp(settings.brokerWhatsApp);
    setTempEmail(settings.email);
    setTempAddress(settings.address);
    setTempPhone(settings.phone);
    setTempSusep(settings.susepNumber);
    setTempCnpj(settings.cnpj);
    
    // Close form if open
    setIsFormOpen(false);
    setEditingArticleId(null);
    setActiveTab('settings');
    setIsAdminOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brokerWhatsApp: tempWhatsApp.trim(),
      email: tempEmail.trim(),
      address: tempAddress.trim(),
      phone: tempPhone.trim(),
      susepNumber: tempSusep.trim(),
      cnpj: tempCnpj.trim(),
    });
    triggerSuccessFeedback();
  };

  const triggerSuccessFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleRestoreSettings = () => {
    if (window.confirm("Deseja realmente restaurar os dados padrão da corretora?")) {
      resetSettings();
      // Instantly refresh inputs
      setTempWhatsApp(settings.brokerWhatsApp);
      setTempEmail(settings.email);
      setTempAddress(settings.address);
      setTempPhone(settings.phone);
      setTempSusep(settings.susepNumber);
      setTempCnpj(settings.cnpj);
      triggerSuccessFeedback();
    }
  };

  // --- Article management triggers ---

  const handleOpenNewArticleForm = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace('.', ''); // standard format: "07 Jun 2026"

    setEditingArticleId(null);
    setFormCategory('Proteção Familiar');
    setFormCustomCategory('');
    setFormTitle('');
    setFormExcerpt('');
    setFormReadTime('5 min de leitura');
    setFormDate(formattedDate);
    setFormImage('');
    setFormImageMode('url');
    setFormContentText('');
    setIsFormOpen(true);
  };

  const handleEditArticleClick = (art: Article) => {
    setEditingArticleId(art.id);
    
    // Check if category is standard
    const standardCategories = ['Proteção Familiar', 'Saúde em Vida', 'Sucessão Inteligente'];
    if (standardCategories.includes(art.category)) {
      setFormCategory(art.category);
      setFormCustomCategory('');
    } else {
      setFormCategory('Custom');
      setFormCustomCategory(art.category);
    }

    setFormTitle(art.title);
    setFormExcerpt(art.excerpt);
    setFormReadTime(art.readTime);
    setFormDate(art.date);
    
    if (art.image) {
      setFormImage(art.image);
      setFormImageMode(art.image.startsWith('data:') ? 'upload' : 'url');
    } else {
      setFormImage('');
      setFormImageMode('none');
    }
    
    setFormContentText(art.content.join('\n\n'));
    setIsFormOpen(true);
  };

  const handleDeleteArticleClick = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) {
      deleteArticle(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem selecionada é muito grande! Escolha um arquivo menor de até 2MB ou utilize links de imagem.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = formCategory === 'Custom' ? formCustomCategory : formCategory;
    const finalImage = formImageMode === 'none' ? undefined : formImage;
    const contentParagraphs = formContentText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const articlePayload = {
      category: finalCategory || 'Geral',
      title: formTitle,
      excerpt: formExcerpt,
      readTime: formReadTime,
      date: formDate,
      image: finalImage,
      content: contentParagraphs.length > 0 ? contentParagraphs : ['Vazio']
    };

    if (editingArticleId) {
      updateArticle(editingArticleId, articlePayload);
    } else {
      addArticle(articlePayload);
    }

    setIsFormOpen(false);
    setEditingArticleId(null);
    triggerSuccessFeedback();
  };

  const handleRestoreArticlesDefault = () => {
    if (window.confirm("Essa ação substituirá todos os artigos criados pelos 3 originais da SafeOne. Deseja prosseguir?")) {
      resetArticles();
      setIsFormOpen(false);
      setEditingArticleId(null);
      triggerSuccessFeedback();
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

      {/* Corporate High-Fidelity Admin Modal Dashboard */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#07172f] text-white border border-slate-800 shadow-2xl p-5 sm:p-7 my-8 max-h-[92vh] flex flex-col animate-fade-in font-sans">
            
            {/* Header section with tab selectors and exit button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-850 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Settings className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white tracking-tight">Painel Executivo SafeOne</h3>
                  <p className="text-[10px] text-slate-400">Controles autoritativos do site institutivo</p>
                </div>
              </div>

              {/* Alert Feedback of Successful Database Writes */}
              {saveSuccess && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15 text-[10px] font-bold tracking-wide animate-pulse self-stretch sm:self-auto">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>ALTERAÇÕES GRAVADAS COM SUCESSO</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-4 right-4 sm:static h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-900 text-slate-450 hover:text-white transition-colors"
                aria-label="Fechar painel"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Dashboard Navigation Tabs */}
            <div className="flex border-b border-slate-850 pb-2 mb-4 gap-2">
              <button
                type="button"
                onClick={() => { setActiveTab('settings'); setIsFormOpen(false); }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#c5912a] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Configurações Gerais
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'articles'
                    ? 'bg-[#c5912a] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Gerenciar Artigos
              </button>
            </div>

            {/* Scrollable Container Area */}
            <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: '600px' }}>
              
              {/* Tab 1: Contact details and regulatory terms */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-xl space-y-3.5">
                    <h4 className="text-xs font-bold text-[#dfb448] tracking-widest uppercase">Canais de Contato & Redirecionamento</h4>
                    
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          WhatsApp de Leads (Ex: 5577981008782)
                        </label>
                        <input
                          type="text"
                          value={tempWhatsApp}
                          onChange={(e) => setTempWhatsApp(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Telefone de Atendimento (Exibição)
                        </label>
                        <input
                          type="text"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        E-mail de Suporte
                      </label>
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        Endereço Corporativo
                      </label>
                      <input
                        type="text"
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-850 p-4 rounded-xl space-y-3.5">
                    <h4 className="text-xs font-bold text-[#dfb448] tracking-widest uppercase">Identificadores Regulatórios</h4>
                    
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Número SUSEP
                        </label>
                        <input
                          type="text"
                          value={tempSusep}
                          onChange={(e) => setTempSusep(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          CNPJ da Administradora
                        </label>
                        <input
                          type="text"
                          value={tempCnpj}
                          onChange={(e) => setTempCnpj(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRestoreSettings}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer font-bold"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restaurar Valores Padrão</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#c5912a] hover:bg-[#b08020] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salvar Parâmetros Gerais</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Dashboard Articles CRUD manager */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  
                  {/* Option List view */}
                  {!isFormOpen ? (
                    <div className="space-y-4 animate-fade-in">
                      
                      <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-widest uppercase">Central de Matérias & Notícias</h4>
                          <p className="text-[10px] text-slate-405">Edite artigos existentes ou adicione novos sem limite de volumetria.</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleRestoreArticlesDefault}
                            title="Restabelecer artigos de fábrica"
                            className="bg-transparent border border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-white p-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span className="hidden sm:inline">Padrão Fábrica</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleOpenNewArticleForm}
                            className="bg-[#c5912a] hover:bg-[#b08020] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-[1.01] cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Nova Notícia
                          </button>
                        </div>
                      </div>

                      {/* Display articles items inside a neat grid */}
                      <div className="space-y-2.5">
                        {articles.map((art) => (
                          <div 
                            key={art.id} 
                            className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-[#dfb448]/20 transition-all group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Preview thumbnail inside manager list */}
                              <div className="hidden sm:block h-12 w-12 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-700">
                                {art.image ? (
                                  <img 
                                    src={art.image} 
                                    alt="" 
                                    className="h-full w-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-slate-900 flex items-center justify-center text-[8px] text-[#dfb448] font-bold uppercase">
                                    Texto
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-[#dfb448] text-[9px] font-extrabold uppercase mb-1">
                                  {art.category}
                                </span>
                                <h5 className="font-display text-[12px] font-extrabold text-white leading-tight truncate group-hover:text-amber-400 transition-colors">
                                  {art.title}
                                </h5>
                                <div className="flex gap-2 text-[9px] text-slate-450 mt-1 font-mono items-center">
                                  <span className="flex items-center gap-0.5"><Calendar className="h-2.5 w-2.5" /> {art.date}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> {art.readTime}</span>
                                  <span>•</span>
                                  <span className="text-amber-500 font-bold">{art.image ? 'Sim (Postagem com Foto)' : 'Não (Somente Texto)'}</span>
                                </div>
                              </div>
                            </div>

                            {/* CRUD Action Buttons */}
                            <div className="flex gap-2 ml-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditArticleClick(art)}
                                className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/30 text-slate-300 hover:text-amber-450 flex items-center justify-center transition-colors cursor-pointer"
                                title="Editar postagem"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteArticleClick(art.id, art.title)}
                                className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                                title="Deletar postagem"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {articles.length === 0 && (
                          <div className="text-center py-10 bg-slate-900/10 rounded-xl border border-dashed border-slate-800">
                            <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">Você removeu todas as postagens. Clique em "Nova Notícia" ou use "Padrão Fábrica".</p>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    
                    /* Form View - Editing/Inserting dynamic records */
                    <form onSubmit={handleSaveArticle} className="space-y-4 bg-slate-950/45 p-4 rounded-xl border border-slate-800 animate-fade-in text-xs">
                      
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] font-bold"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          <span>Voltar para Lista</span>
                        </button>
                        <h4 className="font-display font-black text-[#dfb448] tracking-wide ml-2 uppercase">
                          {editingArticleId ? 'Editar Matéria Existente' : 'Salvar Nova Matéria no Blog'}
                        </h4>
                      </div>

                      {/* Fields Category Grid */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                            Categoria do Artigo
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all cursor-pointer"
                            required
                          >
                            <option value="Proteção Familiar">Proteção Familiar</option>
                            <option value="Saúde em Vida">Saúde em Vida</option>
                            <option value="Sucessão Inteligente">Sucessão Inteligente</option>
                            <option value="Custom">Escrever Categoria Personalizada...</option>
                          </select>
                        </div>

                        {formCategory === 'Custom' && (
                          <div className="animate-fade-in">
                            <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                              Escreva sua Categoria Customizada
                            </label>
                            <input
                              type="text"
                              value={formCustomCategory}
                              onChange={(e) => setFormCustomCategory(e.target.value)}
                              placeholder="Ex: Previdência Privada"
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                              required
                            />
                          </div>
                        )}
                      </div>

                      {/* Title & Excerpt row */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Título Destacado da Matéria
                        </label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="Ex: Como proteger seus entes queridos no início de carreira..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-semibold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Resumo / Excerpt (Aparece na prévia do card)
                        </label>
                        <textarea
                          value={formExcerpt}
                          onChange={(e) => setFormExcerpt(e.target.value)}
                          placeholder="Digite um resumo curto (máximo 2 linhas)..."
                          rows={2}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all resize-none"
                          required
                        />
                      </div>

                      {/* Meta dates and Read time */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                            Data de Publicação
                          </label>
                          <input
                            type="text"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            placeholder="Ex: 08 Jun, 2026"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                            Tempo Estimado de Leitura
                          </label>
                          <input
                            type="text"
                            value={formReadTime}
                            onChange={(e) => setFormReadTime(e.target.value)}
                            placeholder="Ex: 5 min de leitura"
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Image handling - com ou sem imagens */}
                      <div className="bg-slate-950/65 border border-slate-850 p-4 rounded-xl space-y-3.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                            Seleção de Imagens Recomendada (Sem ou Com Imagens)
                          </label>
                          <span className="text-[9px] bg-amber-500/10 text-amber-500 rounded-sm px-1.5 font-bold">Post Imagens</span>
                        </div>

                        {/* Mode selectors */}
                        <div className="flex gap-2 bg-slate-950 p-1 border border-slate-800 rounded-lg">
                          <button
                            type="button"
                            onClick={() => setFormImageMode('url')}
                            className={`flex-1 py-1.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                              formImageMode === 'url' ? 'bg-[#c5912a] text-white' : 'text-slate-450 hover:text-white'
                            }`}
                          >
                            Link Externo / URL
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setFormImageMode('upload')}
                            className={`flex-1 py-1.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                              formImageMode === 'upload' ? 'bg-[#c5912a] text-white' : 'text-slate-450 hover:text-white'
                            }`}
                          >
                            Carregar do Computador
                          </button>

                          <button
                            type="button"
                            onClick={() => { setFormImageMode('none'); setFormImage(''); }}
                            className={`flex-1 py-1.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                              formImageMode === 'none' ? 'bg-[#c5912a] text-white' : 'text-slate-450 hover:text-white'
                            }`}
                          >
                            Sem Imagem (Fallback)
                          </button>
                        </div>

                        {/* Rendering selected form blocks */}
                        {formImageMode === 'url' && (
                          <div className="space-y-1.5 animate-fade-in">
                            <label className="block text-[9px] font-semibold text-slate-400">
                              Insira a URL da Foto (Ideal para links do Postimages, Unsplash, etc.)
                            </label>
                            <input
                              type="url"
                              value={formImage}
                              onChange={(e) => setFormImage(e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all"
                            />
                          </div>
                        )}

                        {formImageMode === 'upload' && (
                          <div className="space-y-1.5 animate-fade-in">
                            <label className="block text-[9px] font-semibold text-slate-400">
                              Selecione uma imagem local do seu computador
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 bg-[#0a1b35] hover:bg-[#122b52] hover:text-white text-[#dfb448] font-bold py-2 px-3 border border-amber-500/20 rounded-xl cursor-pointer transition-colors text-[10px]">
                                <Upload className="h-3.5 w-3.5" />
                                Escolher Arquivo...
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                              
                              {/* Display filename preview */}
                              {formImage && formImage.startsWith('data:') && (
                                <span className="text-[10px] text-emerald-400 font-medium">✓ Carregado com sucesso</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Visual thumbnail preview */}
                        {formImage && (
                          <div className="flex items-center gap-3 bg-slate-950/80 p-2 rounded-xl border border-slate-850 animate-fade-in">
                            <div className="h-14 w-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                              <img src={formImage} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-white">Visualização da Imagem</p>
                              <button 
                                type="button" 
                                onClick={() => setFormImage('')}
                                className="text-[9px] text-red-400 hover:underline cursor-pointer"
                              >
                                Remover Imagem
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Paragraph content mapping */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                            Conteúdo Completo do Artigo
                          </label>
                          <span className="text-[9px] text-slate-500">Pressione ENTER duplo para criar novos parágrafos.</span>
                        </div>
                        <textarea
                          value={formContentText}
                          onChange={(e) => setFormContentText(e.target.value)}
                          placeholder="Digite aqui todo o texto da sua postagem..."
                          rows={6}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white focus:border-[#dfb448] focus:outline-none transition-all font-sans leading-relaxed"
                          required
                        />
                      </div>

                      {/* Submitting buttons */}
                      <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => { setIsFormOpen(false); setEditingArticleId(null); }}
                          className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-950 text-slate-450 hover:text-white tracking-wide cursor-pointer font-bold duration-200"
                        >
                          Cancelar
                        </button>
                        
                        <button
                          type="submit"
                          className="bg-[#c5912a] hover:bg-[#b08020] text-white px-5 py-2.5 rounded-xl font-bold hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                          {editingArticleId ? 'Salvar Matéria' : 'Publicar no Blog'}
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
