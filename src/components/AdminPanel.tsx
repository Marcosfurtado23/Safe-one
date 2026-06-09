import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
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
  FileText,
  Lock,
  UserPlus,
  ArrowRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { useSettings } from '../context/SettingsContext';
import { useArticles, Article } from '../context/ArticlesContext';
import { usePartners, Partner } from '../context/PartnersContext';

export default function AdminPanel() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { articles, addArticle, updateArticle, deleteArticle, resetArticles } = useArticles();
  const { partners, addPartner, updatePartner, deletePartner, resetPartners } = usePartners();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Authentication Interface States
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // General Settings inputs state
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.brokerWhatsApp);
  const [tempEmail, setTempEmail] = useState(settings.email);
  const [tempAddress, setTempAddress] = useState(settings.address);
  const [tempPhone, setTempPhone] = useState(settings.phone);
  const [tempSusep, setTempSusep] = useState(settings.susepNumber);
  const [tempCnpj, setTempCnpj] = useState(settings.cnpj);

  // Banner Settings inputs state
  const [tempBannerImageUrl, setTempBannerImageUrl] = useState(settings.bannerImageUrl || "https://i.postimg.cc/MTGLG7xz/Familia-feliz-sentado-em-sofa-202606071250.jpg");
  const [tempBannerPaddingTop, setTempBannerPaddingTop] = useState(settings.bannerPaddingTop ?? 80);
  const [tempBannerPaddingBottom, setTempBannerPaddingBottom] = useState(settings.bannerPaddingBottom ?? 56);
  const [tempBannerGradientLength, setTempBannerGradientLength] = useState(settings.bannerGradientLength ?? 42);
  const [tempBannerPhotoPosX, setTempBannerPhotoPosX] = useState(settings.bannerPhotoPosX ?? 100);
  const [tempBannerPhotoPosY, setTempBannerPhotoPosY] = useState(settings.bannerPhotoPosY ?? 100);
  const [tempBannerPhotoSizeOption, setTempBannerPhotoSizeOption] = useState(settings.bannerPhotoSizeOption || "cover");
  const [tempBannerPhotoScale, setTempBannerPhotoScale] = useState(settings.bannerPhotoScale ?? 100);

  // State to manage the mini preview popup visibility
  const [showPreviewPopup, setShowPreviewPopup] = useState(true);

  // Draggable offset coordinate state for the real-time preview pop-up
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const previewOffsetRef = React.useRef({ x: 0, y: 0 });

  const handlePreviewMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Exclude button clicks, sliders, and inputs
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    setIsDraggingPreview(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    previewOffsetRef.current = { x: previewPos.x, y: previewPos.y };
  };

  const handlePreviewMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDraggingPreview) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPreviewPos({
      x: previewOffsetRef.current.x + dx,
      y: previewOffsetRef.current.y + dy,
    });
  }, [isDraggingPreview]);

  const handlePreviewMouseUp = React.useCallback(() => {
    setIsDraggingPreview(false);
  }, []);

  const handlePreviewTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    const touch = e.touches[0];
    setIsDraggingPreview(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    previewOffsetRef.current = { x: previewPos.x, y: previewPos.y };
  };

  const handlePreviewTouchMove = React.useCallback((e: TouchEvent) => {
    if (!isDraggingPreview) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setPreviewPos({
      x: previewOffsetRef.current.x + dx,
      y: previewOffsetRef.current.y + dy,
    });
  }, [isDraggingPreview]);

  const handlePreviewTouchEnd = React.useCallback(() => {
    setIsDraggingPreview(false);
  }, []);

  useEffect(() => {
    if (isDraggingPreview) {
      document.addEventListener('mousemove', handlePreviewMouseMove);
      document.addEventListener('mouseup', handlePreviewMouseUp);
      document.addEventListener('touchmove', handlePreviewTouchMove, { passive: false });
      document.addEventListener('touchend', handlePreviewTouchEnd);
    } else {
      document.removeEventListener('mousemove', handlePreviewMouseMove);
      document.removeEventListener('mouseup', handlePreviewMouseUp);
      document.removeEventListener('touchmove', handlePreviewTouchMove);
      document.removeEventListener('touchend', handlePreviewTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handlePreviewMouseMove);
      document.removeEventListener('mouseup', handlePreviewMouseUp);
      document.removeEventListener('touchmove', handlePreviewTouchMove);
      document.removeEventListener('touchend', handlePreviewTouchEnd);
    };
  }, [isDraggingPreview, handlePreviewMouseMove, handlePreviewMouseUp, handlePreviewTouchMove, handlePreviewTouchEnd]);

  // Articles manager state
  const [activeTab, setActiveTab] = useState<'settings' | 'articles' | 'partners'>('settings');
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

  // Partners/Insurers manager state
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerLogoUrl, setPartnerLogoUrl] = useState('');
  const [partnerLogoImageMode, setPartnerLogoImageMode] = useState<'url' | 'upload'>('url');
  const [partnerSaveSuccess, setPartnerSaveSuccess] = useState(false);

  // Notification feedbacks
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track Auth state changes securely on boot
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Update form values with Settings Context changes
  useEffect(() => {
    setTempWhatsApp(settings.brokerWhatsApp);
    setTempEmail(settings.email);
    setTempAddress(settings.address);
    setTempPhone(settings.phone);
    setTempSusep(settings.susepNumber);
    setTempCnpj(settings.cnpj);
    setTempBannerImageUrl(settings.bannerImageUrl || "https://i.postimg.cc/MTGLG7xz/Familia-feliz-sentado-em-sofa-202606071250.jpg");
    setTempBannerPaddingTop(settings.bannerPaddingTop ?? 80);
    setTempBannerPaddingBottom(settings.bannerPaddingBottom ?? 56);
    setTempBannerGradientLength(settings.bannerGradientLength ?? 42);
    setTempBannerPhotoPosX(settings.bannerPhotoPosX ?? 100);
    setTempBannerPhotoPosY(settings.bannerPhotoPosY ?? 100);
    setTempBannerPhotoSizeOption(settings.bannerPhotoSizeOption || "cover");
    setTempBannerPhotoScale(settings.bannerPhotoScale ?? 100);
  }, [settings]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setAuthSuccess('Autenticação realizada com sucesso!');
      } else if (authMode === 'register') {
        if (password.length < 6) {
          setAuthError('A senha precisa ter no mínimo 6 caracteres.');
          return;
        }
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        setAuthSuccess('Conta criada e logada com sucesso!');
      } else if (authMode === 'forgot') {
        const actionCodeSettings = {
          // Dynamic redirect to the accurate origin (whether local, preview URL or custom domain like safeone.com)
          url: window.location.origin + (window.location.pathname.startsWith('/adm') ? '/adm' : '/#/adm'),
          handleCodeInApp: false,
        };
        await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
        setAuthSuccess('Link de recuperação enviado com sucesso para o e-mail informado com o redirecionador exclusivo do SafeOne!');
      }
    } catch (err: any) {
      console.error(err);
      let translateError = 'Ocorreu um erro ao processar. Tente novamente.';
      if (err.code === 'auth/user-not-found') {
        translateError = 'E-mail não encontrado na base de dados.';
      } else if (err.code === 'auth/wrong-password') {
        translateError = 'Senha incorreta. Tente novamente.';
      } else if (err.code === 'auth/invalid-email') {
        translateError = 'E-mail inválido.';
      } else if (err.code === 'auth/email-already-in-use') {
        translateError = 'Este e-mail já está cadastrado.';
      } else if (err.code === 'auth/weak-password') {
        translateError = 'A senha informada é considerada fraca pela segurança do Firebase.';
      }
      setAuthError(translateError);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthSuccess('Sessão encerrada.');
    } catch (err) {
      console.error(err);
    }
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
      bannerImageUrl: tempBannerImageUrl,
      bannerPaddingTop: Number(tempBannerPaddingTop),
      bannerPaddingBottom: Number(tempBannerPaddingBottom),
      bannerGradientLength: Number(tempBannerGradientLength),
      bannerPhotoPosX: Number(tempBannerPhotoPosX),
      bannerPhotoPosY: Number(tempBannerPhotoPosY),
      bannerPhotoSizeOption: tempBannerPhotoSizeOption,
      bannerPhotoScale: Number(tempBannerPhotoScale),
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
    }).replace('.', '');

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
        alert("A imagem selecionada é muito grande! Escolha um arquivo menor de até 2MB.");
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

  const handlePartnerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem de logo selecionada é muito grande! Escolha um arquivo menor de até 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPartnerLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePartnerClick = () => {
    setEditingPartnerId(null);
    setPartnerName('');
    setPartnerLogoUrl('');
    setPartnerLogoImageMode('url');
    setIsPartnerFormOpen(true);
  };

  const handleEditPartnerClick = (partner: Partner) => {
    setEditingPartnerId(partner.id);
    setPartnerName(partner.name);
    setPartnerLogoUrl(partner.logoUrl);
    setPartnerLogoImageMode(partner.logoUrl.startsWith('data:') ? 'upload' : 'url');
    setIsPartnerFormOpen(true);
  };

  const handleDeletePartnerClick = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o parceiro "${name}"?`)) {
      deletePartner(id);
    }
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) {
      alert("Por favor, preencha o nome do parceiro.");
      return;
    }
    if (!partnerLogoUrl.trim()) {
      alert("Por favor, insira o link da logo ou selecione uma imagem para upload.");
      return;
    }

    const partnerPayload = {
      name: partnerName.trim(),
      logoUrl: partnerLogoUrl.trim()
    };

    if (editingPartnerId) {
      await updatePartner(editingPartnerId, partnerPayload);
    } else {
      await addPartner(partnerPayload);
    }

    setIsPartnerFormOpen(false);
    setEditingPartnerId(null);
    setPartnerName('');
    setPartnerLogoUrl('');
    triggerSuccessFeedback();
  };

  const handleRestorePartnersDefault = async () => {
    if (window.confirm("Essa ação restaurará a lista de seguradoras padrão de fábrica (substituindo edições e parceiros extras). Deseja prosseguir?")) {
      await resetPartners();
      setIsPartnerFormOpen(false);
      setEditingPartnerId(null);
      triggerSuccessFeedback();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020b18] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-xs text-slate-400 font-mono">Carregando credenciais seguras...</p>
      </div>
    );
  }

  // Gated Access: Show Authentication screen styled in Rich Dark Blue (tudo em azul escuro)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#020b18] flex flex-col items-center justify-center p-4 text-white font-sans relative overflow-hidden">
        {/* Ambient aesthetic light source */}
        <div className="absolute -top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-900/40 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative w-full max-w-md rounded-2xl border border-indigo-950/60 bg-[#061225] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-6 w-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-white flex items-center justify-center gap-1.5 justify-center">
                <span>SafeOne Seguros</span>
              </h2>
              <p className="text-xs text-indigo-400/80 font-medium tracking-wide mt-1">
                {authMode === 'login' && 'Acesso Administrativo Restrito'}
                {authMode === 'register' && 'Novo Registro de Administrador'}
                {authMode === 'forgot' && 'Recuperação de Acesso'}
              </p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {authError && (
              <div className="p-3.5 rounded-xl border border-red-500/15 bg-red-500/10 text-red-400 text-xs font-medium leading-relaxed">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold leading-relaxed">
                {authSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  id="auth-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@safeone.com"
                  className="w-full rounded-xl border border-indigo-950 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="auth-pass" className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                    Senha de Acesso
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold bg-transparent border-none p-0 cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    id="auth-pass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-indigo-950 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 px-4 py-3.5 text-xs font-bold text-white shadow-xl hover:shadow-indigo-950/50 hover:scale-[1.01] active:scale-95 transition-all text-center cursor-pointer border border-indigo-500/20"
            >
              <span>
                {authMode === 'login' && 'Entrar no Painel'}
                {authMode === 'register' && 'Cadastrar Administrador'}
                {authMode === 'forgot' && 'Enviar redifinição de senha'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>

          </form>

          {/* Separation Footer inside card */}
          <div className="border-t border-indigo-950/60 pt-4 flex flex-col items-center gap-2.5 text-[11px] text-slate-400">
            {authMode === 'login' && (
              <p>
                Não possui conta administrativa?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold bg-transparent border-none p-0 cursor-pointer"
                >
                  Cadastre-se aqui
                </button>
              </p>
            )}

            {authMode === 'register' && (
              <p>
                Já possui uma conta ativa?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold bg-transparent border-none p-0 cursor-pointer"
                >
                  Entre aqui
                </button>
              </p>
            )}

            {authMode === 'forgot' && (
              <p>
                Lembrou seus dados?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-indigo-400 hover:text-indigo-300 font-bold bg-transparent border-none p-0 cursor-pointer"
                >
                  Voltar para o Login
                </button>
              </p>
            )}

            <a
              href="/"
              className="text-[10px] text-indigo-400/60 hover:text-indigo-400 flex items-center gap-1 mt-1 transition-all underline font-medium"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Voltar para o site público</span>
            </a>
          </div>

        </div>
      </div>
    );
  }

  // Immersive Dashboard view for Logged in Administrator - All in Dark Blue Theme
  return (
    <div className="min-h-screen bg-[#020b18] text-white font-sans pb-12 relative overflow-hidden">
      
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/20 blur-3xl pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="bg-[#051124] border-b border-indigo-950/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-5.5 w-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-extrabold tracking-wider leading-none text-white">
                  SAFEONE
                </span>
                <span className="bg-indigo-500/10 text-indigo-300 font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest leading-none">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-450 mt-1">Conectado como: <span className="font-mono text-indigo-300">{user.email}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-[#03152d] border border-indigo-950 text-xs font-bold text-slate-350 hover:text-white transition-all text-center"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ver Site Público</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-900/30 text-xs font-bold text-red-300 hover:text-white transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Panel Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="grid gap-6 md:grid-cols-4 items-start">
          
          {/* Navigation Sidebar Tabs */}
          <div className="md:col-span-1 rounded-2xl bg-[#051329] border border-indigo-950/60 p-4 space-y-2">
            <h3 className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase px-3 mb-3">Módulos Administrativos</h3>
            
            <button
              type="button"
              onClick={() => { setActiveTab('settings'); setIsFormOpen(false); }}
              className={`w-full px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center gap-3 cursor-pointer text-left border ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-indigo-700 to-indigo-800 text-white border-indigo-500/20 shadow-xl'
                  : 'text-slate-400 hover:text-white hover:bg-[#081b37] border-transparent'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Configurações Gerais</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('articles'); setIsPartnerFormOpen(false); }}
              className={`w-full px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center gap-3 cursor-pointer text-left border ${
                activeTab === 'articles'
                  ? 'bg-gradient-to-r from-indigo-700 to-indigo-800 text-white border-indigo-500/20 shadow-xl'
                  : 'text-slate-400 hover:text-white hover:bg-[#081b37] border-transparent'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Gerenciar Artigos</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('partners'); setIsPartnerFormOpen(false); }}
              className={`w-full px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center gap-3 cursor-pointer text-left border ${
                activeTab === 'partners'
                  ? 'bg-gradient-to-r from-indigo-700 to-indigo-800 text-white border-indigo-500/20 shadow-xl'
                  : 'text-slate-400 hover:text-white hover:bg-[#081b37] border-transparent'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Parceiros / Seguradoras</span>
            </button>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15 text-[10px] font-bold tracking-wide animate-pulse flex items-center gap-1.5 mt-4">
                <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Salvo e sincronizado no Firebase</span>
              </div>
            )}
          </div>

          {/* Form Content / Grid Tabs */}
          <div className="md:col-span-3 rounded-2xl bg-[#051329] border border-indigo-950/60 p-6 sm:p-8">
            
            {/* Tab 1: General Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                <div className="border-b border-indigo-950/60 pb-3">
                  <h3 className="font-display text-base font-extrabold text-white tracking-tight">Configurações Gerais da Corretora</h3>
                  <p className="text-[11px] text-indigo-400 mt-1">Esses dados são públicos, exceto o WhatsApp do corretor que recebe orçamentos privados.</p>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-indigo-950/40 space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Canais de Atendimento</h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        WhatsApp do Corretor / Leads (Ex: 5577981008782)
                      </label>
                      <input
                        type="text"
                        value={tempWhatsApp}
                        onChange={(e) => setTempWhatsApp(e.target.value)}
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                        required
                      />
                      <span className="block text-[9px] text-[#dfb448] mt-1.5 font-medium leading-normal">
                        ★ Este número é estritamente PRIVADO. Somente corretores logados acessam aqui. Ele recebe todos os direcionamentos do simulador!
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        Telefone Exibido (Atendimento Público)
                      </label>
                      <input
                        type="text"
                        value={tempPhone}
                        onChange={(e) => setTempPhone(e.target.value)}
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                      E-mail Oficial SafeOne
                    </label>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                      Endereço Corporativo (Rodapé)
                    </label>
                    <input
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-indigo-950/40 space-y-4">
                  <h4 className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Parâmetros Regulatórios SUSEP</h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        Habilitação SUSEP
                      </label>
                      <input
                        type="text"
                        value={tempSusep}
                        onChange={(e) => setTempSusep(e.target.value)}
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        CNPJ SafeOne
                      </label>
                      <input
                        type="text"
                        value={tempCnpj}
                        onChange={(e) => setTempCnpj(e.target.value)}
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* PARTE DE CUSTOMIZAÇÃO DO BANNER PRINCIPAL */}
                <div className="bg-slate-950/40 p-5 rounded-xl border border-indigo-950/40 space-y-5">
                  <div className="flex items-center justify-between border-b border-indigo-950/60 pb-2">
                    <h4 className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Design e Estética do Banner Principal</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowPreviewPopup(!showPreviewPopup)}
                      className="text-[10px] underline font-mono text-amber-500 hover:text-amber-400 cursor-pointer bg-transparent border-none font-bold"
                    >
                      {showPreviewPopup ? "✓ Prévia Pop-up Ativa" : "Mostrar Prévia Pop-up"}
                    </button>
                  </div>

                  {/* Banner Image URL and File Upload */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                      Imagem de Fundo do Banner (URL ou Enviar Foto Local)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={tempBannerImageUrl}
                        onChange={(e) => setTempBannerImageUrl(e.target.value)}
                        placeholder="https://exemplo.com/imagem.png"
                        className="flex-1 rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                      />
                      
                      {/* Upload button */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 1.2 * 1024 * 1024) {
                                alert("A imagem selecionada excede 1.2MB. Use arquivos menores para otimizar os tempos de salvamento local no Firestore!");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setTempBannerImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="banner-upload"
                        />
                        <label
                          htmlFor="banner-upload"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-xs font-bold text-indigo-200 hover:text-white transition-all cursor-pointer whitespace-nowrap h-full justify-center"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Mudar Foto</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Slider Controls group divided into two grids */}
                  <div className="grid gap-6 sm:grid-cols-2 pt-1">
                    
                    {/* Col 1: Spacing and Gradient (Comprimento) */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                            Altura Superior (Padding Top)
                          </label>
                          <span className="font-mono text-[10px] text-indigo-400 font-bold">{tempBannerPaddingTop}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="240"
                          step="5"
                          value={tempBannerPaddingTop}
                          onChange={(e) => setTempBannerPaddingTop(Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Espaçamento interno superior (redimensiona o banner para cima)</span>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                            Altura Inferior (Padding Bottom)
                          </label>
                          <span className="font-mono text-[10px] text-indigo-400 font-bold">{tempBannerPaddingBottom}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="240"
                          step="5"
                          value={tempBannerPaddingBottom}
                          onChange={(e) => setTempBannerPaddingBottom(Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Espaçamento interno inferior (redimensiona o banner para baixo)</span>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                            Comprimento Cores / Gradiente Mid
                          </label>
                          <span className="font-mono text-[10px] text-indigo-400 font-bold">{tempBannerGradientLength}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={tempBannerGradientLength}
                          onChange={(e) => setTempBannerGradientLength(Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-955 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Controla a área de tonalidade escura que preserva a legibilidade textual</span>
                      </div>
                    </div>

                    {/* Col 2: Photo Position & Scaling */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                            Mover Foto - Eixo X (Horizontal)
                          </label>
                          <span className="font-mono text-[10px] text-indigo-400 font-bold">{tempBannerPhotoPosX}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tempBannerPhotoPosX}
                          onChange={(e) => setTempBannerPhotoPosX(Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Ajusta o alinhamento horizontal (esquerda ou direita)</span>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-bold text-slate-350 uppercase tracking-wider">
                            Mover Foto - Eixo Y (Vertical)
                          </label>
                          <span className="font-mono text-[10px] text-indigo-400 font-bold">{tempBannerPhotoPosY}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={tempBannerPhotoPosY}
                          onChange={(e) => setTempBannerPhotoPosY(Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-955 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-[9px] text-slate-400 block mt-0.5">Ajusta o alinhamento vertical (para cima ou para baixo)</span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-2">
                          Dimensionar Imagem (Escala)
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setTempBannerPhotoSizeOption('cover')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              tempBannerPhotoSizeOption === 'cover'
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-950 border-indigo-950/60 text-slate-400 hover:text-white'
                            }`}
                          >
                            Preencher área (Cover)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTempBannerPhotoSizeOption('custom')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              tempBannerPhotoSizeOption === 'custom'
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-950 border-indigo-950/60 text-slate-400 hover:text-white'
                            }`}
                          >
                            Editar Proporção
                          </button>
                        </div>

                        {tempBannerPhotoSizeOption === 'custom' && (
                          <div className="space-y-1 mt-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-slate-400 font-mono">Zoom da Imagem:</span>
                              <span className="font-mono text-[10px] text-indigo-400 font-bold">{tempBannerPhotoScale}%</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={tempBannerPhotoScale}
                              onChange={(e) => setTempBannerPhotoScale(Number(e.target.value))}
                              className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRestoreSettings}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-indigo-950 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Valores Originais</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-900/30 cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Salvar e Atualizar Firebase</span>
                  </button>
                </div>

              </form>
            )}

            {/* Tab 2: Articles Manager */}
            {activeTab === 'articles' && (
              <div className="space-y-4">
                
                {!isFormOpen ? (
                  <div className="space-y-6 animate-[#021025]">
                    
                    <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-950/40 p-4 rounded-xl border border-indigo-950/50">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">Biblioteca de Dicas & Notícias</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Sincronizado automaticamente com o banco de dados principal do Firestore.</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleRestoreArticlesDefault}
                          className="bg-transparent border border-indigo-950 hover:bg-slate-950 text-slate-400 hover:text-white px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all font-bold"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Padrão Fábrica</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleOpenNewArticleForm}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Nova Matéria</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {articles.map((art) => (
                        <div 
                          key={art.id} 
                          className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-indigo-950 bg-slate-950/40 hover:border-indigo-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            
                            <div className="hidden sm:block h-12 w-12 rounded-lg bg-slate-900 flex-shrink-0 overflow-hidden border border-indigo-950">
                              {art.image ? (
                                <img 
                                  src={art.image} 
                                  alt="" 
                                  className="h-full w-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="h-full w-full bg-[#0a1b32] flex items-center justify-center text-[8px] text-indigo-400 font-bold uppercase text-center p-0.5">
                                  Texto
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[9px] font-extrabold uppercase mb-1">
                                {art.category}
                              </span>
                              <h5 className="font-display text-[12px] font-extrabold text-white leading-tight truncate group-hover:text-indigo-400 transition-colors">
                                {art.title}
                              </h5>
                              <div className="flex gap-2 text-[9px] text-slate-450 mt-1 font-mono items-center">
                                <span className="flex items-center gap-0.5"><Calendar className="h-2.5 w-2.5" /> {art.date}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> {art.readTime}</span>
                              </div>
                            </div>

                          </div>

                          <div className="flex gap-2 ml-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditArticleClick(art)}
                              className="h-8 w-8 rounded-lg bg-[#07172f] border border-indigo-950 hover:border-indigo-500/40 text-slate-350 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Editar postagem"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteArticleClick(art.id, art.title)}
                              className="h-8 w-8 rounded-lg bg-[#07172f] border border-indigo-950 hover:border-red-500/40 text-slate-355 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                              title="Deletar postagem"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                        </div>
                      ))}

                      {articles.length === 0 && (
                        <div className="text-center py-12 bg-[#020d1c] rounded-xl border border-dashed border-indigo-950">
                          <FileText className="h-10 w-10 text-slate-605 mx-auto mb-2" />
                          <p className="text-xs text-slate-400">Nenhuma postagem criada.</p>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <form onSubmit={handleSaveArticle} className="space-y-4 bg-slate-950/40 p-5 rounded-xl border border-indigo-950/60 animate-fade-in text-xs">
                    
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#07172f] hover:bg-slate-900 border border-indigo-950 text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px] font-bold"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        <span>Voltar a Lista</span>
                      </button>
                      <h4 className="font-display font-black text-indigo-400 tracking-wide ml-2 uppercase text-xs">
                        {editingArticleId ? 'Editar Matéria no Firebase' : 'Inserir Nova Matéria'}
                      </h4>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Categoria da Matéria
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
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
                            Escreva Categoria Customizada
                          </label>
                          <input
                            type="text"
                            value={formCustomCategory}
                            onChange={(e) => setFormCustomCategory(e.target.value)}
                            placeholder="Ex: Previdência Privada"
                            className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        Título de Capa
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ex: Guia prático de capitais seguros..."
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        Breve Resumo (Introdução de listagem)
                      </label>
                      <textarea
                        value={formExcerpt}
                        onChange={(e) => setFormExcerpt(e.target.value)}
                        placeholder="Ex: Entenda os erros mais frequentes na hora de calibrar capitais de vida..."
                        rows={2}
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Data de Apresentação (Exibição)
                        </label>
                        <input
                          type="text"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          placeholder="Ex: 08 Jun, 2026"
                          className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Tempo para Leitura
                        </label>
                        <input
                          type="text"
                          value={formReadTime}
                          onChange={(e) => setFormReadTime(e.target.value)}
                          placeholder="Ex: 5 min de leitura"
                          className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-indigo-950/50 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                          Mídia / Ilustração do Artigo
                        </label>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 rounded-sm px-1.5 font-bold font-mono">Formato Imagem</span>
                      </div>

                      <div className="flex gap-2 bg-slate-950 p-1 border border-indigo-950 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setFormImageMode('url')}
                          className={`flex-1 py-1.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                            formImageMode === 'url' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Caminho/URL da Imagem
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setFormImageMode('upload')}
                          className={`flex-1 py-1.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                            formImageMode === 'upload' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Upload de Imagem Local (Base64)
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormImageMode('none')}
                          className={`flex-1 py-1.5 rounded text-[10px] font-extrabold cursor-pointer transition-all ${
                            formImageMode === 'none' ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Sem Imagem (Estilo Editorial)
                        </button>
                      </div>

                      {formImageMode === 'url' && (
                        <div className="space-y-1">
                          <input
                            type="url"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="Insira https://images.unsplash.com/..."
                            className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                          />
                        </div>
                      )}

                      {formImageMode === 'upload' && (
                        <div className="space-y-3">
                          <div className="border border-dashed border-indigo-950 rounded-xl p-3 flex flex-col items-center justify-center bg-slate-950/20">
                            {formImage ? (
                              <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-indigo-950">
                                <img src={formImage} alt="Upload preview" className="h-full w-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormImage('')}
                                  className="absolute top-1 right-1 h-5 w-5 bg-black/70 hover:bg-black rounded-full flex items-center justify-center"
                                >
                                  <X className="h-3 w-3 text-white" />
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center">
                                <Upload className="h-6 w-6 text-indigo-400 mb-1" />
                                <span className="text-[10px] text-indigo-300 font-bold">Clique para selecionar foto</span>
                                <span className="text-[8px] text-slate-500 mt-0.5">JPEG, PNG ou WEBP até 2MB</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                        Conteúdo da Matéria (Parágrafos)
                      </label>
                      <textarea
                        value={formContentText}
                        onChange={(e) => setFormContentText(e.target.value)}
                        placeholder="Desenvolva o texto da matéria neste campo.&#13;&#10;Para iniciar um novo parágrafo, dê um espaçamento com ENTER (quebra de linha)."
                        rows={10}
                        className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all font-sans leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-indigo-950 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-950/40 cursor-pointer"
                      >
                        Publicar Matéria
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

            {/* Tab 3: Partners/Insurers Manager */}
            {activeTab === 'partners' && (
              <div className="space-y-4">
                
                {!isPartnerFormOpen ? (
                  <div className="space-y-6">
                    
                    <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-950/40 p-4 rounded-xl border border-indigo-950/50">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">Parceiros & Seguradoras Cadastradas</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Defina as logomarcas que aparecem na home do seu site.</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleRestorePartnersDefault}
                          className="bg-transparent border border-indigo-950 hover:bg-slate-950 text-slate-400 hover:text-white px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all font-bold"
                          title="Restaurar de Fábrica"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Padrão Fábrica</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCreatePartnerClick}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 font-bold transition-all hover:scale-[1.01] cursor-pointer shadow-md shadow-indigo-950/40"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Novo Parceiro</span>
                        </button>
                      </div>
                    </div>

                    {/* Partners Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {partners && partners.map((partner) => (
                        <div 
                          key={partner.id} 
                          className="rounded-xl border border-indigo-950/40 bg-[#061225] p-4 flex flex-col justify-between hover:border-indigo-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Logo Display */}
                            <div className="h-10 w-16 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-indigo-950/20 shadow-inner">
                              {partner.isDefault ? (
                                <span className="text-[7.5px] font-extrabold text-slate-900 tracking-tighter text-center leading-tight uppercase font-mono bg-indigo-50 px-1 py-0.5 rounded">
                                  Default<br />Vetor
                                </span>
                              ) : (
                                <img 
                                  src={partner.logoUrl} 
                                  alt={partner.name} 
                                  className="h-full w-full object-contain filter hover:brightness-110" 
                                  referrerPolicy="no-referrer"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h5 className="font-sans font-bold text-xs text-white truncate leading-tight">{partner.name}</h5>
                              <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase tracking-wider">
                                {partner.isDefault ? '• Vetorial (Fixo)' : '• Upload Customizado'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-indigo-950/30">
                            <button
                              type="button"
                              onClick={() => handleEditPartnerClick(partner)}
                              className="p-1.5 rounded-lg border border-indigo-950 hover:border-indigo-800 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                              title="Editar Parceiro"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleDeletePartnerClick(partner.id, partner.name)}
                              className="p-1.5 rounded-lg border border-red-950/50 hover:border-red-950 hover:bg-red-950/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Excluir do Site"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  // Add/Edit Partner Form view
                  <form onSubmit={handleSavePartner} className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-indigo-950/60 pb-3">
                      <div>
                        <h4 className="font-display font-black text-white text-sm">
                          {editingPartnerId ? 'Editar Parceiro / Seguradora' : 'Cadastrar Novo Parceiro'}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Configure a marca e o carregamento do logo oficial da seguradora.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setIsPartnerFormOpen(false)}
                        className="text-slate-400 hover:text-white p-1 hover:bg-indigo-950 rounded transition-all cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Nome do Parceiro (Ex: Porto Seguro, SulAmérica)
                        </label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          placeholder="Ex: Bradesco Seguros"
                          className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                          required
                        />
                      </div>

                      {/* Image mode switcher */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                          Formato de Envio do Logotipo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { setPartnerLogoImageMode('url'); setPartnerLogoUrl(''); }}
                            className={`px-3 py-2.5 rounded-xl border text-[10px] uppercase font-mono font-bold tracking-wider transition-all cursor-pointer text-center ${
                              partnerLogoImageMode === 'url'
                                ? 'bg-[#081b37] border-indigo-500/50 text-white'
                                : 'border-indigo-950 text-slate-500 hover:text-slate-350'
                            }`}
                          >
                            Link Externo (URL)
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => { setPartnerLogoImageMode('upload'); setPartnerLogoUrl(''); }}
                            className={`px-3 py-2.5 rounded-xl border text-[10px] uppercase font-mono font-bold tracking-wider transition-all cursor-pointer text-center ${
                              partnerLogoImageMode === 'upload'
                                ? 'bg-[#081b37] border-indigo-500/50 text-white'
                                : 'border-indigo-950 text-slate-500 hover:text-slate-350'
                            }`}
                          >
                            Fazer Upload de Imagem
                          </button>
                        </div>
                      </div>

                      {partnerLogoImageMode === 'url' ? (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-350 uppercase tracking-wider mb-1.5">
                            Endereço URL da Imagem (Link Direto)
                          </label>
                          <input
                            type="url"
                            value={partnerLogoUrl}
                            onChange={(e) => setPartnerLogoUrl(e.target.value)}
                            placeholder="https://exemplo.com/logomarca.png"
                            className="w-full rounded-xl border border-indigo-950 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="border border-dashed border-indigo-950 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-950/20">
                            {partnerLogoUrl ? (
                              <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-indigo-950 bg-white p-2 flex items-center justify-center">
                                <img src={partnerLogoUrl} alt="Logo upload preview" className="max-h-full max-w-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => setPartnerLogoUrl('')}
                                  className="absolute top-1 right-1 h-5 w-5 bg-black/70 hover:bg-black rounded-full flex items-center justify-center focus:outline-none"
                                >
                                  <X className="h-3 w-3 text-white" />
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center">
                                <Upload className="h-6 w-6 text-indigo-400 mb-2" />
                                <span className="text-[10px] text-indigo-300 font-bold">Clique para selecionar logotipo</span>
                                <span className="text-[8px] text-slate-500 mt-0.5">Imagens PNG transparentes de tamanho menor operam melhor! Máximo 2MB.</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePartnerFileUpload}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-indigo-950/30">
                      <button
                        type="button"
                        onClick={() => setIsPartnerFormOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-indigo-950 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-950/40 cursor-pointer"
                      >
                        {editingPartnerId ? 'Salvar Alterações' : 'Adicionar Parceiro'}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

          </div>

        </div>

      </main>

      {/* PREVISÃO EM TEMPO REAL FLUTUANTE (MINI POP-UP) */}
      {activeTab === 'settings' && showPreviewPopup && (
        <div 
          className={`fixed bottom-4 right-4 z-50 w-80 sm:w-96 rounded-2xl bg-[#061225] border border-indigo-500/20 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[360px] md:max-h-[420px] select-none ${isDraggingPreview ? 'ring-1 ring-indigo-500/55 shadow-indigo-950/80 scale-[1.01]' : ''}`}
          style={{ 
            transform: `translate(${previewPos.x}px, ${previewPos.y}px)`,
            touchAction: 'none',
            transition: isDraggingPreview ? 'none' : 'transform 0.1s ease-out, scale 0.15s ease-out'
          }}
        >
          {/* Panel Header (Acts as the drag handler handle) */}
          <div 
            onMouseDown={handlePreviewMouseDown}
            onTouchStart={handlePreviewTouchStart}
            className="flex items-center justify-between px-4 py-2.5 border-b border-indigo-950 bg-[#051124] text-white select-none active:bg-[#071730]"
            style={{ cursor: isDraggingPreview ? 'grabbing' : 'grab' }}
            title="Clique e arraste para mover o pop-up"
          >
            <div className="flex items-center gap-2">
              {/* Premium Dotted Grid Handle Accent */}
              <div className="flex flex-col gap-0.5 opacity-55 hover:opacity-100 transition-opacity">
                <div className="flex gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-slate-350" />
                  <div className="h-1 w-1 rounded-full bg-slate-350" />
                  <div className="h-1 w-1 rounded-full bg-slate-350" />
                </div>
                <div className="flex gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-slate-350" />
                  <div className="h-1 w-1 rounded-full bg-slate-350" />
                  <div className="h-1 w-1 rounded-full bg-slate-350" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                <span className="text-xs font-bold font-sans tracking-wide">Prévia em Tempo Real (Banner)</span>
              </div>
            </div>
            <button
              onClick={() => setShowPreviewPopup(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-indigo-950/40 rounded transition-all cursor-pointer"
              title="Ocultar Prévia"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Miniature Banner Canvas Container */}
          <div className="p-4 bg-slate-950 flex-1 overflow-auto">
            <div 
              className="w-full rounded-xl border border-indigo-950/40 relative overflow-hidden bg-[#051124] text-white bg-no-repeat"
              style={{
                backgroundImage: `url("${tempBannerImageUrl}")`,
                backgroundPosition: `${tempBannerPhotoPosX}% ${tempBannerPhotoPosY}%`,
                backgroundSize: tempBannerPhotoSizeOption === 'custom' ? `${tempBannerPhotoScale}%` : 'cover',
                // Scaled padding down to 35% of original to fit neatly inside the preview card
                paddingTop: `${Math.max(16, tempBannerPaddingTop * 0.35)}px`,
                paddingBottom: `${Math.max(16, tempBannerPaddingBottom * 0.35)}px`,
                transition: 'all 0.1s ease-out'
              }}
            >
              {/* Dynamic Gradient stop */}
              <div 
                className="absolute inset-0 z-10" 
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(5, 17, 36, 0.98) 0%, rgba(5, 17, 36, 0.92) 32%, rgba(5, 17, 36, 0.45) 55%, rgba(5, 17, 36, 0) 75%)`
                }}
              />

              {/* Scaled Text Overlay */}
              <div className="relative z-20 px-3 pl-4 max-w-[70%] text-left">
                <h5 className="font-sans text-[12px] sm:text-[14px] font-extrabold tracking-tight text-white leading-tight">
                  Sua família está <br />
                  preparada para <br />
                  o <span className="text-[#dfb448]">inesperado?</span>
                </h5>
                <p className="text-[7.5px] text-slate-300 leading-relaxed font-normal mt-1 max-w-[150px]">
                  O seguro de vida garante proteção financeira e tranquilidade para quem você ama.
                </p>

                <div className="flex gap-1.5 mt-2.5 items-center">
                  {/* Simulation button mock */}
                  <div className="rounded px-2 py-1 bg-[#c5912a] text-[6.5px] font-extrabold leading-none select-none text-white font-mono scale-90 origin-left">
                    Simule Agora
                  </div>
                  {/* WA outline check mock */}
                  <div className="rounded px-1.5 py-1 border border-white/20 bg-transparent text-[6.5px] text-slate-350 font-bold scale-90 origin-left leading-none uppercase">
                    WhatsApp
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual disclaimer */}
            <p className="text-[9px] text-[#dfb448] mt-2.5 text-center font-semibold font-mono flex items-center justify-center gap-1">
              <span>🫳 Segure no cabeçalho para arrastar e posicionar o pop-up!</span>
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
