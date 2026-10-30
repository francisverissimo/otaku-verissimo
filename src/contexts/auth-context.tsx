import { createContext, ReactNode, useCallback, useMemo, useState } from 'react'
import { TViewer } from '@/types/t-viewer'
import { clearStoredToken } from '@/auth/token'
import { clearStoredViewer } from '@/auth/viewer'

type TAuthContext = {
  user: TViewer | null | undefined
  signin: (user: TViewer | null) => void
  signout: () => void
}

export const AuthContext = createContext({} as TAuthContext)

type TAuthContextProviderProps = {
  children: ReactNode
}

export function AuthContextProvider({ children }: TAuthContextProviderProps) {
  const [user, setUser] = useState<TViewer | null | undefined>(undefined)

  const signin = useCallback((user: TViewer | null) => {
    setUser(user)
  }, [])

  const signout = useCallback(() => {
    clearStoredToken()
    clearStoredViewer()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, signin, signout }), [user, signin, signout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
