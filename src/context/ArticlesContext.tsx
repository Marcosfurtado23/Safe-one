import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image?: string; // Optional image URL or Base64 string
  content: string[]; // List of paragraphs
}

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'planejamento-familiar',
    category: 'Proteção Familiar',
    title: 'Guia do Futuro: Como calcular o capital seguro ideal para quem você ama',
    excerpt: 'Muitos erram ao contratar coberturas insuficientes ou excessivas. Descubra como calcular de forma simples o valor necessário para manter seu padrão familiar.',
    readTime: '6 min de leitura',
    date: '05 Jun, 2026',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
    content: [
      'Organizar a segurança financeira ideal para sua família não é sobre escolher valores aleatórios na apólice. É um processo racional e preventivo que garante estabilidade nos momentos mais desafiadores.',
      'O capital seguro ideal deve cobrir, no mínimo, três grandes necessidades básicas de sua família caso você não esteja presente:',
      '1. Quitação de Dívidas Ativas: Financiamentos de imóveis, empréstimos ou saldos pendentes que poderiam comprometer o orçamento dos seus herdeiros.',
      '2. Custo de Educação das Crianças: Custos escolares mensais estimados pelo período aproximado até que finalizem a graduação ou conquistem autonomia financeira.',
      '3. Custo de Sobrevivência Familiar: Uma reserva de renda mensal equivalente a pelo menos 3 a 5 anos dos gastos fixos da casa. Esse tempo é vital para dar paz de espírito e estabilidade emocional enquanto a família se reestrutura de forma segura.',
      'Com a SafeOne, você pode usar nosso simulador online e calibrar o capital exatamente sobre a sua realidade, de forma modular e inteligente.'
    ]
  },
  {
    id: 'doencas-graves-vida',
    category: 'Saúde em Vida',
    title: 'Diagnósticos e Tratamento: Como coberturas de Doenças Graves protegem suas reservas',
    excerpt: 'Diferente do que muitos pensam, o seguro moderno é feito para ser usado em vida. Conheça o funcionamento da antecipação de capital para tratamentos médicos de alta complexidade.',
    readTime: '5 min de leitura',
    date: '28 Mai, 2026',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    content: [
      'Um diagnóstico médico grave, como o de câncer, infarto agudo do miocárdio ou AVC, traz consigo um impacto emocional avassalador. Infelizmente, ele também vem acompanhado de um rombo financeiro inesperado.',
      'Medicamentos importados que não são subsidiados pelo plano de saúde, tratamentos complementares de alta qualidade e o próprio afastamento temporário das atividades de trabalho geram custos substanciais.',
      'A cobertura de Doenças Graves atua como um escudo financeiro. Ao comprovar o diagnóstico através de laudos médicos qualificados, o capital contratado é depositado diretamente na sua conta corrente em dinheiro.',
      'Livre de amarras administrativas, você escolhe como usar o recurso de forma irrestrita: pagando médicos particulares, cobrindo o faturamento corporativo perdido no período ou garantindo conforto à sua família.'
    ]
  },
  {
    id: 'sucessao-inventario',
    category: 'Sucessão Inteligente',
    title: 'Isenção Tributária: O papel estratégico do seguro de vida no planejamento sucessório',
    excerpt: 'O inventário no Brasil consome até 20% do patrimônio de uma família. Entenda por que o seguro é o instrumento mais prático de liquidez imediata livre de burocracias.',
    readTime: '7 min de leitura',
    date: '15 Mai, 2026',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    content: [
      'Quando alguém falece, todos os seus bens físicos e financeiros – incluindo saldos em contas bancárias – são bloqueados de forma sumária até o avanço e conclusão de processo de inventário judicial ou extrajudicial.',
      'Este rito de partilha custa caro, exigindo o pagamento de honorários de advogados, custas processuais e o pesado Imposto sobre Transmissão Causa Mortis e Doação (ITCMD), cuja alíquota chega a 8% em diversos estados.',
      'Neste cenário de liquidez zero, muitas famílias são induzidas a vender imóveis do espólio por valores abaixo do mercado para conseguir quitar os próprios tributos do processo.',
      'Aqui se destaca a isenção tributária: Segundo o artigo 794 do Código Civil brasileiro, o capital do seguro de vida não faz parte de herança. Portanto, não passa pelo processo de inventário, não responde por dívidas pretéritas e é pago de forma integral e líquida em até 30 dias após protocolo.',
      'É a proteção corporativa definitiva que evita o endividamento e preserva integralmente a dignidade do seu legado familiar.'
    ]
  }
];

interface ArticlesContextType {
  articles: Article[];
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, updatedArticle: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  resetArticles: () => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('safeone_articles');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading articles from localStorage', e);
    }
    return DEFAULT_ARTICLES;
  });

  // Fetch articles from Firestore in real time
  useEffect(() => {
    const articlesColRef = collection(db, 'articles');
    const unsubscribe = onSnapshot(articlesColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loadedArticles: Article[] = [];
        snapshot.forEach((docSnap) => {
          loadedArticles.push(docSnap.data() as Article);
        });
        // Sort from newest to oldest or keep ordering
        setArticles(loadedArticles);
        try {
          localStorage.setItem('safeone_articles', JSON.stringify(loadedArticles));
        } catch (e) {
          console.error('Error caching articles to localStorage', e);
        }
      }
    }, (error) => {
      console.warn("Firestore articles lookup skipped (using cache/defaults):", error.message);
    });

    return () => unsubscribe();
  }, []);

  // When admin logs in, seed the default articles list in Firestore if it is empty
  useEffect(() => {
    const seedArticles = async () => {
      if (auth.currentUser) {
        try {
          const articlesColRef = collection(db, 'articles');
          const snapshot = await getDocs(articlesColRef);
          if (snapshot.empty) {
            console.log("Seeding default articles into Firestore...");
            for (const item of DEFAULT_ARTICLES) {
              await setDoc(doc(db, 'articles', item.id), item);
            }
          }
        } catch (e) {
          console.warn("Skipped checking articles seed on Firestore (auth state load delay)", e);
        }
      }
    };
    seedArticles();
  }, []);

  const saveArticlesCache = (newArticles: Article[]) => {
    setArticles(newArticles);
    try {
      localStorage.setItem('safeone_articles', JSON.stringify(newArticles));
    } catch (e) {
      console.error('Error saving articles to localStorage', e);
    }
  };

  const addArticle = async (newArt: Omit<Article, 'id'>) => {
    const id = `article-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const freshArticle: Article = {
      ...newArt,
      id
    };
    const updated = [freshArticle, ...articles];
    saveArticlesCache(updated);

    // Sync to Firestore if signed in
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'articles', id), freshArticle);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `articles/${id}`);
      }
    }
  };

  const updateArticle = async (id: string, updatedFields: Partial<Article>) => {
    const updated = articles.map((art) => {
      if (art.id === id) {
        return { ...art, ...updatedFields };
      }
      return art;
    });
    saveArticlesCache(updated);

    // Sync to Firestore if signed in
    if (auth.currentUser) {
      try {
        const artDocRef = doc(db, 'articles', id);
        const existingDoc = await getDoc(artDocRef);
        if (existingDoc.exists()) {
          const merged = { ...existingDoc.data(), ...updatedFields } as Article;
          await setDoc(artDocRef, merged);
        } else {
          const localItem = articles.find(a => a.id === id);
          if (localItem) {
            await setDoc(artDocRef, { ...localItem, ...updatedFields });
          }
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `articles/${id}`);
      }
    }
  };

  const deleteArticle = async (id: string) => {
    const updated = articles.filter((art) => art.id !== id);
    saveArticlesCache(updated);

    // Sync to Firestore if signed in
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `articles/${id}`);
      }
    }
  };

  const resetArticles = async () => {
    saveArticlesCache(DEFAULT_ARTICLES);

    // Clean articles collection & reseed if admin
    if (auth.currentUser) {
      try {
        const articlesColRef = collection(db, 'articles');
        const snapshot = await getDocs(articlesColRef);
        for (const snapDoc of snapshot.docs) {
          await deleteDoc(doc(db, 'articles', snapDoc.id));
        }
        for (const item of DEFAULT_ARTICLES) {
          await setDoc(doc(db, 'articles', item.id), item);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'articles');
      }
    }
  };

  return (
    <ArticlesContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle, resetArticles }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
}
