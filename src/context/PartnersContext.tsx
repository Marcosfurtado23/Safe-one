import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  isDefault?: boolean;
}

export const DEFAULT_PARTNERS: Partner[] = [
  { id: 'porto-seguro', name: 'Porto Seguro', logoUrl: 'default_porto_seguro', isDefault: true },
  { id: 'tokio-marine', name: 'Tokio Marine', logoUrl: 'default_tokio_marine', isDefault: true },
  { id: 'allianz', name: 'Allianz', logoUrl: 'default_allianz', isDefault: true },
  { id: 'icatu', name: 'Icatu Seguros', logoUrl: 'default_icatu', isDefault: true },
  { id: 'mag', name: 'MAG Seguros', logoUrl: 'default_mag', isDefault: true },
  { id: 'prudential', name: 'Prudential do Brasil', logoUrl: 'default_prudential', isDefault: true }
];

interface PartnersContextType {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id' | 'isDefault'>) => Promise<void>;
  updatePartner: (id: string, updatedPartner: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  resetPartners: () => Promise<void>;
}

const PartnersContext = createContext<PartnersContextType | undefined>(undefined);

export function PartnersProvider({ children }: { children: React.ReactNode }) {
  const [partners, setPartners] = useState<Partner[]>(() => {
    try {
      const saved = localStorage.getItem('safeone_partners');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading partners from localStorage', e);
    }
    return DEFAULT_PARTNERS;
  });

  // Fetch partners from Firestore in real time
  useEffect(() => {
    const partnersColRef = collection(db, 'partners');
    const unsubscribe = onSnapshot(partnersColRef, (snapshot) => {
      if (!snapshot.empty) {
        const loadedPartners: Partner[] = [];
        snapshot.forEach((docSnap) => {
          loadedPartners.push(docSnap.data() as Partner);
        });
        setPartners(loadedPartners);
        try {
          localStorage.setItem('safeone_partners', JSON.stringify(loadedPartners));
        } catch (e) {
          console.error('Error caching partners to localStorage', e);
        }
      } else {
        // If snapshot is empty, let it stay loaded or fall back to default
        setPartners(DEFAULT_PARTNERS);
      }
    }, (error) => {
      console.warn("Firestore partners lookup skipped (using cache/defaults):", error.message);
    });

    return () => unsubscribe();
  }, []);

  // When admin logs in, seed the default partners list in Firestore if it is empty
  useEffect(() => {
    const seedPartners = async () => {
      if (auth.currentUser) {
        try {
          const partnersColRef = collection(db, 'partners');
          const snapshot = await getDocs(partnersColRef);
          if (snapshot.empty) {
            console.log("Seeding default partners into Firestore...");
            for (const item of DEFAULT_PARTNERS) {
              await setDoc(doc(db, 'partners', item.id), item);
            }
          }
        } catch (e) {
          console.warn("Skipped checking partners seed on Firestore (auth state load delay)", e);
        }
      }
    };
    seedPartners();
  }, []);

  const savePartnersCache = (newPartners: Partner[]) => {
    setPartners(newPartners);
    try {
      localStorage.setItem('safeone_partners', JSON.stringify(newPartners));
    } catch (e) {
      console.error('Error saving partners to localStorage', e);
    }
  };

  const addPartner = async (partnerData: Omit<Partner, 'id' | 'isDefault'>) => {
    const newId = `partner_${Date.now()}`;
    const newPartner: Partner = {
      id: newId,
      name: partnerData.name,
      logoUrl: partnerData.logoUrl,
      isDefault: false
    };

    const updated = [...partners, newPartner];
    savePartnersCache(updated);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'partners', newId), newPartner);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `partners/${newId}`);
      }
    }
  };

  const updatePartner = async (id: string, updatedFields: Partial<Partner>) => {
    const updated = partners.map((p) => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    savePartnersCache(updated);

    if (auth.currentUser) {
      try {
        const docRef = doc(db, 'partners', id);
        const targetPartner = updated.find((p) => p.id === id);
        if (targetPartner) {
          await setDoc(docRef, targetPartner);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `partners/${id}`);
      }
    }
  };

  const deletePartner = async (id: string) => {
    const updated = partners.filter((p) => p.id !== id);
    savePartnersCache(updated);

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'partners', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `partners/${id}`);
      }
    }
  };

  const resetPartners = async () => {
    savePartnersCache(DEFAULT_PARTNERS);

    if (auth.currentUser) {
      try {
        // Query to delete all documents in partners collection
        const partnersColRef = collection(db, 'partners');
        const snapshot = await getDocs(partnersColRef);
        for (const docSnap of snapshot.docs) {
          await deleteDoc(doc(db, 'partners', docSnap.id));
        }
        // Write the original defaults
        for (const item of DEFAULT_PARTNERS) {
          await setDoc(doc(db, 'partners', item.id), item);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, 'partners/reset');
      }
    }
  };

  return (
    <PartnersContext.Provider value={{ partners, addPartner, updatePartner, deletePartner, resetPartners }}>
      {children}
    </PartnersContext.Provider>
  );
}

export function usePartners() {
  const context = useContext(PartnersContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnersProvider');
  }
  return context;
}
