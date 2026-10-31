import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthContextProvider } from './contexts/auth-context'
import { queryClient } from './lib/query-client'
import { App } from './app'
import { AnimeListContextProvider } from './pages/dashboard/tabs/anime-list/anime-list-context'
import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AuthContextProvider>
      <AnimeListContextProvider
        children={
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster />
          </QueryClientProvider>
        }
      />
    </AuthContextProvider>
  </StrictMode>
)
