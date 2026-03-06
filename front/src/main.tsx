import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap CSS
import './index.css'
import App3 from './App3.tsx'

// React alkalmazás elindítása
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App3 />
  </StrictMode>,
)
