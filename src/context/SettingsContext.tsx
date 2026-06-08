import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface AppSettings {
  brokerWhatsApp: string;
  email: string;
  address: string;
  phone: string;
  susepNumber: string;
  cnpj: string;
  bannerImageUrl: string;
  bannerPaddingTop: number;
  bannerPaddingBottom: number;
  bannerGradientLength: number;
  bannerPhotoPosX: number;
  bannerPhotoPosY: number;
  bannerPhotoSizeOption: string;
  bannerPhotoScale: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  brokerWhatsApp: '5577981008782',
  email: 'contato@safeoneseguros.com.br',
  address: 'Av. Brigadeiro Faria Lima, 2200 - São Paulo, SP',
  phone: '+55 (11) 4003-9821',
  susepNumber: '10.2045610',
  cnpj: '00.320.145/0001-99',
  bannerImageUrl: 'https://i.postimg.cc/MTGLG7xz/Familia-feliz-sentado-em-sofa-202606071250.jpg',
  bannerPaddingTop: 80,
  bannerPaddingBottom: 56,
  bannerGradientLength: 42,
  bannerPhotoPosX: 100,
  bannerPhotoPosY: 100,
  bannerPhotoSizeOption: 'cover',
  bannerPhotoScale: 100,
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

  // Listen to Firestore real-time settings configuration document
  useEffect(() => {
    const configDocRef = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(configDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const firestoreData = snapshot.data() as AppSettings;
        const mergedSettings = { ...DEFAULT_SETTINGS, ...firestoreData };
        setSettings(mergedSettings);
        try {
          localStorage.setItem('safeone_settings', JSON.stringify(mergedSettings));
        } catch (e) {
          console.error("Error updating settings cache", e);
        }
      }
    }, (error) => {
      console.warn("Firestore settings lookup skipped (using cache/defaults):", error.message);
    });

    return () => unsubscribe();
  }, []);

  // When admin signs in, auto-seed the configuration if it's empty in Firestore
  useEffect(() => {
    const checkAndSeed = async () => {
      if (auth.currentUser) {
        try {
          const configDocRef = doc(db, 'settings', 'config');
          const snapshot = await getDoc(configDocRef);
          if (!snapshot.exists()) {
            await setDoc(configDocRef, settings);
            console.log("Firestore settings auto-seeded successfully");
          }
        } catch (e) {
          console.warn("Skipped checking settings seed on Firestore (auth state load delay)", e);
        }
      }
    };
    checkAndSeed();
  }, [settings]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem('safeone_settings', JSON.stringify(updated));
    } catch (e) {
      console.error("Error setting local storage cache", e);
    }

    // Sync to Firestore if signed in
    if (auth.currentUser) {
      try {
        const configDocRef = doc(db, 'settings', 'config');
        await setDoc(configDocRef, updated);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'settings/config');
      }
    }
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('safeone_settings');
    } catch (e) {
      console.error("Error removing local storage cache", e);
    }

    if (auth.currentUser) {
      try {
        const configDocRef = doc(db, 'settings', 'config');
        await setDoc(configDocRef, DEFAULT_SETTINGS);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'settings/config');
      }
    }
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

