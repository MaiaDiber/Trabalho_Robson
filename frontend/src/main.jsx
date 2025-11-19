import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Navegação from './routes'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navegação />
  </StrictMode>,
)
