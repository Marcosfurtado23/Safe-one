import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Simulator from './components/Simulator';
import Articles from './components/Articles';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Footer from './components/Footer';
import WhatsappBubble from './components/WhatsappBubble';
import AiAssistant from './components/AiAssistant';
import { Phone } from 'lucide-react';
import { useSettings } from './context/SettingsContext';

export default function App() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const { settings } = useSettings();
  const brokerWhatsApp = settings.brokerWhatsApp; 
  const welcomeText = encodeURIComponent("Olá! Estou no site da SafeOne Seguros e gostaria de conversar com um corretor sobre os planos.");
  const waUrl = `https://wa.me/${brokerWhatsApp}?text=${welcomeText}`;
  
  // Format phone correctly for tel protocol
  const telNumberStr = settings.phone.replace(/[^\d+]/g, '');
  const phoneCallUrl = `tel:${telNumberStr}`;


  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-amber-500/20 antialiased pb-16 md:pb-0">
      
      {/* Corporate Styled Layout Components */}
      <Navbar onOpenSimulator={() => setIsSimulatorOpen(true)} />
      
      <main>
        <Hero onOpenSimulator={() => setIsSimulatorOpen(true)} />
        <Features onOpenSimulator={() => setIsSimulatorOpen(true)} />
        <Simulator isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
        <Articles />
        <Testimonials />
        <Faq />
      </main>

      <Footer />

      {/* Floating Interactive Widget */}
      <WhatsappBubble />
      <AiAssistant />

      {/* Sticky Mobile Lead Redirection footer matching the visual bottom block of the image */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden p-3 shadow-2xl flex gap-3">
        {/* Left Column Button: Falar pelo WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#c5912a] px-4 py-3.5 text-xs font-bold text-white shadow-md active:scale-95 transition-transform"
        >
          <img 
            src="https://i.postimg.cc/LsWKdQK2/file-00000000db98720e82af712d5976a7f5.png"
            alt="WhatsApp"
            className="h-5 w-5 object-contain"
            referrerPolicy="no-referrer"
          />
          <span>WhatsApp</span>
        </a>

        {/* Right Column Button: Ligar agora */}
        <a
          href={phoneCallUrl}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-3.5 text-xs font-bold text-slate-800 active:scale-95 transition-transform"
        >
          <Phone className="h-5 w-5 text-amber-600" />
          <span>Ligar agora</span>
        </a>
      </div>

    </div>
  );
}
