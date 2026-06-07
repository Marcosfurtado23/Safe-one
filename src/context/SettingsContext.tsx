import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppSettings {
  brokerWhatsApp: string;
  email: string;
  address: string;
  phone: string;
  susepNumber: string;
  cnpj: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  brokerWhatsApp: '5577981008782',
  email: 'contato@safeoneseguros.com.br',
  address: 'Av. Brigadeiro Faria Lima, 2200 - São Paulo, SP',
  phone: '+55 (11) 4003-9821',
  susepNumber: '10.2045610',
  cnpj: '00.320.145/0001-99',
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('safeone_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error("Error reading settings from localStorage", e);
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('safeone_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('safeone_settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
