import {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react'
import { api } from '../services/api'

interface AvatarDataProviderProps {
  children: ReactNode
}

interface AvatarQueryResponse {
  name: string
  clubId: number
  userId: {
    ['@ref']: {
      id: string
    }
  }
}

const AvatarDataContext = createContext({} as AvatarQueryResponse)

export function AvatarDataProvider({ children }: AvatarDataProviderProps) {
  const [avatarData, setAvatarData] = useState<AvatarQueryResponse>()

  useEffect(() => {
    // if (session?.isAvatarActive) {
    const getAvatarInfos = async () => {
      const response = await api.get('/api/avatar')
      setAvatarData(response.data.data.data)
    }
    getAvatarInfos()
    // }
  }, [])

  return (
    <AvatarDataContext.Provider value={avatarData}>
      {children}
    </AvatarDataContext.Provider>
  )
}

export const useAvatarData = () => useContext(AvatarDataContext)
