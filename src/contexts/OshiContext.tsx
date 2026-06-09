import React, { createContext, useContext, ReactNode } from 'react';
import { useOshiStorage } from '../hooks/useOshiStorage';

type OshiStorageReturn = ReturnType<typeof useOshiStorage>;

const OshiContext = createContext<OshiStorageReturn | null>(null);

export const OshiProvider = ({ children }: { children: ReactNode }) => {
  const oshiStorage = useOshiStorage();

  return (
    <OshiContext.Provider value={oshiStorage}>
      {children}
    </OshiContext.Provider>
  );
};

export const useOshiContext = () => {
  const context = useContext(OshiContext);
  if (!context) {
    throw new Error('useOshiContext must be used within an OshiProvider');
  }
  return context;
};
