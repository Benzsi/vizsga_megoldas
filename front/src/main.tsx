import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap CSS
import './index.css'
import App3 from './App3.tsx'
import App4 from './App4-legjobb.tsx'

// React alkalmazás elindítása
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App4 />
  </StrictMode>,
)
