import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from '../services/api'

interface UnreadChatsProviderProps {
  children: ReactNode
}

type UnreadChats = Array<string> | []

interface UnreadChatsQueryResponse {
  unreadChats: UnreadChats
  updateUnreadChats: (unreadChats: UnreadChats) => void
}

const UnreadChatsContext = createContext({} as UnreadChatsQueryResponse)

export function UnreadChatsProvider({ children }: UnreadChatsProviderProps) {
  const [unreadChats, setUnreadChats] = useState<UnreadChats>([])

  useEffect(() => {
    const getUnreadChats = async () => {
      const response = await api.get('/api/chats/unread')
      setUnreadChats(response.data)
    }
    getUnreadChats()
  }, [])

  function updateUnreadChats(unreadChats: UnreadChats) {
    setUnreadChats(unreadChats)
  }

  return (
    <UnreadChatsContext.Provider value={{ unreadChats, updateUnreadChats }}>
      {children}
    </UnreadChatsContext.Provider>
  )
}

export const useUnreadChats = () => useContext(UnreadChatsContext)
