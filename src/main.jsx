import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/style/index.css'
import App from './App.jsx'
import { VisitorProvider } from './context/VisitorProvider.jsx'
import { AddressProvider } from './context/AddressProvider.jsx'
import PreferenceProvider from './context/PreferenceProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VisitorProvider>
      <AddressProvider>
        <PreferenceProvider>
          <App />
        </PreferenceProvider>
      </AddressProvider>
    </VisitorProvider>

  </StrictMode>,
)
