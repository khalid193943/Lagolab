import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Polices hébergées avec le site : plus rapide, aucune dépendance à Google Fonts */
import '@fontsource/sora/400.css';
import '@fontsource/sora/500.css';
import '@fontsource/sora/600.css';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/libre-baskerville/400.css';
import '@fontsource/libre-baskerville/700.css';
import '@fontsource/readex-pro/arabic-400.css';
import '@fontsource/readex-pro/arabic-500.css';
import '@fontsource/readex-pro/arabic-600.css';
import Site from './Site';
import './index.css';
createRoot(document.getElementById('root')!).render(<StrictMode><Site /></StrictMode>);
