import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { SlashIDProvider } from '@slashid/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SlashIDProvider
      oid={import.meta.env.VITE_ROOT_ORG_ID}
      baseApiUrl='https://api.slashid.com'
      tokenStorage='localStorage'
    >
      <App />
    </SlashIDProvider>
  </React.StrictMode>,
)
