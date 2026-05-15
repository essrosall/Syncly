import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CreateModalProvider } from './contexts/CreateModalContext'
import { GlobalModalProvider } from './contexts/GlobalModalContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ToastProvider } from './contexts/ToastContext'
// Global modal is now rendered from inside GlobalModalProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CreateModalProvider>
      <GlobalModalProvider>
        <NotificationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NotificationProvider>
      </GlobalModalProvider>
    </CreateModalProvider>
  </StrictMode>,
)
