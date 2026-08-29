import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <ThemeProvider
      attribute={['class', 'data-color-mode']}
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
      themes={['light', 'dark']}
      storageKey="theme"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
);
