import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuthGate from './AuthGate.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      {(user, onLogout) => (
        <App userEmail={user.email ?? ''} onLogout={onLogout} />
      )}
    </AuthGate>
  </StrictMode>,
)
