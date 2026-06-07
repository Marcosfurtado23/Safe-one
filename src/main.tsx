import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { ArticlesProvider } from './context/ArticlesContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ArticlesProvider>
        <App />
      </ArticlesProvider>
    </SettingsProvider>
  </StrictMode>,
);

