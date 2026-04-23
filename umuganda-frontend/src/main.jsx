import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './stores/store'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
