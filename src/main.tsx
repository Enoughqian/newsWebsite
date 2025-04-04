import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import AuthCheck from './AuthCheck';
import { ToastProvider } from './ToastContext';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense>
            <AuthCheck />
            <App />
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>
);
