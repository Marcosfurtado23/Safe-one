import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

let aiClient: any = null;

// Lazy initialize Gemini SDK client to prevent startup crash if key is missing
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_STANDALONE",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Client-side context response fallback when API key is not supplied
function getLocalFallbackResponse(message: string, context: any): string {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes('ola') || msg.includes('olá') || msg.includes('oi') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite') || msg.includes('como vai')) {
    return "Olá! Seja muito bem-vindo à SafeOne Seguros. Eu sou o seu consultor inteligente de proteção familiar. Como posso te apoiar hoje com suas dúvidas de seguro de vida ou planejamento financeiro?";
  }
  if (msg.includes('susep') || msg.includes('cnpj') || msg.includes('registro') || msg.includes('regulament')) {
    return `A SafeOne Corretora de Seguros Ltda. opera em total conformidade e regularidade jurídica. Nosso CNPJ é ${context?.cnpj || 'padrão'} e nosso número de habilitação oficial registrado perante a SUSEP é ${context?.susepNumber || 'padrão'}.`;
  }
  if (msg.includes('whatsapp') || msg.includes('falar') || msg.includes('contato') || msg.includes('telefone') || msg.includes('ligar') || msg.includes('corretor') || msg.includes('fale conosco')) {
    return `Com certeza! Você pode falar diretamente com nossos corretores especialistas a qualquer momento de forma simples:\n\n- WhatsApp Oficial: ${context?.brokerWhatsApp || 'cadastrado no site'}\n- Telefone Central: ${context?.phone || 'de atendimento'}\n- E-mail Corporativo: ${context?.email || 'de suporte'}\n\nAlém disso, clicando no botão flutuante verde do WhatsApp no canto da tela, você inicia um chat imediato com um especialista!`;
  }
  if (msg.includes('simula') || msg.includes('preço') || msg.includes('valor') || msg.includes('custo') || msg.includes('quanto custa') || msg.includes('orçamento')) {
    return "Para simular valores customizados de forma instantânea, você pode usar nosso Simulador Online que está integrado na nossa página principal. Nele, basta colocar sua idade, categoria profissional, e personalizar as coberturas desejadas (como Diária de Invalidez, Doenças Graves ou Morte) para ver a estimativa mensal exata na hora. É simples, gratuito e interativo!";
  }
  if (msg.includes('grave') || msg.includes('doença') || msg.includes('câncer') || msg.includes('cancer') || msg.includes('infarto') || msg.includes('avc') || msg.includes('derrame') || msg.includes('diagnostico')) {
    return "A cobertura de Doenças Graves da SafeOne foi criada para proteger suas reservas e patrimônio em vida. Ao receber diagnóstico confiável de doenças graves estipuladas na apólice (como neoplasias malignas, infarto do miocárdio ou AVC), o capital contratado é depositado diretamente em sua conta corrente em dinheiro. Você é totalmente livre para gastar o recurso em tratamentos de ponta, medicamentos importados ou suporte familiar.";
  }
  if (msg.includes('invalidez') || msg.includes('dit') || msg.includes('parar de trabalhar') || msg.includes('afastamento') || msg.includes('autonomo') || msg.includes('liberal')) {
    return "Nossa cobertura de Diária por Invalidez Temporária (DIT) é o pilar ideal para trabalhadores autônomos, profissionais liberais, médicos e dentistas. No caso de afastamento temporário decorrente de acidentes pessoais ou doenças cobertas, você recebe diárias financeiras para custear suas despesas fixas de casa ou escritório sem queimar suas economias.";
  }
  if (msg.includes('sucess') || msg.includes('inventario') || msg.includes('herança') || msg.includes('morte') || msg.includes('tributo') || msg.includes('imposto') || msg.includes('itcmd')) {
    return "O seguro de vida desempenha função vital no planejamento sucessório da sua família. Legalmente (conforme o Artigo 794 do Código Civil brasileiro), o capital segurado por morte não integra o inventário, é isento de impostos como o ITCMD e livre de eventuais dívidas anteriores. Isso significa liquidez imediata paga em até 30 dias para cobrir as pesadas despesas de custas judiciais e honorários advocatícios, evitando que os seus bens fiquem congelados.";
  }
  if (msg.includes('paginas') || msg.includes('páginas') || msg.includes('seções') || msg.includes('estrutura')) {
    return "Nosso site foi desenhado sob uma estrutura moderna de página única de alta fidelidade (SPA), dividida em seções estratégicas de fácil navegação:\n1. Início (Apresentação Principal)\n2. Soluções e Diferenciais (As Coberturas de Vida)\n3. Simulador de Prêmios Online Interativo\n4. Artigos de Apoio à Cuidado Familiar\n5. Depoimentos Reais de Clientes\n6. Painel de Perguntas Frequentes (FAQ)\n7. Painel Executivo Administrativo de Controle";
  }

  return "Sua segurança emocional e proteção patrimonial são prioridades absolutas na SafeOne Seguros. Eu entendo de todos os nossos produtos:\n\n- Seguro de Vida e Capital Protegido\n- Isenção de ITCMD e Planejamento Tributário / Sucessório\n- Cobertura em vida para Doenças Graves\n- Diárias de Afastamento (DIT)\n- Simulador Interativo Online\n\nDeseja realizar uma simulação no site ou prefere o contato direto de um de nossos consultores para desenhar sua proposta?";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "O campo message é obrigatório e deve ser uma string." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Handle gracefully using local heuristic fallback
        const offlineReply = getLocalFallbackResponse(message, context);
        return res.json({ text: offlineReply });
      }

      const ai = getGeminiClient();

      // Formulate detailed system directives for high-fidelity response and clean typography
      const systemInstruction = `Você é o assistente virtual da SafeOne Seguros, corretora de seguros de vida e planejadora de riscos financeiros.
Responda sempre em Português do Brasil (pt-BR).
Considere as seguintes informações e canais de contato reais que o usuário configurou no Painel:
- WhatsApp Leads de Contato: ${context?.brokerWhatsApp || 'Não informado'}
- Telefone Central: ${context?.phone || 'Não informado'}
- E-mail Corporativo: ${context?.email || 'Não informado'}
- SUSEP Número: ${context?.susepNumber || 'Não informado'}
- CNPJ: ${context?.cnpj || 'Não informado'}

INSTRUÇÕES CRÍTICAS DE ESTILO E FORMATO:
1. NUNCA utilize asteriscos (*) em suas respostas para simular negrito ou listas. Não utilize asteriscos sob hipótese alguma. Escreva cabeçalhos, títulos e listas com quebras de linha limpas e hífen (-) livre de formatação markdown com asteriscos.
2. Seja objetivo e prestativo. As perguntas devem ser respondidas de forma ágil, clara, acolhedora e prestativa.
3. Se o usuário quiser contratar, cotar ou falar com um humano, explique os produtos e aponte para as formas de contato reais como WhatsApp ou ligar, incentivando que fale conosco.
4. Esclareça sobre Proteção Familiar por Morte, Doenças Graves em vida (câncer, infarto, AVC pagos direto na conta), Invalidez Temporária (DIT para autônomos), Sucessão Legal (isenção legal de inventário e ITCMD nos termos do Art. 794), e o Simulador Interativo que permite ver preços estimados online.`;

      // Structure conversation history
      const formattedContents: any[] = [];
      if (history && Array.isArray(history)) {
        // Limit history size slightly for ultra-fast processing
        const recentHistory = history.slice(-8);
        recentHistory.forEach((item: any) => {
          formattedContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        });
      }

      // Add actual input message
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Invoke gemini-3.5-flash for maximum generation speed (under 1 second typically)
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6,
        }
      });

      let responseText = response.text || "Desculpe, não consegui obter a resposta no momento.";
      
      // Strict regex replacement to strip ALL random or programmatic asterisks as requested
      responseText = responseText.replace(/\*/g, "");

      res.json({ text: responseText });
    } catch (err: any) {
      console.error("Gemini route handling error:", err);
      // Fallback locally to avoid returning raw server crash errors to user UI
      try {
        const { message, context } = req.body;
        const backupReply = getLocalFallbackResponse(message, context);
        res.json({ text: backupReply });
      } catch {
        res.json({ text: "Olá! A SafeOne Seguros está à sua disposição. Como posso te apoiar com nossa gama de coberturas em vida ou proteção patrimonial sucessória?" });
      }
    }
  });

  // Vite middleware setup for Development vs Production build artifact delivery
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SafeOne Server] listening on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
